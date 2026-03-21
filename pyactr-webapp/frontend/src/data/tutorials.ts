export interface Tutorial {
  id: number
  title: string
  subtitle: string
  description: string
  objectives: string[]
  topics: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  icon: string
}

export const tutorials: Tutorial[] = [
  {
    id: 1,
    title: 'Introduction to ACT-R and PyACT-R',
    subtitle: 'Basics',
    description: 'Learn the fundamental concepts of the ACT-R cognitive architecture and how to use PyACT-R to build your first simple model.',
    objectives: [
      'Understand the ACT-R cognitive architecture',
      'Learn the basic components (chunks, productions, buffers)',
      'Build your first simple model',
      'Explore timing and cognitive cycles'
    ],
    topics: [
      'Cognitive architecture',
      'Symbolic vs subsymbolic processing',
      'Buffers',
      'Production cycles'
    ],
    difficulty: 'beginner',
    estimatedTime: '45 minutes',
    icon: '🧠'
  },
  {
    id: 2,
    title: 'Working with Chunks and Declarative Memory',
    subtitle: 'Declarative Memory',
    description: 'Master how ACT-R stores and retrieves factual knowledge through chunks and declarative memory.',
    objectives: [
      'Master chunk creation and manipulation',
      'Understand memory activation and retrieval',
      'Model forgetting and memory errors',
      'Implement spreading activation'
    ],
    topics: [
      'Declarative memory',
      'Base-level activation',
      'Spreading activation',
      'Memory decay',
      'Fan effects'
    ],
    difficulty: 'beginner',
    estimatedTime: '60 minutes',
    icon: '💾'
  },
  {
    id: 3,
    title: 'Production Rules and Procedural Memory',
    subtitle: 'Procedural Memory',
    description: 'Learn how to create production rules that control behavior and model skill acquisition.',
    objectives: [
      'Master production rule syntax',
      'Understand conflict resolution',
      'Model skill acquisition and learning',
      'Explore utility learning'
    ],
    topics: [
      'IF-THEN rules',
      'Pattern matching',
      'Conflict resolution',
      'Utility learning',
      'Skill acquisition'
    ],
    difficulty: 'intermediate',
    estimatedTime: '75 minutes',
    icon: '⚙️'
  },
  {
    id: 4,
    title: 'Building a Simple Cognitive Model',
    subtitle: 'Complete Model',
    description: 'Put it all together to build a complete cognitive model that solves arithmetic problems.',
    objectives: [
      'Design complete cognitive models',
      'Integrate all ACT-R components',
      'Validate models against human data',
      'Tune parameters for realistic behavior'
    ],
    topics: [
      'Model architecture',
      'Strategy selection',
      'Parameter tuning',
      'Empirical validation'
    ],
    difficulty: 'intermediate',
    estimatedTime: '90 minutes',
    icon: '🏗️'
  },
  {
    id: 5,
    title: 'Advanced Modeling - Subsymbolic Processing',
    subtitle: 'Advanced Features',
    description: 'Explore advanced subsymbolic features that make models more human-like.',
    objectives: [
      'Master subsymbolic parameters',
      'Implement partial matching and blending',
      'Use production compilation',
      'Model temporal dynamics and timing'
    ],
    topics: [
      'Activation noise',
      'Spreading activation',
      'Partial matching',
      'Blending',
      'Production compilation'
    ],
    difficulty: 'advanced',
    estimatedTime: '90 minutes',
    icon: '🔬'
  },
  {
    id: 6,
    title: 'Real-World Application',
    subtitle: 'Decision Making',
    description: 'Build a complete model of human decision making and apply it to real-world problems.',
    objectives: [
      'Build complete models of real tasks',
      'Fit model parameters to human data',
      'Capture individual differences',
      'Apply models to HCI and education'
    ],
    topics: [
      'Multi-attribute decisions',
      'Strategy selection',
      'Parameter fitting',
      'Individual differences'
    ],
    difficulty: 'advanced',
    estimatedTime: '120 minutes',
    icon: '🌍'
  },
  {
    id: 7,
    title: 'Motor Control and Timing',
    subtitle: 'Motor Module',
    description: 'Learn how ACT-R models physical actions like typing and mouse movements, including realistic timing.',
    objectives: [
      'Understand ACT-R\'s motor module',
      'Model typing and key presses',
      'Implement Fitts\'s Law for movements',
      'Build dual-task models'
    ],
    topics: [
      'Motor module',
      'Key press timing',
      'Mouse movements',
      'Fitts\'s Law',
      'Parallel processing'
    ],
    difficulty: 'intermediate',
    estimatedTime: '60 minutes',
    icon: '⌨️'
  },
  {
    id: 8,
    title: 'Vision and Attention',
    subtitle: 'Visual Module',
    description: 'Model how people search for visual information, shift attention, and process visual scenes.',
    objectives: [
      'Master the vision module',
      'Model visual search strategies',
      'Implement eye movements',
      'Understand change blindness'
    ],
    topics: [
      'Visual buffers',
      'Feature vs conjunction search',
      'Eye movements',
      'Visual attention',
      'Change detection'
    ],
    difficulty: 'intermediate',
    estimatedTime: '75 minutes',
    icon: '👁️'
  },
  {
    id: 9,
    title: 'Learning and Skill Acquisition',
    subtitle: 'Learning Mechanisms',
    description: 'Explore how ACT-R models learning, from production compilation to power law of practice.',
    objectives: [
      'Implement production compilation',
      'Model power law of practice',
      'Use utility learning',
      'Capture skill transfer'
    ],
    topics: [
      'Production compilation',
      'Utility learning',
      'Power law',
      'Instance-based learning',
      'Skill transfer'
    ],
    difficulty: 'advanced',
    estimatedTime: '90 minutes',
    icon: '📈'
  },
  {
    id: 10,
    title: 'Model Fitting and Parameter Estimation',
    subtitle: 'Model Validation',
    description: 'Learn how to fit ACT-R models to human data using optimization and validation techniques.',
    objectives: [
      'Use parameter optimization',
      'Implement cross-validation',
      'Apply Bayesian estimation',
      'Compare competing models'
    ],
    topics: [
      'Grid search',
      'Optimization algorithms',
      'Cross-validation',
      'Model comparison',
      'Bayesian methods'
    ],
    difficulty: 'advanced',
    estimatedTime: '90 minutes',
    icon: '📊'
  },
  {
    id: 11,
    title: 'Complex Problem Solving',
    subtitle: 'Higher Cognition',
    description: 'Model complex problem solving including planning, analogical reasoning, and insight.',
    objectives: [
      'Build planning models',
      'Implement means-ends analysis',
      'Model insight and restructuring',
      'Use analogical reasoning'
    ],
    topics: [
      'Goal hierarchies',
      'Strategy selection',
      'Insight problems',
      'Analogical mapping',
      'Sudoku solving'
    ],
    difficulty: 'advanced',
    estimatedTime: '100 minutes',
    icon: '🧩'
  },
  {
    id: 12,
    title: 'Language Processing',
    subtitle: 'Language Module',
    description: 'Model language comprehension, production, and reading including eye movements.',
    objectives: [
      'Model word recognition',
      'Implement syntactic parsing',
      'Build dialogue models',
      'Simulate reading behavior'
    ],
    topics: [
      'Lexical access',
      'Syntactic parsing',
      'Sentence comprehension',
      'Language production',
      'Reading eye movements'
    ],
    difficulty: 'advanced',
    estimatedTime: '100 minutes',
    icon: '💬'
  }
]