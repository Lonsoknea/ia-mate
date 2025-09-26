'use strict';

const { callOpenAI } = require('../services/openaiService');

async function refine(req, res) {
  try {
    const { outline, feedback } = req.body || {};
    if (!outline || typeof outline !== 'string') {
      return res.status(400).json({ error: 'Missing required field: outline (string)' });
    }

    const messages = [
      { role: 'system', content: 'You refine IA outlines/diagrams based on user feedback while keeping structure clean.' },
      { role: 'user', content: `Refine the following IA based on the feedback.\n\nOutline:\n${outline}\n\nFeedback:\n${feedback ?? 'No additional feedback provided.'}` },
    ];

    const text = await callOpenAI(messages, { temperature: 0.3, max_tokens: 1200 });
    return res.json({ result: text });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, code: err.code || 'UNKNOWN' });
  }
}

module.exports = { refine };
