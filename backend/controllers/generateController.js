'use strict';

const { callOpenAI } = require('../services/openaiService');
const { GENERATOR_PROMPT } = require('../prompts/promptTemplates');

function buildMessagesFromAnalysis(analysis) {
  // analysis can be an object or string
  const json = typeof analysis === 'string' ? analysis : JSON.stringify(analysis);
  const prompt = GENERATOR_PROMPT.replace('{{ANALYZER_JSON}}', json);
  return [
    { role: 'system', content: 'Follow instructions strictly. Output ONLY valid JSON.' },
    { role: 'user', content: prompt },
  ];
}

function tryParseJSONLoose(text) {
  if (typeof text !== 'string') return null;
  let s = text.trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```[a-zA-Z]*\n?/, '');
    s = s.replace(/\n?```\s*$/, '');
  }
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    const cand = s.slice(first, last + 1);
    try { return JSON.parse(cand); } catch {}
  }
  try { return JSON.parse(s); } catch { return null; }
}

function validateStructureShape(obj) {
  if (!obj || typeof obj !== 'object') return false;
  // accept either array or object under "structure"
  const st = obj.structure;
  return typeof st === 'object' || Array.isArray(st);
}

async function generate(req, res) {
  try {
    const { analysis, description, constraints } = req.body || {};

    let messages;
    if (analysis) {
      messages = buildMessagesFromAnalysis(analysis);
    } else if (description) {
      // If only description provided, wrap it in a minimal analysis object
      const fallback = { outline: description, constraints: constraints ?? null };
      messages = buildMessagesFromAnalysis(fallback);
    } else {
      return res.status(400).json({ error: 'Missing required field: analysis (preferred) or description' });
    }

    const text = await callOpenAI(messages, { temperature: 0.3, max_tokens: 1500 });
    const parsed = tryParseJSONLoose(text);
    if (!validateStructureShape(parsed)) {
      return res.status(502).json({
        error: 'Failed to parse/validate generator JSON. Ensure it returns { "structure": ... }',
        modelOutput: text,
        hint: 'Return ONLY JSON with a top-level "structure" key (array or object) and optional "notes".',
      });
    }

    return res.json({ structure: parsed.structure, notes: parsed.notes });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, code: err.code || 'UNKNOWN' });
  }
}

module.exports = { generate };
