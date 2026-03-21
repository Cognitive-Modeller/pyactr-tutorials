import { useState, useEffect } from 'react'
import CodeEditor from '../components/CodeEditor'

export default function TestEditorPage() {
  const [code, setCode] = useState('# Type here to test if editor works\nprint("Hello!")')
  const [status, setStatus] = useState('Loading...')
  const [editorMounted, setEditorMounted] = useState(false)

  useEffect(() => {
    // Check if Monaco is loaded
    let checkInterval: any = null
    let mounted = false

    checkInterval = setInterval(() => {
      if ((window as any).monaco) {
        setStatus('Monaco Editor loaded ✅')
        setEditorMounted(true)
        mounted = true
        if (checkInterval) clearInterval(checkInterval)
      }
    }, 100)

    // Timeout after 5 seconds
    setTimeout(() => {
      if (checkInterval) clearInterval(checkInterval)
      if (!mounted && !(window as any).monaco) {
        setStatus('Monaco Editor failed to load ❌')
      }
    }, 5000)

    return () => {
      if (checkInterval) clearInterval(checkInterval)
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Editor Test Page</h1>
      <p className="mb-4">Status: <span className="font-mono">{status}</span></p>

      <div className="mb-4">
        <p>Current code length: {code.length} characters</p>
        <button
          onClick={() => setCode('# Reset\nprint("Reset!")')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reset Code
        </button>
      </div>

      <div className="border-2 border-blue-500 p-2 bg-yellow-100">
        <p className="text-sm mb-2">↓ Code editor should appear below (blue border) ↓</p>
        <div className="bg-white">
          <CodeEditor
            value={code}
            onChange={(value) => {
              setCode(value || '')
              setStatus(`Editor is working! Last change at ${new Date().toLocaleTimeString()}`)
            }}
            height="400px"
          />
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Debugging Info:</h2>
        <ul className="list-disc list-inside text-sm">
          <li>Editor mounted: {editorMounted ? 'Yes' : 'No'}</li>
          <li>Code changes detected: {code !== '# Type here to test if editor works\nprint("Hello!")' ? 'Yes' : 'No'}</li>
          <li>Window.monaco available: {(window as any).monaco ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    </div>
  )
}