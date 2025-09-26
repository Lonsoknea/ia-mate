import React, { useState } from 'react'
import { analyzeDescription, generateIA, generateDiagram } from '../services/api'

export default function InputForm({ description, setDescription, iaType, setIaType, setAnalysis, setDiagramJson }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAnalyze() {
    setError('')
    setLoading(true)
    try {
      const res = await analyzeDescription(description)
      setAnalysis(res.result || res)
    } catch (e) {
      setError(e?.message || 'Failed to analyze description')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateIA() {
    setError('')
    setLoading(true)
    try {
      const res = await generateIA(description)
      setAnalysis(res.result || res)
    } catch (e) {
      setError(e?.message || 'Failed to generate IA')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateDiagram() {
    setError('')
    setLoading(true)
    try {
      // if analysis is available, send that; otherwise send description
      const outline = typeof setAnalysis === 'function' ? undefined : undefined
      const source = typeof outline === 'string' ? outline : (typeof description === 'string' ? description : '')
      const res = await generateDiagram(analysis || source, iaType)
      setDiagramJson(res.result || res)
    } catch (e) {
      setError(e?.message || 'Failed to generate diagram')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Project idea / description</label>
        <textarea
          className="w-full min-h-[120px] rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your project or website..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">IA Type</label>
          <select
            className="rounded-md border border-gray-300 p-2"
            value={iaType}
            onChange={(e) => setIaType(e.target.value)}
          >
            <option>Tree</option>
            <option>Box</option>
            <option>Hybrid</option>
          </select>
        </div>

        <div className="flex gap-2 mt-6">
          <button className="btn" onClick={handleAnalyze} disabled={loading || !description.trim()}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
          <button className="btn" onClick={handleGenerateIA} disabled={loading || !description.trim()}>
            {loading ? 'Generating...' : 'Generate IA'}
          </button>
          <button className="btn-secondary" onClick={handleGenerateDiagram} disabled={loading || !(analysis || description).trim}>
            Diagram
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
