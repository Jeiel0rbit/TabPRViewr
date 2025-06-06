exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const targetUrl = event.queryStringParameters.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing "url" query parameter' }),
    };
  }

  const corsProxyKey = process.env.CORS_PROXY_KEY;

  if (!corsProxyKey) {
    console.error('CORS_PROXY_KEY environment variable is not set!');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server configuration error: CORS_PROXY_KEY is missing.' }),
    };
  }

  const finalProxyUrl = `https://corsproxy.io/?key=${corsProxyKey}&url=${encodeURIComponent(targetUrl)}`;

  try {
    const response = await fetch(finalProxyUrl);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        headers: { 'Content-Type': response.headers.get('Content-Type') || 'text/plain' },
        body: errorText,
      };
    }

    const contentType = response.headers.get('Content-Type');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: await response.text(),
    };
  } catch (error) {
    console.error('Proxy function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to proxy request', error: error.message }),
    };
  }
};

