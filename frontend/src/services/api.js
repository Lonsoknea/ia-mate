import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

function unwrap(resp) {
  return resp?.data ?? resp
}

function normalizeError(error) {
  const message = error?.response?.data?.error || error?.message || 'Request failed'
  return new Error(message)
}

// New helpers per spec
export async function analyzeIdea(idea, requestedType) {
  try {
    const resp = await api.post('/api/analyze', { idea, requestedType })
    return unwrap(resp)
  } catch (e) {
    throw normalizeError(e)
  }
}

export async function generateStructure(analysis) {
  try {
    // Forward the analyzer JSON to generator
    const resp = await api.post('/api/generate', { analysis })
    return unwrap(resp)
  } catch (e) {
    throw normalizeError(e)
  }
}

export async function getDiagram(structure, layout, type) {
  try {
    const resp = await api.post('/api/diagram', { structure, layout, iaType: type })
    return unwrap(resp)
  } catch (e) {
    throw normalizeError(e)
  }
}

// Legacy helpers kept for compatibility with earlier components (if any)
export async function analyzeDescription(description) {
  try {
    const resp = await api.post('/api/analyze', { idea: description })
    return unwrap(resp)
  } catch (e) {
    throw normalizeError(e)
  }
}

export async function generateIA(description, constraints) {
  try {
    const resp = await api.post('/api/generate', { description, constraints })
    return unwrap(resp)
  } catch (e) {
    throw normalizeError(e)
  }
}

export async function generateDiagram(outline, iaType) {
  try {
    const resp = await api.post('/api/diagram', { outline, iaType })
    return unwrap(resp)
  } catch (e) {
    throw normalizeError(e)
  }
}

export async function refineIA(outline, feedback) {
  try {
    const resp = await api.post('/api/refine', { outline, feedback })
    return unwrap(resp)
  } catch (e) {
    throw normalizeError(e)
  }
}
