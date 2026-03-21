import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language?: string
  height?: string
  readOnly?: boolean
}

export default function CodeEditor({
  value,
  onChange,
  language = 'python',
  height = '450px',
  readOnly = false
}: CodeEditorProps) {
  return (
    <div style={{
      height: height,
      maxHeight: '800px',
      overflow: 'hidden',
      position: 'relative',
      width: '100%'
    }}>
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: readOnly,
          automaticLayout: true,
          wordWrap: 'on',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          // Ensure editor is interactive
          domReadOnly: readOnly,
          cursorStyle: 'line',
          selectOnLineNumbers: true,
          renderLineHighlight: 'all',
        }}
      />
    </div>
  )
}