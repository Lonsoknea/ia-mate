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

export async function analyzeDescription(description) {
  try {
    const resp = await api.post('/api/analyze', { description })
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
