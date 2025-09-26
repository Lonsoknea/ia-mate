'use strict';

const { callOpenAI } = require('../services/openaiService');

async function analyze(req, res) {
  try {
    const { description } = req.body || {};
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Missing required field: description (string)' });
    }

    const messages = [
      { role: 'system', content: 'You are an IA assistant that analyzes user descriptions.' },
      { role: 'user', content: `Analyze the following product/website description and outline key IA considerations:\n\n${description}` },
    ];

    const text = await callOpenAI(messages, { temperature: 0.2 });
    return res.json({ result: text });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, code: err.code || 'UNKNOWN' });
  }
}

module.exports = { analyze };
