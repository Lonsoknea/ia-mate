import React from 'react'

export default function InputForm({ description, setDescription, iaType, setIaType, onAnalyze, loading, error }) {
  const canAnalyze = !!description?.trim?.()

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

      <div className="flex items-end gap-4">
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

        <button className="btn" onClick={onAnalyze} disabled={loading || !canAnalyze}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
