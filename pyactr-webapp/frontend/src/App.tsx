import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TutorialPage from './pages/TutorialPage'
import PlaygroundPage from './pages/PlaygroundPage'
import TestEditorPage from './pages/TestEditorPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tutorial/:id" element={<TutorialPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/test-editor" element={<TestEditorPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App