import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import html2canvas from 'html2canvas'
import { v4 as uuidv4 } from 'uuid'
import { saveStructure } from '../services/api'

const LS_KEY = 'ia_mate_diagram_positions'

function toNodesEdges(diagramJson) {
  try {
    if (!diagramJson) return { nodes: [], edges: [] }
    const obj = typeof diagramJson === 'string' ? JSON.parse(diagramJson) : diagramJson
    return { nodes: obj.nodes ?? [], edges: obj.edges ?? [] }
  } catch {
    return { nodes: [], edges: [] }
  }
}

function applySavedPositions(nodes) {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
    if (!saved || typeof saved !== 'object') return nodes
    return nodes.map(n => {
      const p = saved[n.id]
      return p ? { ...n, position: p } : n
    })
  } catch {
    return nodes
  }
}

export default function IADiagram({ diagramJson, setDiagramJson }) {
  const wrapperRef = useRef(null)
  const initial = useMemo(() => toNodesEdges(diagramJson), [diagramJson])

  const [nodes, setNodes, onNodesChange] = useNodesState(applySavedPositions(initial.nodes))
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Persist positions to localStorage whenever nodes change
  useEffect(() => {
    const pos = {}
    nodes.forEach(n => {
      if (n?.position) pos[n.id] = n.position
    })
    try { localStorage.setItem(LS_KEY, JSON.stringify(pos)) } catch {}
  }, [nodes])

  // Sync up to parent when diagram changes
  useEffect(() => {
    if (!setDiagramJson) return
    setDiagramJson({ nodes, edges })
  }, [nodes, edges, setDiagramJson])

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge({ ...connection, id: uuidv4() },eds))
  }, [setEdges])

  const onNodeClick = useCallback((_e, node) => {
    setSelectedNodeId(node?.id || null)
  }, [])

  const handleFieldChange = (field, value) => {
    if (!selectedNode) return
    setNodes(ns => ns.map(n => {
      if (n.id !== selectedNode.id) return n
      const data = { ...(n.data || {}), [field]: value }
      // Keep label consistent with title
      if (field === 'title') data.label = value
      return { ...n, data }
    }))
  }

  const handleAddNode = () => {
    const id = uuidv4()
    const newNode = {
      id,
      type: 'default',
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { label: 'New Node', title: 'New Node', description: '' },
    }
    setNodes(ns => [...ns, newNode])
    setSelectedNodeId(id)
  }

  const handleDeleteSelected = () => {
    if (!selectedNode) return
    const id = selectedNode.id
    setNodes(ns => ns.filter(n => n.id !== id))
    setEdges(es => es.filter(e => e.source !== id && e.target !== id))
    setSelectedNodeId(null)
  }

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
      const data = { nodes, edges }
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

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      const structure = { nodes, edges }
      await saveStructure(structure)
    } catch (e) {
      setError(e?.message || 'Failed to save structure')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">IA Diagram</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={handleExportJSON}>Export JSON</button>
          <button className="btn" onClick={handleExportPNG}>Export PNG</button>
          <button className="btn" onClick={handleAddNode}>Add Node</button>
          <button className="btn-secondary" onClick={handleDeleteSelected} disabled={!selectedNode}>Delete Selected</button>
          <button className="btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div ref={wrapperRef} className="h-[520px] w-full rounded-md border border-gray-200 bg-white">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background gap={16} size={1} />
          </ReactFlow>
        </div>

        <aside className="card h-[520px] overflow-auto">
          <h3 className="text-base font-semibold mb-2">Selected Node</h3>
          {selectedNode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={selectedNode.data?.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={selectedNode.data?.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full min-h-[100px] rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="text-xs text-gray-500">id: {selectedNode.id}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Select a node to edit its details.</p>
          )}

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Legend</h4>
            <div className="rounded-md border border-gray-200 p-3 text-xs space-y-1 bg-gray-50">
              <div><span className="inline-block h-3 w-3 bg-blue-500 mr-2 align-middle"></span> Default node</div>
              <div><span className="inline-block h-3 w-3 bg-gray-500 mr-2 align-middle"></span> Edge connection</div>
              <div>Drag nodes to reposition. Click to edit. Use toolbar to add/delete/save.</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
