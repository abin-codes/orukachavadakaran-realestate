export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('provider');

  console.log('=== AUTH CALLBACK STARTED ===');
  console.log('Provider:', provider);
  console.log('Has code:', !!code);

  if (provider === 'github' && !code) {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/auth-callback`;
    const scope = 'repo,user';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    
    console.log('→ Redirecting to GitHub OAuth');
    return Response.redirect(githubAuthUrl, 302);
  }

  if (!code) {
    console.log('ERROR: No authorization code');
    return new Response('No authorization code provided', { status: 400 });
  }

  console.log('→ Exchanging code for token...');

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await tokenResponse.json();
    
    console.log('→ Token response:', {
      hasToken: !!data.access_token,
      scope: data.scope,
      error: data.error
    });

    if (data.error) {
      console.log('ERROR:', data.error_description);
      return new Response(`GitHub OAuth error: ${data.error_description}`, { status: 400 });
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DEBUG MODE - Authorizing...</title>
  <style>
    body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #fff; }
    pre { background: #000; padding: 10px; overflow: auto; }
  </style>
  <script>
    console.log('=== AUTH POPUP LOADED ===');
    console.log('Token data:', ${JSON.stringify(JSON.stringify(data))});
    
    var countdown = 15;
    
    window.addEventListener('DOMContentLoaded', function() {
      console.log('DOM loaded');
      
      var countdownEl = document.getElementById('countdown');
      
      // Countdown timer
      var timer = setInterval(function() {
        countdown--;
        countdownEl.textContent = countdown;
        console.log('Closing in', countdown, 'seconds...');
        
        if (countdown <= 0) {
          clearInterval(timer);
          sendAuthMessage();
        }
      }, 1000);
      
      // Allow manual trigger
      document.getElementById('sendNow').addEventListener('click', function() {
        clearInterval(timer);
        sendAuthMessage();
      });
      
      function sendAuthMessage() {
        console.log('Sending auth message to parent...');
        
        var receiveMessage = function(event) {
          console.log('Received message from parent:', event.data);
          window.opener.postMessage(
            'authorization:github:success:' + ${JSON.stringify(JSON.stringify(data))},
            event.origin
          );
        };
        
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
        
        console.log('Message sent! Check parent window console.');
      }
      
      // Display token info
      document.getElementById('tokenInfo').textContent = JSON.stringify(${JSON.stringify(data)}, null, 2);
    });
  </script>
</head>
<body>
  <h2>🐛 DEBUG MODE - Auth Callback</h2>
  <p><strong>Window will auto-close in: <span id="countdown">15</span> seconds</strong></p>
  <p><button id="sendNow" style="padding: 10px;">Send Auth Now & Close</button></p>
  
  <h3>Token Data:</h3>
  <pre id="tokenInfo"></pre>
  
  <h3>Instructions:</h3>
  <ol>
    <li>Open DevTools Console (F12) on THIS window</li>
    <li>Check console messages above</li>
    <li>Take screenshot of console</li>
    <li>Click "Send Auth Now" or wait for auto-send</li>
  </ol>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (error) {
    console.log('EXCEPTION:', error.message);
    return new Response(`Authentication failed: ${error.message}`, { status: 500 });
  }
}
