import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, BarChart } from 'lucide-react'
import { tutorials } from '../data/tutorials'

export default function HomePage() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100'
      case 'advanced':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-12">
        <h1 className="text-4xl font-bold mb-4">
          Learn Cognitive Modeling with PyACT-R
        </h1>
        <p className="text-xl mb-8 text-primary-100">
          A comprehensive tutorial series for understanding human cognition through computational modeling
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/tutorial/1" className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Start Learning</span>
          </Link>
          <Link to="/playground" className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors">
            Try Interactive Playground
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
            <BarChart className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Progressive Learning</h3>
          <p className="text-gray-600">Start with basics and build up to advanced concepts with carefully designed tutorials.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Interactive Code</h3>
          <p className="text-gray-600">Run and modify code examples directly in your browser with instant feedback.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Learn at Your Pace</h3>
          <p className="text-gray-600">Each tutorial includes estimated times and can be completed independently.</p>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Tutorial Series</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tutorial) => (
            <Link
              key={tutorial.id}
              to={`/tutorial/${tutorial.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{tutorial.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{tutorial.title}</h3>
                    <p className="text-gray-500 text-sm">{tutorial.subtitle}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(tutorial.difficulty)}`}>
                  {tutorial.difficulty}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{tutorial.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{tutorial.estimatedTime}</span>
                </span>
                <span className="flex items-center space-x-1 text-primary-600">
                  <span>Start Tutorial</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Learning Path</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-green-600">🟢 Beginners (Tutorials 1-4)</h4>
            <p className="text-gray-600 mt-1">Start with the basics of ACT-R, declarative memory, production rules, and build your first complete model.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-600">🟡 Intermediate (Tutorials 5-8)</h4>
            <p className="text-gray-600 mt-1">Go deeper into subsymbolic processing, decision making, motor control, and visual attention.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-red-600">🔴 Advanced (Tutorials 9-12)</h4>
            <p className="text-gray-600 mt-1">Master learning mechanisms, model fitting, complex problem solving, and language processing.</p>
          </div>
        </div>
      </div>
    </div>
  )
}