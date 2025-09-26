import React, { useState } from 'react'
import InputForm from './components/InputForm.jsx'
import IAOutline from './components/IAOutline.jsx'
import IADiagram from './components/IADiagram.jsx'
import { analyzeIdea, generateStructure, getDiagram } from './services/api'

export default function App() {
  const [idea, setIdea] = useState('')
  const [iaType, setIaType] = useState('Tree')
  const [analysis, setAnalysis] = useState(null)
  const [structure, setStructure] = useState(null)
  const [diagramJson, setDiagramJson] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onAnalyze() {
    setError('')
    setLoading(true)
    setStructure(null)
    setDiagramJson(null)
    try {
      const res = await analyzeIdea(idea, iaType)
      // Expect { analysis: {...} }
      setAnalysis(res.analysis || res.result || res)
    } catch (e) {
      setError(e?.message || 'Failed to analyze idea')
    } finally {
      setLoading(false)
    }
  }

  async function onGenerateStructure() {
    setError('')
    setLoading(true)
    try {
      const res = await generateStructure(analysis)
      // Expect { structure: {...} } or { structure: [...] }
      const s = res.structure || res.result || res
      setStructure(s)

      // Immediately get diagram
      const dia = await getDiagram(s, undefined, iaType)
      setDiagramJson(dia.nodes ? dia : dia.result || dia)
    } catch (e) {
      setError(e?.message || 'Failed to generate structure/diagram')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">IA MATE</h1>
      </header>

      <section className="card">
        <InputForm
          description={idea}
          setDescription={setIdea}
          iaType={iaType}
          setIaType={setIaType}
          onAnalyze={onAnalyze}
          loading={loading}
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      {analysis && (
        <section className="card">
          <IAOutline
            analysis={analysis}
            onGenerate={onGenerateStructure}
            loading={loading}
          />
        </section>
      )}

      <section className="card">
        <IADiagram diagramJson={diagramJson} setDiagramJson={setDiagramJson} />
      </section>
    </div>
  )
}
