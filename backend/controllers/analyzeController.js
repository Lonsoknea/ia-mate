'use strict';

const { callOpenAI } = require('../services/openaiService');
const { ANALYZER_PROMPT } = require('../prompts/promptTemplates');

function buildMessages(idea, requestedType) {
  // Build the system+user instruction using the ANALYZER_PROMPT with IDEA placeholder
  let prompt = ANALYZER_PROMPT.replace('{{IDEA}}', idea);
  if (requestedType && typeof requestedType === 'string') {
    // Append a small hint about requested type without breaking "ONLY JSON" constraint
    prompt += `\nNOTE: preferred IA type (if applicable): ${requestedType}`;
  }
  // We send the full template as a single user message to keep model deterministic,
  // along with a short system primer.
  const messages = [
    { role: 'system', content: 'Follow instructions strictly. Output ONLY a valid JSON object.' },
    { role: 'user', content: prompt },
  ];
  return messages;
}

function tryParseJSONLoose(text) {
  if (typeof text !== 'string') return null;
  // Strip markdown code fences ```json ... ``` or ``` ... ```
  let s = text.trim();
  if (s.startsWith('```')) {
    // remove first fence
    s = s.replace(/^```[a-zA-Z]*\n?/, '');
    // remove trailing fence
    s = s.replace(/\n?```\s*$/, '');
  }
  // Find first { and last } to isolate a JSON object
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    const candidate = s.slice(first, last + 1);
    try {
      return JSON.parse(candidate);
    } catch (_) {
      // fallthrough
    }
  }
  // Direct parse attempt as fallback
  try {
    return JSON.parse(s);
  } catch (_) {
    return null;
  }
}

function validateAnalysisShape(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const has = (k) => Object.prototype.hasOwnProperty.call(obj, k);
  if (!(has('entities') && Array.isArray(obj.entities))) return false;
  if (!(has('roles') && Array.isArray(obj.roles))) return false;
  if (!(has('features') && Array.isArray(obj.features))) return false;
  if (!(has('pages') && Array.isArray(obj.pages))) return false;
  if (!(has('suggested_pages') && Array.isArray(obj.suggested_pages))) return false;
  if (!has('recommended_ia') || typeof obj.recommended_ia !== 'object') return false;
  if (!(typeof obj.recommended_ia.type === 'string' && typeof obj.recommended_ia.reason === 'string')) return false;
  if (!(has('outline') && typeof obj.outline === 'string')) return false;
  return true;
}

async function analyze(req, res) {
  try {
    const { idea, requestedType } = req.body || {};
    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Missing required field: idea (string)' });
    }

    const messages = buildMessages(idea, requestedType);
    const text = await callOpenAI(messages, { temperature: 0.2, max_tokens: 800 });

    const parsed = tryParseJSONLoose(text);
    if (!validateAnalysisShape(parsed)) {
      return res.status(502).json({
        error: 'Failed to parse/validate model JSON. Ensure the model returns ONLY a single JSON object with required keys.',
        modelOutput: text,
        hint: 'Remove markdown/code fences; ensure keys: entities, roles, features, pages, suggested_pages, recommended_ia{type,reason}, outline',
      });
    }

    return res.json({ analysis: parsed });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, code: err.code || 'UNKNOWN' });
  }
}

module.exports = { analyze };
