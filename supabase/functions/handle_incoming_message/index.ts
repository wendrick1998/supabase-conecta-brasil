
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const apiKey = Deno.env.get('INCOMING_MESSAGE_API_KEY') ?? '';
    
    // Validate API key if provided
    const authHeader = req.headers.get('x-api-key');
    if (apiKey && authHeader !== apiKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse payload
    const payload = await req.json();
    const { channel, external_id, message, timestamp } = payload;
    
    console.log('Received message:', JSON.stringify(payload));

    if (!channel || !external_id || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields', details: 'channel, external_id, and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Find or create lead
    let leadId: string | null = null;
    
    // Search for lead with the external_id
    const { data: leads, error: leadSearchError } = await supabase
      .from('leads')
      .select('id, nome')
      .eq('telefone', external_id)
      .maybeSingle();

    if (leadSearchError) {
      console.error('Error searching for lead:', leadSearchError);
    }

    if (leads?.id) {
      leadId = leads.id;
      console.log(`Found existing lead with ID: ${leadId}`);
    } else {
      // Create new lead if not found
      const { data: newLead, error: newLeadError } = await supabase
        .from('leads')
        .insert({
          nome: `Lead ${external_id}`,
          telefone: external_id,
        })
        .select()
        .single();

      if (newLeadError) {
        console.error('Error creating new lead:', newLeadError);
        return new Response(
          JSON.stringify({ error: 'Failed to create lead', details: newLeadError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      leadId = newLead.id;
      console.log(`Created new lead with ID: ${leadId}`);
    }

    // 2. Find or create conversation
    let conversationId: string | null = null;
    
    // Look for an active conversation for this lead
    const { data: existingConversation, error: convSearchError } = await supabase
      .from('conversations')
      .select('id')
      .eq('lead_id', leadId)
      .eq('status', 'Aberta')
      .maybeSingle();

    if (convSearchError) {
      console.error('Error searching for conversation:', convSearchError);
    }

    if (existingConversation?.id) {
      conversationId = existingConversation.id;
      console.log(`Found active conversation with ID: ${conversationId}`);
      
      // Update the conversation's last message and timestamp
      await supabase
        .from('conversations')
        .update({ 
          ultima_mensagem: message.content,
          horario: new Date().toISOString(),
          nao_lida: true
        })
        .eq('id', conversationId);
    } else {
      // Create new conversation
      const { data: newConversation, error: newConvError } = await supabase
        .from('conversations')
        .insert({
          lead_id: leadId,
          lead_nome: leads?.nome || `Lead ${external_id}`,
          canal: channel,
          ultima_mensagem: message.content,
          status: 'Aberta',
          nao_lida: true
        })
        .select()
        .single();

      if (newConvError) {
        console.error('Error creating new conversation:', newConvError);
        return new Response(
          JSON.stringify({ error: 'Failed to create conversation', details: newConvError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      conversationId = newConversation.id;
      console.log(`Created new conversation with ID: ${conversationId}`);
    }

    // 3. Insert the message
    const messageTimestamp = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    
    const { data: newMessage, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: message.content,
        sender_type: 'lead',
        timestamp: messageTimestamp,
        status: 'delivered'
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error inserting message:', messageError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert message', details: messageError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Trigger automations (find automations with message_received triggers)
    // This can be expanded later to include complete automation execution
    const { data: automacoes, error: autoError } = await supabase
      .from('automacoes')
      .select(`
        id, 
        nome, 
        status,
        blocos_automacao!inner(
          id, 
          tipo,
          conteudo_config
        )
      `)
      .eq('status', 'ativa')
      .eq('blocos_automacao.tipo', 'message_received');

    if (!autoError && automacoes && automacoes.length > 0) {
      console.log(`Found ${automacoes.length} active automations with message_received triggers`);
      
      // Here you would normally execute each automation
      // For now, we'll just log them
      for (const automacao of automacoes) {
        console.log(`Should trigger automation: ${automacao.id} - ${automacao.nome}`);
        // Future: call execute_automation function
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Message processed successfully`,
        data: {
          conversation_id: conversationId,
          lead_id: leadId,
          message_id: newMessage.id
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
