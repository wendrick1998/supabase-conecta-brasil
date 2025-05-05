
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// Constants
const FACEBOOK_APP_SECRET = Deno.env.get("FACEBOOK_APP_SECRET");
const VERIFY_TOKEN = Deno.env.get("META_WEBHOOK_VERIFY_TOKEN") || "vendah-webhook-verify-token";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for admin operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const url = new URL(req.url);
    
    // Webhook Verification (GET request from Meta)
    if (req.method === 'GET') {
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');
      
      // Verify the mode and token
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Respond with the challenge token from the request
        return new Response(challenge, {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        });
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        return new Response('Forbidden', {
          status: 403,
          headers: corsHeaders
        });
      }
    }
    
    // Webhook Event Handling (POST request from Meta)
    if (req.method === 'POST') {
      // Get the webhook token from query parameter
      const webhookToken = url.searchParams.get('token');
      
      if (!webhookToken) {
        return new Response(JSON.stringify({ error: 'Webhook token required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Verify the webhook token against canais_conectados
      const { data: connection, error: connectionError } = await supabase
        .from('canais_conectados')
        .select('id, canal, configuracao')
        .eq('webhook_token', webhookToken)
        .eq('status', true)
        .single();
      
      if (connectionError || !connection) {
        console.error('Invalid webhook token or connection not found:', connectionError);
        return new Response(JSON.stringify({ error: 'Invalid webhook token' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Get the request body
      const body = await req.json();
      console.log('Webhook payload:', JSON.stringify(body));
      
      // Process Facebook Page messaging events
      if (body.object === 'page') {
        // Process each entry (there may be multiple)
        for (const entry of body.entry) {
          const pageId = entry.id;
          
          // Process messaging events
          if (entry.messaging) {
            for (const messagingEvent of entry.messaging) {
              const senderId = messagingEvent.sender.id;
              const recipientId = messagingEvent.recipient.id;
              
              if (messagingEvent.message) {
                // Text message
                const messageText = messagingEvent.message.text;
                
                // Process the message
                await processMessage({
                  platform: 'Facebook',
                  connectionId: connection.id,
                  senderId,
                  messageText,
                  timestamp: new Date(messagingEvent.timestamp).toISOString(),
                  supabase
                });
              }
            }
          }
        }
      }
      
      // Process Instagram messaging events
      if (body.object === 'instagram') {
        // Process each entry (there may be multiple)
        for (const entry of body.entry) {
          // Process messaging events
          if (entry.messaging) {
            for (const messagingEvent of entry.messaging) {
              const senderId = messagingEvent.sender.id;
              const recipientId = messagingEvent.recipient.id;
              
              if (messagingEvent.message) {
                // Text message
                const messageText = messagingEvent.message.text;
                
                // Process the message
                await processMessage({
                  platform: 'Instagram',
                  connectionId: connection.id,
                  senderId,
                  messageText,
                  timestamp: new Date(messagingEvent.timestamp).toISOString(),
                  supabase
                });
              }
            }
          }
        }
      }
      
      // Always return a 200 OK to acknowledge receipt of the webhook
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Return error for unsupported methods
    return new Response(JSON.stringify({ error: 'Method not supported' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper function to process messages
async function processMessage({ 
  platform, 
  connectionId,
  senderId,
  messageText,
  timestamp,
  supabase
}: {
  platform: 'Facebook' | 'Instagram';
  connectionId: string;
  senderId: string;
  messageText: string;
  timestamp: string;
  supabase: any;
}) {
  try {
    // First, check if we have a conversation for this sender
    let { data: existingConversation, error: convError } = await supabase
      .from('conversations')
      .select('id, lead_id')
      .eq('canal', platform === 'Facebook' ? 'Facebook' : 'Instagram')
      .eq('connection_id', connectionId)
      .eq('sender_id', senderId)
      .limit(1)
      .single();
    
    let conversationId: string;
    let leadId: string;
    
    if (convError || !existingConversation) {
      // Get user profile from Meta API
      // This would be implemented in a real application
      const userProfile = {
        name: `${platform} User`,
        profile_pic: null
      };
      
      // Create a new lead
      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert({
          nome: userProfile.name,
          telefone: null,
          email: null,
          canal_id: connectionId
        })
        .select('id')
        .single();
      
      if (leadError) {
        throw new Error(`Failed to create lead: ${leadError.message}`);
      }
      
      leadId = newLead.id;
      
      // Create a new conversation
      const { data: newConversation, error: newConvError } = await supabase
        .from('conversations')
        .insert({
          lead_id: leadId,
          lead_nome: userProfile.name,
          canal: platform === 'Facebook' ? 'Facebook' : 'Instagram',
          connection_id: connectionId,
          sender_id: senderId,
          ultima_mensagem: messageText,
          nao_lida: true,
          horario: timestamp,
          avatar: userProfile.profile_pic
        })
        .select('id')
        .single();
      
      if (newConvError) {
        throw new Error(`Failed to create conversation: ${newConvError.message}`);
      }
      
      conversationId = newConversation.id;
    } else {
      // Use existing conversation
      conversationId = existingConversation.id;
      leadId = existingConversation.lead_id;
      
      // Update the conversation with new message
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          ultima_mensagem: messageText,
          nao_lida: true,
          horario: timestamp
        })
        .eq('id', conversationId);
      
      if (updateError) {
        throw new Error(`Failed to update conversation: ${updateError.message}`);
      }
    }
    
    // Save the message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: messageText,
        sender_type: 'lead',
        status: 'delivered',
        timestamp,
        canal_id: connectionId
      });
    
    if (messageError) {
      throw new Error(`Failed to save message: ${messageError.message}`);
    }
    
    // Check for automations that need to be triggered
    // This would be implemented in a real application
    
    console.log(`Processed ${platform} message from ${senderId} successfully`);
    return true;
  } catch (error) {
    console.error(`Error processing ${platform} message:`, error);
    return false;
  }
}
