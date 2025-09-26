'use strict';

const { callOpenAI } = require('../services/openaiService');

async function diagram(req, res) {
  try {
    const { outline } = req.body || {};
    if (!outline || typeof outline !== 'string') {
      return res.status(400).json({ error: 'Missing required field: outline (string)' });
    }

    const messages = [
      { role: 'system', content: 'You convert IA outlines into concise diagram JSON (nodes and edges).' },
      { role: 'user', content: `Given this IA outline, output a minimal JSON with nodes and edges for a site map diagram.\n\n${outline}` },
    ];

    const text = await callOpenAI(messages, { temperature: 0.2, max_tokens: 1200 });
    return res.json({ result: text });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, code: err.code || 'UNKNOWN' });
  }
}

module.exports = { diagram };
