import { useState } from 'react'
import { Play, Download, Upload, RefreshCw } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'

const defaultCode = `import pyactr as actr

# Create your ACT-R model here
model = actr.ACTRModel()

# Define chunk types
actr.chunktype("fact", "subject relation object")

# Create a chunk
chunk = actr.makechunk(
    chunktype="fact",
    subject="cat",
    relation="isa",
    object="animal"
)

# Add to declarative memory
model.decmem.add(chunk)

print(f"Created chunk: {chunk}")
print(f"Memory contents: {list(model.decmem)}")
`

export default function PlaygroundPage() {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running...')

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await response.json()
      setOutput(data.output || data.error || 'No output')
    } catch (error) {
      setOutput(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pyactr_model.py'
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCode(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">PyACT-R Playground</h1>
        <p className="text-gray-600">Write and run PyACT-R code directly in your browser</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor Panel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
            <span className="text-white font-semibold">Code Editor</span>
            <div className="flex space-x-2">
              <label className="text-gray-300 hover:text-white cursor-pointer">
                <Upload className="h-5 w-5" />
                <input
                  type="file"
                  accept=".py"
                  onChange={loadCode}
                  className="hidden"
                />
              </label>
              <button
                onClick={downloadCode}
                className="text-gray-300 hover:text-white"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCode(defaultCode)}
                className="text-gray-300 hover:text-white"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-[600px]">
            <CodeEditor
              value={code}
              onChange={(value) => setCode(value || '')}
              height="100%"
            />
          </div>
          <div className="bg-gray-800 px-4 py-3">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                isRunning
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <Play className="h-5 w-5" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 px-4 py-3">
            <span className="text-white font-semibold">Output</span>
          </div>
          <div className="h-[600px] bg-gray-900 p-4 overflow-auto">
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
              {output || 'Output will appear here...'}
            </pre>
          </div>
          <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
            <span className="text-gray-400 text-sm">Console Output</span>
            <button
              onClick={() => setOutput('')}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Example Models</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setCode(memoryExample)}
            className="text-left p-4 border rounded-lg hover:bg-gray-50"
          >
            <h3 className="font-semibold mb-1">Memory Retrieval</h3>
            <p className="text-sm text-gray-600">Demonstrate memory activation and retrieval</p>
          </button>
          <button
            onClick={() => setCode(productionExample)}
            className="text-left p-4 border rounded-lg hover:bg-gray-50"
          >
            <h3 className="font-semibold mb-1">Production Rules</h3>
            <p className="text-sm text-gray-600">Show how productions control behavior</p>
          </button>
          <button
            onClick={() => setCode(countingExample)}
            className="text-left p-4 border rounded-lg hover:bg-gray-50"
          >
            <h3 className="font-semibold mb-1">Counting Model</h3>
            <p className="text-sm text-gray-600">A complete model that counts</p>
          </button>
        </div>
      </div>
    </div>
  )
}

// Example code templates
const memoryExample = `import pyactr as actr
import numpy as np

# Memory model with activation
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True

# Define chunk type
actr.chunktype("fact", "category item")

# Add facts with different frequencies
facts = [
    ("animal", "dog", 10),
    ("animal", "cat", 8),
    ("animal", "bird", 3),
]

dm = model.decmem
for category, item, frequency in facts:
    chunk = actr.makechunk(
        chunktype="fact",
        category=category,
        item=item
    )
    # Add multiple times for frequency
    for _ in range(frequency):
        dm.add(chunk)

print("Memory contents:")
for chunk in dm:
    print(f"  {chunk}")
`

const productionExample = `import pyactr as actr

# Create model
model = actr.ACTRModel()

# Define chunk types
actr.chunktype("goal_chunk", "state")

# Add initial goal
model.goal.add(actr.makechunk(chunktype="goal_chunk", state="start"))

# Create production rule
model.productionstring(
    name="start_to_process",
    string='''
    =g>
        isa goal_chunk
        state start
    ==>
    =g>
        state processing
    '''
)

model.productionstring(
    name="process_to_done",
    string='''
    =g>
        isa goal_chunk
        state processing
    ==>
    =g>
        state done
    '''
)

# Run simulation
sim = model.simulation()
sim.run(1.0)
`

const countingExample = `import pyactr as actr

# Counting model
model = actr.ACTRModel()

# Define chunk types
actr.chunktype("countOrder", "first second")
actr.chunktype("counting", "state current target")

# Add counting facts
dm = model.decmem
dm.add(actr.makechunk(chunktype="countOrder", first="1", second="2"))
dm.add(actr.makechunk(chunktype="countOrder", first="2", second="3"))
dm.add(actr.makechunk(chunktype="countOrder", first="3", second="4"))

# Set goal
model.goal.add(actr.makechunk(
    chunktype="counting",
    state="start",
    current="1",
    target="4"
))

print("Initial goal:", list(model.goal)[0])

# Production to count
model.productionstring(
    name="count_up",
    string='''
    =g>
        isa counting
        state start
        current =num
        target ~=num
    ?retrieval>
        state free
    ==>
    =g>
        state counting
    +retrieval>
        isa countOrder
        first =num
    '''
)

print("Model ready to count!")
`