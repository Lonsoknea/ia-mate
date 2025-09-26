'use strict';

const { callOpenAI } = require('../services/openaiService');

async function generate(req, res) {
  try {
    const { description, constraints } = req.body || {};
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Missing required field: description (string)' });
    }

    const messages = [
      { role: 'system', content: 'You are an IA assistant that generates IA outlines.' },
      { role: 'user', content: `Generate a detailed information architecture outline based on this description. Consider constraints if provided.\n\nDescription: ${description}\nConstraints: ${constraints ?? 'None'}` },
    ];

    const text = await callOpenAI(messages, { temperature: 0.3, max_tokens: 1200 });
    return res.json({ result: text });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, code: err.code || 'UNKNOWN' });
  }
}

module.exports = { generate };
