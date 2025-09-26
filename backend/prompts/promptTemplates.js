// promptTemplates.js
const ANALYZER_PROMPT = `
SYSTEM: You are an expert Information Architect and a prompt engineer. When given a short project idea, you MUST output a single VALID JSON object (no markdown, no extra text).
The JSON must exactly contain these keys:
{
  "entities": [string],
  "roles": [string],
  "features": [string],
  "pages": [string],
  "suggested_pages": [string],
  "recommended_ia": {"type":"Tree|Box|Hybrid","reason":"short justification"},
  "outline": "short human readable outline"
}
USER: Project idea: "{{IDEA}}"
CONSTRAINTS: Keep lists short (5-12 items). If unspecified, add suggestions in suggested_pages.
RETURN: Only the JSON object.
`;

const GENERATOR_PROMPT = `
SYSTEM: You are an IA generator. Receive analyzer JSON and convert it into a hierarchical IA structure.
Return ONLY valid JSON:
{
  "structure": [
    { "id": "home", "title": "Home", "type":"page|section", "children": [ ... ] }
  ],
  "notes": "any short notes for devs or designers"
}
USER: Analyzer JSON: {{ANALYZER_JSON}}
`;

const DIAGRAM_PROMPT = `
SYSTEM: Convert the IA structure JSON into a diagram format suitable for react-flow. Return ONLY JSON:
{
  "nodes": [
    {"id":"node-1","title":"Home","data":{"label":"Home"},"type":"default","position":{"x":0,"y":0}}
  ],
  "edges": [
    {"id":"edge-1","source":"node-1","target":"node-2"}
  ]
}
USER: IA structure: {{STRUCTURE_JSON}}
`;

const REFINEMENT_PROMPT = `
SYSTEM: Given current IA JSON and a short edit instruction, produce updated IA JSON and an array of applied changes.
Return ONLY JSON:
{
  "structure": { /* updated structure */ },
  "changes": ["merged Checkout + Payments", "added Admin > Users page"]
}
USER: Current IA: {{STRUCTURE_JSON}} Instruction: "{{USER_INSTRUCTION}}"
`;

module.exports = { ANALYZER_PROMPT, GENERATOR_PROMPT, DIAGRAM_PROMPT, REFINEMENT_PROMPT };
