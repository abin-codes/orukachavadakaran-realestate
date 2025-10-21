export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('provider');

  // Step 1: Redirect to GitHub for authorization
  if (provider === 'github' && !code) {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/auth-callback`;
    const scope = 'public_repo,user';
    
    console.log('🔁 Redirecting to GitHub auth with:', clientId, redirectUri);
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    return Response.redirect(githubAuthUrl, 302);
  }

  // Step 2: Handle GitHub callback
  if (!code) {
    console.error('❌ No authorization code provided');
    return new Response('No authorization code provided', { status: 400 });
  }

  try {
    console.log('🔐 Exchanging code for token...');
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
    console.log('✅ GitHub response data:', data);

    if (data.error) {
      console.error('❌ GitHub OAuth error:', data.error_description);
      return new Response(`GitHub OAuth error: ${data.error_description}`, { status: 400 });
    }

    // Send token back to CMS
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Authorizing...</title></head>
<body>
  <script>
    window.opener.postMessage(
      'authorization:github:success:' + JSON.stringify(${JSON.stringify(data)}),
      '*'
    );
    window.close();
  </script>
  <p>Authorization successful. You can close this window.</p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    console.error('💥 Authentication failed:', error);
    return new Response(`Authentication failed: ${error.message}`, { status: 500 });
  }
}
