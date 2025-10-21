export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('provider');

  // Step 1: If Decap CMS initiates auth, redirect to GitHub
  if (provider === 'github' && !code) {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/auth-callback`;
    const scope = 'repo,user';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    
    return Response.redirect(githubAuthUrl, 302);
  }

  // Step 2: Handle GitHub's callback with code
  if (!code) {
    return new Response('No authorization code provided', { status: 400 });
  }

  try {
    // Exchange code for token
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

    if (data.error) {
      return new Response(`GitHub OAuth error: ${data.error_description}`, { status: 400 });
    }

    // Return HTML that sends token back to CMS
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
  <script>
    window.addEventListener('DOMContentLoaded', function() {
      var receiveMessage = function(event) {
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify(${JSON.stringify(data)}),
          event.origin
        );
      };
      
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    });
  </script>
</head>
<body>
  <p>Authorization successful. Redirecting...</p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (error) {
    return new Response(`Authentication failed: ${error.message}`, { status: 500 });
  }
}
