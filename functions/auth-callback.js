export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Log all parameters for debugging
  console.log('All URL params:', Object.fromEntries(url.searchParams));
  
  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('provider');
  const site_id = url.searchParams.get('site_id');

  // If it's a Decap CMS request without GitHub code, redirect to GitHub OAuth
  if (provider === 'github' && !code) {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/auth-callback`;
    const scope = url.searchParams.get('scope') || 'repo,user';
    
    // Redirect to GitHub OAuth
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    
    return Response.redirect(githubAuthUrl, 302);
  }

  // If we have a code from GitHub, exchange it for token
  if (!code) {
    return new Response('No authorization code provided', { status: 400 });
  }

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

    if (data.error) {
      return new Response(`GitHub OAuth error: ${data.error_description}`, { status: 400 });
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Authenticating...</title>
</head>
<body>
  <script>
    (function() {
      function receiveMessage(e) {
        console.log("receiveMessage %o", e);
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify(data)}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      console.log("Sending message: %o", "authorizing:github");
      window.opener.postMessage("authorizing:github", "*");
    })()
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    return new Response(`Authentication failed: ${error.message}`, { status: 500 });
  }
}
