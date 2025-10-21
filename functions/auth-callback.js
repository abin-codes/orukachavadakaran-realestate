export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('provider');

  console.log('=== AUTH CALLBACK STARTED ===');
  console.log('Provider:', provider);
  console.log('Has code:', !!code);
  console.log('Has CLIENT_ID:', !!env.GITHUB_CLIENT_ID);
  console.log('Has CLIENT_SECRET:', !!env.GITHUB_CLIENT_SECRET);

  // Step 1: If Decap CMS initiates auth, redirect to GitHub
  if (provider === 'github' && !code) {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/auth-callback`;
    const scope = 'repo,user';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    
    console.log('→ Redirecting to GitHub OAuth');
    console.log('  Client ID:', clientId);
    console.log('  Redirect URI:', redirectUri);
    console.log('  Scope:', scope);
    
    return Response.redirect(githubAuthUrl, 302);
  }

  // Step 2: Handle GitHub's callback with code
  if (!code) {
    console.log('ERROR: No authorization code');
    return new Response('No authorization code provided', { status: 400 });
  }

  console.log('→ Exchanging code for token...');

  try {
    const tokenRequest = {
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: code,
    };
    
    console.log('Token request (without secret):', {
      client_id: tokenRequest.client_id,
      code_length: code.length
    });

    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(tokenRequest),
    });

    const data = await tokenResponse.json();
    
    console.log('→ Token response received:');
    console.log('  Has access_token:', !!data.access_token);
    console.log('  Token type:', data.token_type);
    console.log('  Scope:', data.scope);
    console.log('  Error:', data.error);
    
    if (data.access_token) {
      console.log('  Token preview:', data.access_token.substring(0, 10) + '...');
    }

    if (data.error) {
      console.log('ERROR from GitHub:', data.error_description);
      return new Response(`GitHub OAuth error: ${data.error_description}`, { status: 400 });
    }

    console.log('→ Returning auth HTML to browser');

    // Return HTML that sends token back to CMS
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
  <script>
    console.log('=== AUTH POPUP LOADED ===');
    console.log('Token data received:', ${JSON.stringify(JSON.stringify(data))});
    
    window.addEventListener('DOMContentLoaded', function() {
      console.log('DOM loaded, setting up message handlers');
      
      var receiveMessage = function(event) {
        console.log('Received message from parent:', event.data);
        
        var message = 'authorization:github:success:' + ${JSON.stringify(JSON.stringify(data))};
        console.log('Sending success message back:', message.substring(0, 50) + '...');
        
        window.opener.postMessage(message, event.origin);
      };
      
      window.addEventListener('message', receiveMessage, false);
      
      console.log('Sending initial authorizing message');
      window.opener.postMessage('authorizing:github', '*');
    });
  </script>
</head>
<body>
  <p>Authorization successful. Redirecting...</p>
  <p style="font-size: 10px; color: #666;">Check console for debug info</p>
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
    console.error(error);
    return new Response(`Authentication failed: ${error.message}`, { status: 500 });
  }
}
