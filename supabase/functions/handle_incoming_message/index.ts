
// Supabase Edge Function to handle incoming messages
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface Message {
  phone: string;
  message: string;
  channel: "WhatsApp" | "Instagram" | "Email";
  name?: string;
  avatar?: string;
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  try {
    // Setup client with service role key for admin operations
    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Parse incoming payload
    const payload: Message = await req.json();
    
    if (!payload.phone || !payload.message || !payload.channel) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if conversation exists for this phone number
    let { data: existingConversation, error: findError } = await supabaseAdmin
      .from('conversations')
      .select('id, lead_id, lead_nome')
      .eq('telefone', payload.phone)
      .limit(1)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Error finding conversation:", findError);
      return new Response(
        JSON.stringify({ error: "Database error while finding conversation" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let conversationId: string;
    let leadId: string;
    
    // If conversation doesn't exist, create a new lead and conversation
    if (!existingConversation) {
      // Create a new lead
      const { data: newLead, error: leadError } = await supabaseAdmin
        .from('leads')
        .insert({
          nome: payload.name || `Lead (${payload.channel})`,
          telefone: payload.phone,
        })
        .select('id')
        .single();

      if (leadError) {
        console.error("Error creating lead:", leadError);
        return new Response(
          JSON.stringify({ error: "Failed to create lead" }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      leadId = newLead.id;
      
      // Create a new conversation
      const { data: newConversation, error: convError } = await supabaseAdmin
        .from('conversations')
        .insert({
          lead_id: leadId,
          lead_nome: payload.name || `Lead (${payload.channel})`,
          canal: payload.channel,
          ultima_mensagem: payload.message,
          nao_lida: true,
          avatar: payload.avatar,
        })
        .select('id')
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
        return new Response(
          JSON.stringify({ error: "Failed to create conversation" }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      conversationId = newConversation.id;
      
      // Check for automations with "new_lead" trigger
      await processNewLeadAutomations(supabaseAdmin, leadId, payload.channel);
    } else {
      // Use existing conversation
      conversationId = existingConversation.id;
      leadId = existingConversation.lead_id;
      
      // Update existing conversation with latest message
      const { error: updateError } = await supabaseAdmin
        .from('conversations')
        .update({
          ultima_mensagem: payload.message,
          nao_lida: true,
          horario: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (updateError) {
        console.error("Error updating conversation:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update conversation" }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check for automations with "message_received" trigger
      await processMessageReceivedAutomations(supabaseAdmin, leadId, payload.message, payload.channel);
    }

    // Add message to the conversation
    const { error: messageError } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: payload.message,
        sender_type: 'customer',
      });

    if (messageError) {
      console.error("Error adding message:", messageError);
      return new Response(
        JSON.stringify({ error: "Failed to add message" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        conversation_id: conversationId,
        lead_id: leadId
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
});

// Helper function to process automations with "new_lead" trigger
async function processNewLeadAutomations(supabase, leadId: string, channel: string) {
  try {
    // Get active automations with new_lead trigger
    const { data: automations, error } = await supabase
      .from('automacoes')
      .select(`
        id, 
        nome,
        blocos_automacao!inner(*)
      `)
      .eq('status', 'ativa')
      .eq('blocos_automacao.tipo', 'new_lead');
    
    if (error) {
      console.error("Error fetching new_lead automations:", error);
      return;
    }
    
    // Process each automation
    for (const automation of automations || []) {
      await executeAutomationFlow(supabase, automation, leadId, { channel });
    }
  } catch (err) {
    console.error("Error in processing new lead automations:", err);
  }
}

// Helper function to process automations with "message_received" trigger
async function processMessageReceivedAutomations(supabase, leadId: string, message: string, channel: string) {
  try {
    // Get active automations with message_received trigger
    const { data: automations, error } = await supabase
      .from('automacoes')
      .select(`
        id, 
        nome,
        blocos_automacao!inner(*)
      `)
      .eq('status', 'ativa')
      .eq('blocos_automacao.tipo', 'message_received');
    
    if (error) {
      console.error("Error fetching message_received automations:", error);
      return;
    }
    
    // Process each automation
    for (const automation of automations || []) {
      await executeAutomationFlow(supabase, automation, leadId, { message, channel });
    }
  } catch (err) {
    console.error("Error in processing message received automations:", err);
  }
}

// Execute the automation workflow
async function executeAutomationFlow(supabase, automation, leadId: string, context: any) {
  try {
    // Get all blocks for this automation
    const { data: blocks, error: blocksError } = await supabase
      .from('blocos_automacao')
      .select('*')
      .eq('automacao_id', automation.id);
    
    if (blocksError) {
      console.error(`Error fetching blocks for automation ${automation.id}:`, blocksError);
      return;
    }
    
    // Get all connections
    const { data: connections, error: connectionsError } = await supabase
      .from('conexoes_blocos')
      .select('*')
      .eq('automacao_id', automation.id);
    
    if (connectionsError) {
      console.error(`Error fetching connections for automation ${automation.id}:`, connectionsError);
      return;
    }
    
    // Find trigger block
    const triggerBlock = blocks.find(block => 
      ['new_lead', 'lead_moved', 'message_received'].includes(block.tipo)
    );
    
    if (!triggerBlock) {
      console.error(`No trigger block found for automation ${automation.id}`);
      return;
    }
    
    // Process connected blocks recursively
    await processConnectedBlocks(supabase, triggerBlock, blocks, connections, leadId, context);
    
    // Log execution
    await supabase
      .from('automacao_execucoes')
      .insert({
        automacao_id: automation.id,
        lead_id: leadId,
        status: 'concluída',
        detalhes: JSON.stringify({ trigger: triggerBlock.tipo, context })
      });
    
  } catch (err) {
    console.error(`Error executing automation flow ${automation.id}:`, err);
    
    // Log failed execution
    await supabase
      .from('automacao_execucoes')
      .insert({
        automacao_id: automation.id,
        lead_id: leadId,
        status: 'falha',
        detalhes: JSON.stringify({ error: err.message })
      });
  }
}

// Process blocks recursively following connections
async function processConnectedBlocks(supabase, currentBlock, allBlocks, connections, leadId: string, context: any) {
  // Get next blocks connected to the current block
  const nextConnections = connections.filter(conn => conn.id_origem === currentBlock.id);
  
  for (const connection of nextConnections) {
    const nextBlock = allBlocks.find(block => block.id === connection.id_destino);
    
    if (!nextBlock) continue;
    
    // Process based on block type
    if (['lead_status', 'lead_source', 'value_greater'].includes(nextBlock.tipo)) {
      // This is a condition block
      const conditionMet = await evaluateCondition(supabase, nextBlock, leadId, context);
      
      if (conditionMet) {
        // Continue to next blocks only if condition is met
        await processConnectedBlocks(supabase, nextBlock, allBlocks, connections, leadId, context);
      }
    } else if (['send_message', 'create_task', 'move_pipeline'].includes(nextBlock.tipo)) {
      // This is an action block
      await executeAction(supabase, nextBlock, leadId, context);
      
      // Continue to next blocks after action
      await processConnectedBlocks(supabase, nextBlock, allBlocks, connections, leadId, context);
    }
  }
}

// Evaluate condition blocks
async function evaluateCondition(supabase, conditionBlock, leadId: string, context: any) {
  try {
    const config = conditionBlock.conteudo_config;
    
    switch (conditionBlock.tipo) {
      case 'lead_status':
        // Get lead's current status
        const { data: lead, error } = await supabase
          .from('leads')
          .select('estagio_id')
          .eq('id', leadId)
          .single();
        
        if (error) return false;
        
        // Compare with condition
        return lead.estagio_id === config.status;
        
      case 'lead_source':
        return context.channel === config.source;
        
      case 'value_greater':
        // For value comparison, we would need a value field in the lead
        // This is a placeholder implementation
        return (context.value || 0) > config.threshold;
        
      default:
        return false;
    }
  } catch (err) {
    console.error(`Error evaluating condition ${conditionBlock.id}:`, err);
    return false;
  }
}

// Execute action blocks
async function executeAction(supabase, actionBlock, leadId: string, context: any) {
  try {
    const config = actionBlock.conteudo_config;
    
    switch (actionBlock.tipo) {
      case 'send_message': {
        // Get conversation for this lead
        const { data: conversation, error } = await supabase
          .from('conversations')
          .select('id')
          .eq('lead_id', leadId)
          .order('horario', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.error("Error finding conversation for send_message:", error);
          return;
        }
        
        // Process message template (replace variables)
        let messageContent = config.message || "Automated message";
        
        // Replace variables in the message with actual values
        if (context.name) messageContent = messageContent.replace(/{nome}/g, context.name);
        
        // Send the message
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversation.id,
            content: messageContent,
            sender_type: 'system',
          });
        
        // Update conversation
        await supabase
          .from('conversations')
          .update({
            ultima_mensagem: `Sistema: ${messageContent}`,
            horario: new Date().toISOString()
          })
          .eq('id', conversation.id);
        
        break;
      }
      
      case 'create_task': {
        // Create a new task for this lead
        let taskTitle = config.title || "Tarefa automática";
        
        // Replace variables in the title
        if (context.name) taskTitle = taskTitle.replace(/{nome}/g, context.name);
        
        // Calculate due date if specified
        let dueDate = null;
        if (config.dueDate) {
          if (config.dueDate.startsWith('+')) {
            // Format like '+3d' for 3 days from now
            const days = parseInt(config.dueDate.substring(1, config.dueDate.length - 1));
            const date = new Date();
            date.setDate(date.getDate() + days);
            dueDate = date.toISOString();
          } else {
            dueDate = config.dueDate;
          }
        }
        
        await supabase
          .from('tarefas')
          .insert({
            lead_id: leadId,
            titulo: taskTitle,
            descricao: config.description || "Tarefa criada automaticamente",
            data_vencimento: dueDate
          });
        
        break;
      }
      
      case 'move_pipeline': {
        // Move lead to a different pipeline stage
        if (config.stage) {
          await supabase
            .from('leads')
            .update({ estagio_id: config.stage })
            .eq('id', leadId);
        }
        
        break;
      }
    }
  } catch (err) {
    console.error(`Error executing action ${actionBlock.id}:`, err);
  }
}
