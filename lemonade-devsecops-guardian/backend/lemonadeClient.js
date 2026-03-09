const axios = require('axios');
const { SECURITY_PROMPT } = require('../shared/prompts');

const LEMONADE_BASE_URL = process.env.LEMONADE_BASE_URL || 'http://localhost:8000/v1';
const LEMONADE_API_KEY = process.env.LEMONADE_API_KEY || 'local';

const lemonade = axios.create({
  baseURL: LEMONADE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${LEMONADE_API_KEY}`,
  },
  timeout: 60_000,
});

function safeParseAnalysis(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {
      vulnerabilities: [
        {
          type: 'ParseError',
          severity: 'medium',
          explanation: 'The model response was not valid JSON. Raw response returned for debugging.',
          fix: text,
        },
      ],
    };
  }
}

async function analyzeCode(code) {
  const payload = {
    model: 'llama-3',
    messages: [
      { role: 'system', content: SECURITY_PROMPT },
      { role: 'user', content: code },
    ],
    temperature: 0.1,
  };

  const response = await lemonade.post('/chat/completions', payload);
  const content = response?.data?.choices?.[0]?.message?.content || '{"vulnerabilities": []}';
  return safeParseAnalysis(content);
}

module.exports = {
  analyzeCode,
};
