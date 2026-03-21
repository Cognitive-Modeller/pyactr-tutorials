import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Book, Code, Home } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary-600" />
                <span className="font-bold text-xl text-gray-900">PyACT-R Tutorials</span>
              </Link>

              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link to="/tutorial/1" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Book className="h-4 w-4" />
                  <span>Tutorials</span>
                </Link>
                <Link to="/playground" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Code className="h-4 w-4" />
                  <span>Playground</span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/jakdot/pyactr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>PyACT-R Tutorial Series - Learn cognitive modeling with Python ACT-R</p>
            <p className="mt-2">Built with React, TypeScript, and FastAPI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}