'use strict';

const OpenAI = require('openai');

/**
 * callOpenAI(messages, options)
 * @param {Array<{role: 'system'|'user'|'assistant', content: string}>} messages
 * @param {{ model?: string, temperature?: number, max_tokens?: number }} [options]
 * @returns {Promise<string>} raw text content from the first choice
 * @throws Error with additional properties { status, code }
 */
async function callOpenAI(messages, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    const err = new Error('Missing OPENAI_API_KEY. Set it in your environment (.env).');
    err.status = 500;
    err.code = 'OPENAI_API_KEY_MISSING';
    throw err;
  }

  const client = new OpenAI({ apiKey });

  try {
    const resp = await client.chat.completions.create({
      model,
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.max_tokens ?? 800,
    });

    const choice = resp.choices?.[0]?.message?.content;
    if (!choice) {
      const err = new Error('OpenAI returned no choices.');
      err.status = 502;
      err.code = 'OPENAI_EMPTY_RESPONSE';
      throw err;
    }
    return choice;
  } catch (error) {
    // Normalize errors
    const norm = new Error(error?.message || 'OpenAI request failed');
    norm.status = error?.status || error?.response?.status || 500;
    norm.code = error?.code || error?.response?.data?.error?.code || 'OPENAI_ERROR';

    // Handle rate limiting specially
    if (norm.status === 429) {
      norm.message = 'Rate limit exceeded calling OpenAI. Please retry shortly.';
      norm.code = 'RATE_LIMITED';
    }
    throw norm;
  }
}

module.exports = { callOpenAI };
