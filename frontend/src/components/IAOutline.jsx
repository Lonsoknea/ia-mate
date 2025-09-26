import React from 'react'

export default function IAOutline({ analysis, onAccept }) {
  const pretty = (() => {
    try {
      if (typeof analysis === 'string') {
        // try to detect JSON-like string
        const trimmed = analysis.trim()
        if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
          return JSON.stringify(JSON.parse(trimmed), null, 2)
        }
        return analysis
      }
      return JSON.stringify(analysis, null, 2)
    } catch {
      return String(analysis)
    }
  })()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">IA Outline</h2>
        {onAccept && (
          <button className="btn" onClick={onAccept}>Accept</button>
        )}
      </div>
      <pre className="whitespace-pre-wrap break-words rounded-md bg-gray-50 p-3 text-sm border border-gray-200 overflow-auto max-h-96">
{pretty}
      </pre>
    </div>
  )
}
