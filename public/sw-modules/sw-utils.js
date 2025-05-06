
// Utility functions for service worker

// Check if a request is a navigation request
export function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Check if a request is for an API
export function isApiRequest(url) {
  return url.includes('/api/') || url.includes('supabase.co');
}

// Check if a request is for a static asset
export function isStaticAsset(url, pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Create a response for when offline
export function createOfflineResponse() {
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Vendah+</title>
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #0b0b0f;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        .offline-container {
          max-width: 500px;
          padding: 30px;
          border-radius: 12px;
          background-color: #161622;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }
        h1 {
          color: #ba68c8;
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 20px;
          line-height: 1.6;
        }
        button {
          background-color: #ba68c8;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #9c49af;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1>Você está offline</h1>
        <p>Não foi possível carregar esta página porque você está sem conexão com a internet.</p>
        <p>Algumas funções continuam disponíveis enquanto você estiver offline.</p>
        <button onclick="window.location.reload()">Tentar novamente</button>
      </div>
    </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  );
}

// Log with consistent format for better debugging
export function logSW(message, level = 'info') {
  const prefix = '[Vendah+ SW]';
  switch (level) {
    case 'error':
      console.error(`${prefix} ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}
