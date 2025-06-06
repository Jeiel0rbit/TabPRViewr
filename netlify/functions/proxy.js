// netlify/functions/proxy.js

 const fetch = require('node-fetch');

// Handler principal da função Netlify.
// 'event' contém informações sobre a requisiçã0...
// 'context' contém informações sobre o ambiente e o usuário!
exports.handler = async (event, context) => {
  // Garante que a requisição é um método GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405, // Método não permitido
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Obtém a URL de destino da requisição (a URL do GitHub ou patch/diff)
  // A URL é passada como um parâmetro de query chamado 'url' (ex: /api/proxy?url=...)
  const targetUrl = event.queryStringParameters.url;

  // Verifica se a URL de destino foi fornecida
  if (!targetUrl) {
    return {
      statusCode: 400, // Requisição inválida
      body: JSON.stringify({ message: 'Missing "url" query parameter' }),
    };
  }

  // A chave da API corsproxy.io é acessada via variável de ambiente
  // Esta variável deve ser configurada no Netlify.
  const corsProxyKey = process.env.CORS_PROXY_KEY;

  // Verifica se a chave do proxy está configurada
  if (!corsProxyKey) {
    console.error('CORS_PROXY_KEY environment variable is not set!');
    return {
      statusCode: 500, // Erro interno do servidor
      body: JSON.stringify({ message: 'Server configuration error: CORS_PROXY_KEY is missing.' }),
    };
  }

  // Constrói a URL completa para o serviço corsproxy.io
  // Codifica a URL de destino para garantir que é um URL válido no parâmetro 'url'
  const finalProxyUrl = `https://corsproxy.io/?key=${corsProxyKey}&url=${encodeURIComponent(targetUrl)}`;

  try {
    // Faz a requisição ao serviço corsproxy.io
    const response = await fetch(finalProxyUrl);

    // Se a resposta do corsproxy.io não for OK, retorna o status e corpo da resposta
    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status, // Retorna o status HTTP original do erro
        headers: { 'Content-Type': response.headers.get('Content-Type') || 'text/plain' },
        body: errorText, // Retorna o corpo do erro
      };
    }

    // Obtém o tipo de conteúdo da resposta
    const contentType = response.headers.get('Content-Type');

    // Retorna a resposta do corsproxy.io diretamente ao cliente
    // O status é 200 OK e o corpo é o conteúdo da API de destino (GitHub)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType || 'application/json', // Define o tipo de conteúdo
        // Você pode adicionar cabeçalhos CORS aqui se precisar de mais controle
        'Access-Control-Allow-Origin': '*', // Permite que qualquer origem acesse esta função
        'Access-Control-Allow-Methods': 'GET', // Permite apenas requisições GET
      },
      body: await response.text(), // Retorna o conteúdo como texto (JSON ou Patch/Diff)
    };
  } catch (error) {
    console.error('Proxy function error:', error);
    return {
      statusCode: 500, // Erro interno do servidor
      body: JSON.stringify({ message: 'Failed to proxy request', error: error.message }),
    };
  }
};

