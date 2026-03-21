import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Copy, Check } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import { tutorials } from '../data/tutorials'
import { tutorialContent } from '../data/tutorialContent'

export default function TutorialPage() {
  const { id } = useParams()
  const tutorialId = parseInt(id || '1')
  const tutorial = tutorials.find(t => t.id === tutorialId)
  const content = tutorialContent[tutorialId]

  const [currentSection, setCurrentSection] = useState(0)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [codeOutputs, setCodeOutputs] = useState<Record<string, string>>({})
  const [editedCode, setEditedCode] = useState<Record<string, string>>({})

  if (!tutorial || !content) {
    return <div>Tutorial not found</div>
  }

  const currentContent = content.sections[currentSection]

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const runCode = async (code: string, id: string) => {
    setCodeOutputs(prev => ({ ...prev, [id]: 'Running...' }))

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await response.json()
      setCodeOutputs(prev => ({ ...prev, [id]: data.output }))
    } catch (error) {
      setCodeOutputs(prev => ({ ...prev, [id]: 'Error running code' }))
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 mb-4">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to tutorials</span>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tutorial.title}</h1>
            <p className="text-gray-600">{tutorial.description}</p>
          </div>
          <span className="text-4xl">{tutorial.icon}</span>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{currentSection + 1} / {content.sections.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / content.sections.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">{currentContent.title}</h2>

        {currentContent.content.map((item, index) => {
          if (item.type === 'text') {
            return (
              <div key={index} className="mb-6 prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{item.content}</p>
              </div>
            )
          }

          if (item.type === 'code') {
            const codeId = `${tutorialId}-${currentSection}-${index}`
            const currentCode = editedCode[codeId] ?? (item.content || '')

            return (
              <div key={index} className="mb-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
                    <span className="text-gray-400 text-sm font-mono">Python</span>
                    <div className="flex space-x-2">
                      {editedCode[codeId] && (
                        <button
                          onClick={() => {
                            setEditedCode(prev => {
                              const newState = { ...prev }
                              delete newState[codeId]
                              return newState
                            })
                          }}
                          className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                        >
                          Reset
                        </button>
                      )}
                      <button
                        onClick={() => copyCode(currentCode, codeId)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedCode === codeId ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => runCode(currentCode, codeId)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        <span className="text-sm">Run</span>
                      </button>
                    </div>
                  </div>
                  <CodeEditor
                    value={currentCode}
                    onChange={(value) => {
                      setEditedCode(prev => ({ ...prev, [codeId]: value || '' }))
                    }}
                  />
                  {codeOutputs[codeId] && (
                    <div className="border-t border-gray-800 p-4">
                      <div className="text-sm text-gray-400 mb-2">Output:</div>
                      <pre className="text-green-400 text-sm font-mono overflow-x-auto">
                        {codeOutputs[codeId]}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          if (item.type === 'explanation') {
            return (
              <div key={index} className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-blue-800">{item.content}</p>
              </div>
            )
          }

          return null
        })}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          <button
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {content.sections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSection ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSection(prev => Math.min(content.sections.length - 1, prev + 1))}
            disabled={currentSection === content.sections.length - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentSection === content.sections.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}