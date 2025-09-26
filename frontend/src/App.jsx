import React, { useState } from 'react'
import InputForm from './components/InputForm.jsx'
import IAOutline from './components/IAOutline.jsx'
import IADiagram from './components/IADiagram.jsx'

export default function App() {
  const [description, setDescription] = useState('')
  const [iaType, setIaType] = useState('Tree')
  const [analysis, setAnalysis] = useState(null) // string or JSON
  const [diagramJson, setDiagramJson] = useState(null) // { nodes, edges } or string

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">IA MATE</h1>
      </header>

      <section className="card">
        <InputForm
          description={description}
          setDescription={setDescription}
          iaType={iaType}
          setIaType={setIaType}
          setAnalysis={setAnalysis}
          setDiagramJson={setDiagramJson}
        />
      </section>

      {analysis && (
        <section className="card">
          <IAOutline
            analysis={analysis}
            onAccept={() => {
              // When accepted, keep analysis visible and allow diagram panel below
              // Actual diagram fetching is triggered in InputForm via dedicated button as well
            }}
          />
        </section>
      )}

      <section className="card">
        <IADiagram diagramJson={diagramJson} setDiagramJson={setDiagramJson} />
      </section>
    </div>
  )
}
