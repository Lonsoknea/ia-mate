import React, { useMemo, useRef } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import html2canvas from 'html2canvas'

// diagramJson is expected to be either
// - a string containing JSON with { nodes: [], edges: [] }
// - an object { nodes: [], edges: [] }
export default function IADiagram({ diagramJson, setDiagramJson }) {
  const wrapperRef = useRef(null)

  const { nodes, edges } = useMemo(() => {
    try {
      if (!diagramJson) return { nodes: [], edges: [] }
      if (typeof diagramJson === 'string') {
        const parsed = JSON.parse(diagramJson)
        return { nodes: parsed.nodes ?? [], edges: parsed.edges ?? [] }
      }
      return { nodes: diagramJson.nodes ?? [], edges: diagramJson.edges ?? [] }
    } catch (e) {
      return { nodes: [], edges: [] }
    }
  }, [diagramJson])

  async function handleExportPNG() {
    if (!wrapperRef.current) return
    const canvas = await html2canvas(wrapperRef.current, { backgroundColor: '#ffffff', useCORS: true })
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'ia-diagram.png'
    link.click()
  }

  function handleExportJSON() {
    try {
      const data = typeof diagramJson === 'string' ? JSON.parse(diagramJson) : (diagramJson || { nodes, edges })
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'structure.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">IA Diagram</h2>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={handleExportJSON}>Export JSON</button>
          <button className="btn" onClick={handleExportPNG}>Export PNG</button>
        </div>
      </div>

      <div ref={wrapperRef} className="h-[500px] w-full rounded-md border border-gray-200 bg-white">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}
