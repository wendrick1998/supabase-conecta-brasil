
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants for Meta API
const FACEBOOK_APP_ID = Deno.env.get("FACEBOOK_APP_ID");
const FACEBOOK_APP_SECRET = Deno.env.get("FACEBOOK_APP_SECRET");
const REDIRECT_URI = Deno.env.get("META_REDIRECT_URI");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
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
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    // Initialize Supabase client with service role for admin operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Authorization URL endpoint - redirects user to Meta's auth page
    if (action === 'authorize') {
      const stateParam = Math.random().toString(36).substring(2);
      const platform = url.searchParams.get('platform') || 'facebook';
      
      // Store state parameter to verify callback
      await supabase
        .from('oauth_state')
        .insert({ state: stateParam, platform, expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() });
      
      // Define scopes based on platform
      let scopes = '';
      if (platform === 'instagram') {
        scopes = 'instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_messages';
      } else { // facebook
        scopes = 'pages_show_list,pages_messaging,pages_manage_metadata,pages_read_engagement';
      }
      
      // Redirect to Meta authorization page
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${FACEBOOK_APP_ID}` +
        `&redirect_uri=${REDIRECT_URI}` +
        `&state=${stateParam}` +
        `&scope=${scopes}`;
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': authUrl
        }
      });
    }
    
    // Callback endpoint - handles the redirect from Meta with authorization code
    if (action === 'callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      
      if (!code || !state) {
        return new Response(JSON.stringify({ error: 'Missing code or state parameter' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Verify state parameter
      const { data: stateData, error: stateError } = await supabase
        .from('oauth_state')
        .select('platform')
        .eq('state', state)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (stateError || !stateData) {
        return new Response(JSON.stringify({ error: 'Invalid or expired state parameter' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Exchange code for access token
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${FACEBOOK_APP_ID}` +
        `&redirect_uri=${REDIRECT_URI}` +
        `&client_secret=${FACEBOOK_APP_SECRET}` +
        `&code=${code}`,
        { method: 'GET' }
      );
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        console.error('Error exchanging code for token:', tokenData.error);
        return new Response(JSON.stringify({ error: 'Failed to exchange code for token' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const { access_token, expires_in } = tokenData;
      
      // Get user information
      const userResponse = await fetch(
        `https://graph.facebook.com/me?fields=id,name&access_token=${access_token}`,
        { method: 'GET' }
      );
      
      const userData = await userResponse.json();
      
      if (userData.error) {
        console.error('Error getting user data:', userData.error);
        return new Response(JSON.stringify({ error: 'Failed to get user data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // For Facebook pages - get pages the user has access to
      let pageData = null;
      if (stateData.platform === 'facebook') {
        const pagesResponse = await fetch(
          `https://graph.facebook.com/me/accounts?access_token=${access_token}`,
          { method: 'GET' }
        );
        
        pageData = await pagesResponse.json();
        
        if (pageData.error) {
          console.error('Error getting page data:', pageData.error);
          return new Response(JSON.stringify({ error: 'Failed to get page data' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
      
      // For Instagram - get connected Instagram accounts
      let instagramData = null;
      if (stateData.platform === 'instagram') {
        // First get Facebook pages since Instagram business accounts are connected to Pages
        const pagesResponse = await fetch(
          `https://graph.facebook.com/me/accounts?access_token=${access_token}`,
          { method: 'GET' }
        );
        
        const pagesData = await pagesResponse.json();
        
        if (!pagesData.error && pagesData.data && pagesData.data.length > 0) {
          // For each page, get the connected Instagram business account
          const instagramAccounts = [];
          
          for (const page of pagesData.data) {
            const pageToken = page.access_token;
            const igResponse = await fetch(
              `https://graph.facebook.com/${page.id}?fields=instagram_business_account&access_token=${pageToken}`,
              { method: 'GET' }
            );
            
            const igData = await igResponse.json();
            
            if (!igData.error && igData.instagram_business_account) {
              // Get details of the Instagram account
              const igDetailsResponse = await fetch(
                `https://graph.facebook.com/${igData.instagram_business_account.id}?fields=name,username,profile_picture_url&access_token=${pageToken}`,
                { method: 'GET' }
              );
              
              const igDetails = await igDetailsResponse.json();
              
              if (!igDetails.error) {
                instagramAccounts.push({
                  id: igData.instagram_business_account.id,
                  page_id: page.id,
                  page_token: pageToken,
                  username: igDetails.username,
                  name: igDetails.name,
                  profile_picture_url: igDetails.profile_picture_url
                });
              }
            }
          }
          
          instagramData = { data: instagramAccounts };
        }
      }
      
      // Calculate token expiration
      const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();
      
      // Store the connection in the database
      const { data: connection, error: connectionError } = await supabase
        .from('canais_conectados')
        .insert({
          nome: userData.name,
          canal: stateData.platform,
          status: true,
          acesso_token: access_token,
          token_expira_em: expiresAt,
          configuracao: {
            user_id: userData.id,
            pages: pageData?.data || [],
            instagram_accounts: instagramData?.data || []
          }
        })
        .select()
        .single();
      
      if (connectionError) {
        console.error('Error storing connection:', connectionError);
        return new Response(JSON.stringify({ error: 'Failed to store connection' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Clean up state data
      await supabase
        .from('oauth_state')
        .delete()
        .eq('state', state);
      
      // Redirect back to the app with success message
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Conexão realizada com sucesso</title>
            <script>
              window.onload = function() {
                window.opener.postMessage({
                  type: 'META_AUTH_SUCCESS',
                  platform: '${stateData.platform}',
                  connection: ${JSON.stringify(connection)}
                }, '*');
                setTimeout(function() {
                  window.close();
                }, 2000);
              }
            </script>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                text-align: center;
                padding: 50px;
              }
              .success {
                color: #4caf50;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .message {
                color: #666;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="success">✓ Conexão realizada com sucesso!</div>
            <div class="message">Conta ${stateData.platform} conectada com sucesso.</div>
            <div class="message">Fechando esta janela automaticamente...</div>
          </body>
        </html>
      `, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html'
        }
      });
    }
    
    // Setup webhook endpoint
    if (action === 'setup-webhook') {
      const { data } = await req.json();
      const { platform, page_id, page_token } = data;
      
      try {
        // Generate a random webhook token
        const webhookToken = Math.random().toString(36).substring(2);
        
        // Webhook callback URL
        const callbackUrl = `${req.headers.get('origin')}/api/functions/v1/meta-webhook?token=${webhookToken}`;
        
        // For Facebook Pages
        if (platform === 'facebook') {
          // Subscribe to Facebook Page webhooks
          const subscribeResponse = await fetch(
            `https://graph.facebook.com/${page_id}/subscribed_apps?access_token=${page_token}`,
            { method: 'POST' }
          );
          
          const subscribeData = await subscribeResponse.json();
          
          if (!subscribeData.success) {
            return new Response(JSON.stringify({ error: 'Failed to subscribe to page webhooks' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }
        
        // Update the channel connection with webhook token
        const { error: updateError } = await supabase
          .from('canais_conectados')
          .update({ webhook_token: webhookToken })
          .eq('id', data.connection_id);
        
        if (updateError) {
          return new Response(JSON.stringify({ error: 'Failed to update connection with webhook token' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          webhook_url: callbackUrl,
          webhook_token: webhookToken
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error setting up webhook:', error);
        return new Response(JSON.stringify({ error: 'Failed to set up webhook' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Return error for unknown action
    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
