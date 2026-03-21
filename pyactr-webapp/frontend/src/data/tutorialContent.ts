export interface ContentItem {
  type: 'text' | 'code' | 'explanation'
  content: string
}

export interface TutorialSection {
  title: string
  content: ContentItem[]
}

export interface TutorialContent {
  sections: TutorialSection[]
}

export const tutorialContent: Record<number, TutorialContent> = {
  1: {
    sections: [
      {
        title: 'Welcome to ACT-R',
        content: [
          {
            type: 'text',
            content: 'ACT-R (Adaptive Control of Thought-Rational) is a cognitive architecture that models how human cognition works. It\'s used by researchers to understand human memory, learning, and problem-solving.'
          },
          {
            type: 'text',
            content: 'In this tutorial, we\'ll start with the basics of ACT-R and build our first simple model using PyACT-R, the Python implementation.'
          },
          {
            type: 'explanation',
            content: 'Why ACT-R? Unlike traditional programming, ACT-R models simulate the actual cognitive processes humans use, including timing, errors, and learning!'
          }
        ]
      },
      {
        title: 'Setting Up PyACT-R',
        content: [
          {
            type: 'text',
            content: 'First, let\'s import PyACT-R and set up our environment:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Create a new ACT-R model
model = actr.ACTRModel()

print("Model created successfully!")
print(f"Model type: {type(model)}")`
          },
          {
            type: 'explanation',
            content: 'The ACTRModel() is the foundation of everything. It contains memories, rules, and all the cognitive mechanisms we\'ll use.'
          }
        ]
      },
      {
        title: 'Understanding Chunks',
        content: [
          {
            type: 'text',
            content: 'Chunks are the basic units of knowledge in ACT-R. Think of them as facts or pieces of information in memory.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Define a chunk type (like a template)
actr.chunktype("fact", "subject relation object")

# Create a specific chunk
chunk = actr.makechunk(
    chunktype="fact",
    subject="dog",
    relation="isa",
    object="animal"
)

print(f"Created chunk: {chunk}")
print(f"Subject: {chunk.subject}")
print(f"Relation: {chunk.relation}")
print(f"Object: {chunk.object}")`
          },
          {
            type: 'explanation',
            content: 'What happens if you change the chunk type? Each chunk type defines what slots (attributes) a chunk can have. It\'s like defining a class in regular programming!'
          }
        ]
      },
      {
        title: 'Building a Counting Model',
        content: [
          {
            type: 'text',
            content: 'Let\'s build a simple model that counts from 1 to 3. This will demonstrate productions (rules) and goal-directed behavior.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Define chunk types we'll need
actr.chunktype("countOrder", "first second")
actr.chunktype("countFrom", "start count end")

# Create counting model
counting_model = actr.ACTRModel()

# Add counting facts to memory
dm = counting_model.decmem
dm.add(actr.makechunk(chunktype="countOrder", first="1", second="2"))
dm.add(actr.makechunk(chunktype="countOrder", first="2", second="3"))

# Define the goal
goal = actr.makechunk(chunktype="countFrom", start="1", end="3")
counting_model.goal.add(goal)

print("Model setup complete!")
print(f"Goal: Count from {goal.start} to {goal.end}")`
          },
          {
            type: 'text',
            content: 'Now let\'s add production rules that actually do the counting:'
          },
          {
            type: 'code',
            content: `# Note: This assumes you've run the previous code block
# If running standalone, you'll need to setup the model first

# Here's a complete example with all parts together:
import pyactr as actr

# Setup the model (repeat from previous)
actr.chunktype("countOrder", "first second")
actr.chunktype("countFrom", "start count end")
counting_model = actr.ACTRModel()

# Production rule for counting
counting_model.productionstring(
    name="start_counting",
    string='''
    =g>
        isa countFrom
        start =num
        count None
    ==>
    =g>
        count =num
    +retrieval>
        isa countOrder
        first =num
'''
)

# Production to continue counting
counting_model.productionstring(
    name="increment_count",
    string='''
    =g>
        isa countFrom
        count =num
        end ~=num
    =retrieval>
        isa countOrder
        first =num
        second =next
    ==>
    =g>
        count =next
    +retrieval>
        isa countOrder
        first =next
'''
)

print("Productions added successfully!")
print(f"Total productions: {len(counting_model.productions)}")`
          },
          {
            type: 'explanation',
            content: 'What\'s happening? The =g> means "IF the goal buffer contains...", ==> means "THEN do...", and +retrieval> means "request from memory". The model counts by retrieving the next number from memory!'
          }
        ]
      },
      {
        title: 'Exercises and Practice',
        content: [
          {
            type: 'text',
            content: 'Exercise 1: Create chunk types and chunks for a family tree with relationships like "parent-of" and "sibling-of"'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Solution: Family tree chunks
actr.chunktype("family", "person1 relation person2")

# Create family relationships
john_parent_mary = actr.makechunk(
    chunktype="family",
    person1="John",
    relation="parent-of",
    person2="Mary"
)

mary_sibling_tom = actr.makechunk(
    chunktype="family",
    person1="Mary",
    relation="sibling-of",
    person2="Tom"
)

print("Family relationships created!")`
          }
        ]
      },
      {
        title: 'Parameter Exploration',
        content: [
          {
            type: 'text',
            content: 'Let\'s explore how timing parameters affect model behavior:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Model with different timing parameters
timing_model = actr.ACTRModel()

# Default timing
timing_model.model_parameters["latency_factor"] = 0.1
timing_model.model_parameters["latency_exponent"] = 1.0

print("Default: 50ms + 0.1 * exp(1.0)")

# Faster model (expert)
timing_model.model_parameters["latency_factor"] = 0.05
print("Expert: Faster retrieval (half latency)")

# Slower model (novice)
timing_model.model_parameters["latency_factor"] = 0.2
print("Novice: Slower retrieval (double latency)")`
          }
        ]
      },
      {
        title: 'Common Pitfalls',
        content: [
          {
            type: 'text',
            content: 'Common mistakes when starting with PyACT-R:'
          },
          {
            type: 'explanation',
            content: '1. Forgetting to define chunk types before creating chunks\n2. Not adding chunks to declarative memory\n3. Misunderstanding buffer notation (=, +, ?, ~)\n4. Creating circular retrieval loops'
          }
        ]
      },
      {
        title: 'Real-World Application',
        content: [
          {
            type: 'text',
            content: 'ACT-R has been used to model many real tasks:'
          },
          {
            type: 'explanation',
            content: '• Air traffic control: Managing multiple aircraft\n• Driving: Lane keeping and hazard detection\n• Learning algebra: Equation solving strategies\n• Game playing: Chess and card games\n• Language learning: Vocabulary acquisition'
          }
        ]
      },
    ]
  },
  2: {
    sections: [
      {
        title: 'Introduction to Declarative Memory',
        content: [
          {
            type: 'text',
            content: 'Declarative memory in ACT-R stores factual knowledge - things you know. It models human long-term memory with realistic properties like forgetting and activation.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Create model with subsymbolic processing
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True

# Enable memory parameters
model.model_parameters["decay"] = 0.5  # Forgetting rate

print("Declarative memory model created!")
print(f"Decay parameter: {model.model_parameters['decay']}")`
          },
          {
            type: 'explanation',
            content: 'What if you set decay to 0? No forgetting! Set it to 1? Rapid forgetting! The default 0.5 models typical human memory decay.'
          }
        ]
      },
      {
        title: 'Activation and Retrieval',
        content: [
          {
            type: 'text',
            content: 'Each chunk has an activation level that determines how likely it is to be retrieved. Let\'s explore how activation works:'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Create a model with subsymbolic processing
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True
model.model_parameters["instantaneous_noise"] = 0.3

# Add some facts with different frequencies
facts = [
    ("dog", "isa", "animal", 10),  # Seen 10 times
    ("cat", "isa", "animal", 5),   # Seen 5 times
    ("rose", "isa", "plant", 1),   # Seen 1 time
]

actr.chunktype("fact", "subject relation object")

for subject, relation, obj, frequency in facts:
    chunk = actr.makechunk(
        chunktype="fact",
        subject=subject,
        relation=relation,
        object=obj
    )
    for _ in range(frequency):
        model.decmem.add(chunk)

# Now let's test retrieval
model.goal.add(actr.makechunk(subject="?", relation="isa", object="animal"))

# Which fact will be retrieved?
print("Testing retrieval with activation noise...")`
          },
          {
            type: 'explanation',
            content: 'More frequent chunks have higher activation! The noise parameter (0.3) adds randomness, making retrieval probabilistic like human memory. Try changing the frequencies!'
          }
        ]
      },
      {
        title: 'Exercises and Practice',
        content: [
          {
            type: 'text',
            content: 'Exercise: Model the fan effect - how more facts about a concept slow retrieval'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Fan effect demonstration
fan_model = actr.ACTRModel()
fan_model.model_parameters["subsymbolic"] = True

actr.chunktype("fact", "subject relation object")

# Low fan: hippie has few facts
fan_model.decmem.add(actr.makechunk(
    chunktype="fact",
    subject="hippie",
    relation="is-in",
    object="park"
))

# High fan: lawyer has many facts
locations = ["park", "bank", "store", "church", "beach"]
for loc in locations:
    fan_model.decmem.add(actr.makechunk(
        chunktype="fact",
        subject="lawyer",
        relation="is-in",
        object=loc
    ))

print("Hippie (low fan): Fast retrieval")
print("Lawyer (high fan): Slower retrieval due to competition")`
          }
        ]
      },
      {
        title: 'Parameter Exploration',
        content: [
          {
            type: 'text',
            content: 'Exploring memory parameters and their effects:'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Test different decay rates
for decay in [0.1, 0.5, 1.0]:
    model = actr.ACTRModel()
    model.model_parameters["subsymbolic"] = True
    model.model_parameters["decay"] = decay

    # Calculate activation after delays
    delays = [1, 10, 100, 1000]  # seconds
    for delay in delays:
        # Activation = ln(t^-decay)
        activation = np.log(delay**-decay)
        print(f"Decay={decay}, Delay={delay}s: {activation:.2f}")`
          }
        ]
      },
      {
        title: 'Common Pitfalls',
        content: [
          {
            type: 'text',
            content: 'Memory-related mistakes to avoid:'
          },
          {
            type: 'explanation',
            content: '1. Not enabling subsymbolic for activation effects\n2. Forgetting that noise makes retrieval stochastic\n3. Setting retrieval threshold too high (nothing retrieved)\n4. Misunderstanding spreading activation sources'
          }
        ]
      },
      {
        title: 'Real-World Application',
        content: [
          {
            type: 'text',
            content: 'Declarative memory models explain many phenomena:'
          },
          {
            type: 'explanation',
            content: '• Tip-of-the-tongue states: Partial activation\n• False memories: Blending of similar chunks\n• Priming effects: Spreading activation\n• Expertise differences: Stronger memory traces\n• Aging effects: Increased noise parameters'
          }
        ]
      },
    ]
  },
  3: {
    sections: [
      {
        title: 'Understanding Production Rules',
        content: [
          {
            type: 'text',
            content: 'Production rules are the "thinking" part of ACT-R. They match patterns in buffers and execute actions. Think of them as IF-THEN rules that fire when conditions are met.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Create a model that can do simple arithmetic
model = actr.ACTRModel()

# Define chunk types for arithmetic
actr.chunktype("arithmetic", "operation arg1 arg2 result")
actr.chunktype("goal_chunk", "state num1 num2 result")

# Add some arithmetic facts
model.decmem.add(actr.makechunk(
    chunktype="arithmetic",
    operation="add",
    arg1="2",
    arg2="3",
    result="5"
))
model.decmem.add(actr.makechunk(
    chunktype="arithmetic",
    operation="add",
    arg1="4",
    arg2="5",
    result="9"
))

print("Arithmetic model created with facts in memory")`
          },
          {
            type: 'explanation',
            content: 'We\'ve created arithmetic facts. Now we need production rules to USE these facts to solve problems.'
          }
        ]
      },
      {
        title: 'Writing Production Rules',
        content: [
          {
            type: 'text',
            content: 'Let\'s write production rules that can perform addition by retrieving facts from memory:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Complete arithmetic model
actr.chunktype("arithmetic", "operation arg1 arg2 result")
actr.chunktype("goal_chunk", "state num1 num2 result")

model = actr.ACTRModel()

# Add arithmetic facts
facts = [("2", "3", "5"), ("4", "5", "9"), ("1", "1", "2")]
for a, b, r in facts:
    model.decmem.add(actr.makechunk(
        chunktype="arithmetic",
        operation="add",
        arg1=a,
        arg2=b,
        result=r
    ))

# Production rule to start addition
model.productionstring(
    name="start_addition",
    string='''
    =g>
        isa goal_chunk
        state start
        num1 =x
        num2 =y
        result None
    ==>
    =g>
        state retrieving
    +retrieval>
        isa arithmetic
        operation add
        arg1 =x
        arg2 =y
'''
)

# Production rule to get result
model.productionstring(
    name="retrieve_sum",
    string='''
    =g>
        isa goal_chunk
        state retrieving
    =retrieval>
        isa arithmetic
        operation add
        result =sum
    ==>
    =g>
        state done
        result =sum
    ~retrieval>
'''
)

# Test the model
goal = actr.makechunk(
    chunktype="goal_chunk",
    state="start",
    num1="2",
    num2="3",
    result=None
)
model.goal.add(goal)

print("Model ready to add 2 + 3")
print("Run simulation to see the result!")`
          },
          {
            type: 'explanation',
            content: 'The ~retrieval> clears the retrieval buffer. Productions fire in order based on their utility. What happens if you ask for 3+3 (not in memory)?'
          }
        ]
      },
      {
        title: 'Conflict Resolution',
        content: [
          {
            type: 'text',
            content: 'When multiple productions can fire, ACT-R uses conflict resolution to pick one. Let\'s see how utility affects this choice:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Model with competing productions
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True

actr.chunktype("decision", "state choice")

# Two productions that compete
model.productionstring(
    name="choose_A",
    string='''
    =g>
        isa decision
        state choosing
        choice None
    ==>
    =g>
        choice A
'''
)

model.productionstring(
    name="choose_B",
    string='''
    =g>
        isa decision
        state choosing
        choice None
    ==>
    =g>
        choice B
'''
)

# Set different utilities (preference)
model.productions["choose_A"]["utility"] = 5
model.productions["choose_B"]["utility"] = 3

# Add utility noise for variability
model.model_parameters["utility_noise"] = 0.5

goal = actr.makechunk(chunktype="decision", state="choosing", choice=None)
model.goal.add(goal)

print("Model has two choices: A (utility=5) or B (utility=3)")
print("With noise=0.5, choice A is more likely but not certain!")
print("Run multiple times to see the stochastic behavior")`
          },
          {
            type: 'explanation',
            content: 'Higher utility means higher chance of firing, but noise makes it probabilistic. This models how humans don\'t always make the "best" choice!'
          }
        ]
      },
      {
        title: 'Exercises and Practice',
        content: [
          {
            type: 'text',
            content: 'Exercise: Create a model that learns new productions through compilation'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Model that learns shortcuts
learning_model = actr.ACTRModel()
learning_model.model_parameters["production_compilation"] = True

actr.chunktype("math_goal", "state problem answer step")

# Initial productions (two steps)
learning_model.productionstring(
    name="double_step1",
    string='''
    =g>
        isa math_goal
        state start
        problem double_=x
    ==>
    =g>
        state add
        step =x
    +retrieval>
        isa addition
        arg1 =x
        arg2 =x
'''
)

# After practice, compilation creates:
# double_3 -> 6 (direct production)
print("Initial: Retrieve that 3+3=6")
print("After compilation: Directly know double_3=6")`
          }
        ]
      },
      {
        title: 'Parameter Exploration',
        content: [
          {
            type: 'text',
            content: 'Utility learning parameters:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

model = actr.ACTRModel()
model.model_parameters["utility_learning"] = True

# Learning rate (alpha)
model.model_parameters["alpha"] = 0.2  # Default

# Utility noise (exploration vs exploitation)
model.model_parameters["egs"] = 0.1  # Low noise
# Higher noise -> more exploration
# Lower noise -> more exploitation

# Create a production first
model.productionstring(
    name="my_production",
    string='''
    =g>
        isa goal
        state start
    ==>
    =g>
        state done
    '''
)

# Now set utility and reward
model.productions["my_production"]["utility"] = 5
model.productions["my_production"]["reward"] = 1`
          }
        ]
      },
      {
        title: 'Common Pitfalls',
        content: [
          {
            type: 'text',
            content: 'Production-related mistakes:'
          },
          {
            type: 'explanation',
            content: '1. Circular production loops without state changes\n2. Overly specific patterns that never match\n3. Forgetting to clear buffers (memory leaks)\n4. Not handling retrieval failures\n5. Utility values that prevent firing'
          }
        ]
      },
      {
        title: 'Real-World Application',
        content: [
          {
            type: 'text',
            content: 'Production systems model many skills:'
          },
          {
            type: 'explanation',
            content: '• Driving: IF see red light THEN brake\n• Chess: IF king in check THEN must move king\n• Diagnosis: IF symptoms match THEN consider disease\n• Programming: IF syntax error THEN check brackets\n• Teaching: IF student confused THEN provide example'
          }
        ]
      },
    ]
  },
  4: {
    sections: [
      {
        title: 'Building a Complete Model',
        content: [
          {
            type: 'text',
            content: 'Let\'s build a complete model that solves a real task: categorizing animals by their features. This combines everything we\'ve learned.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Animal categorization model
model = actr.ACTRModel()

# Define chunk types
actr.chunktype("animal", "name has_fur has_wings flies size")
actr.chunktype("category", "name members")
actr.chunktype("categorize_goal", "state animal category")

# Add animal knowledge to memory
animals = [
    ("dog", "yes", "no", "no", "medium"),
    ("cat", "yes", "no", "no", "small"),
    ("eagle", "no", "yes", "yes", "medium"),
    ("penguin", "no", "yes", "no", "medium"),
    ("mouse", "yes", "no", "no", "tiny"),
]

for name, fur, wings, flies, size in animals:
    model.decmem.add(actr.makechunk(
        chunktype="animal",
        name=name,
        has_fur=fur,
        has_wings=wings,
        flies=flies,
        size=size
    ))

# Add category knowledge
model.decmem.add(actr.makechunk(
    chunktype="category",
    name="mammal",
    members="has_fur"
))
model.decmem.add(actr.makechunk(
    chunktype="category",
    name="bird",
    members="has_wings"
))

print("Animal categorization model created")
print(f"Animals in memory: {len(animals)}")
print("Categories: mammal (has fur), bird (has wings)")`
          },
          {
            type: 'explanation',
            content: 'We\'ve stored facts about animals and categories. Now we need productions to actually categorize!'
          }
        ]
      },
      {
        title: 'Productions for Categorization',
        content: [
          {
            type: 'text',
            content: 'Now let\'s add productions that retrieve animal features and match them to categories:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Complete categorization model
actr.chunktype("animal", "name has_fur has_wings flies size")
actr.chunktype("category", "name rule")
actr.chunktype("categorize_goal", "state target feature category")

model = actr.ACTRModel()

# Retrieve animal features
model.productionstring(
    name="retrieve_animal",
    string='''
    =g>
        isa categorize_goal
        state start
        target =animal
        feature None
    ==>
    =g>
        state retrieving_features
    +retrieval>
        isa animal
        name =animal
'''
)

# Check if mammal (has fur)
model.productionstring(
    name="check_mammal",
    string='''
    =g>
        isa categorize_goal
        state retrieving_features
    =retrieval>
        isa animal
        name =animal
        has_fur yes
    ==>
    =g>
        state done
        feature fur
        category mammal
    ~retrieval>
'''
)

# Check if bird (has wings)
model.productionstring(
    name="check_bird",
    string='''
    =g>
        isa categorize_goal
        state retrieving_features
    =retrieval>
        isa animal
        name =animal
        has_fur no
        has_wings yes
    ==>
    =g>
        state done
        feature wings
        category bird
    ~retrieval>
'''
)

# Add some animals to memory
animals = [
    ("dog", "yes", "no", "no", "medium"),
    ("eagle", "no", "yes", "yes", "medium"),
]

for name, fur, wings, flies, size in animals:
    model.decmem.add(actr.makechunk(
        chunktype="animal",
        name=name,
        has_fur=fur,
        has_wings=wings,
        flies=flies,
        size=size
    ))

print("Categorization model complete!")
print("Try categorizing 'dog' or 'eagle'")`
          },
          {
            type: 'explanation',
            content: 'The model retrieves features then applies rules. Real categorization is more complex - try adding more features or fuzzy categories!'
          }
        ]
      },
      {
        title: 'Running the Complete Model',
        content: [
          {
            type: 'text',
            content: 'Let\'s run our categorization model and observe how it processes information step by step:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Setup the complete model (abbreviated for space)
actr.chunktype("animal", "name has_fur has_wings")
actr.chunktype("categorize_goal", "state target category")

model = actr.ACTRModel()

# Add one simple production for demo
model.productionstring(
    name="categorize_mammal",
    string='''
    =g>
        isa categorize_goal
        state start
        target =animal
    ==>
    =g>
        state done
        category mammal
'''
)

# Set goal and run
goal = actr.makechunk(
    chunktype="categorize_goal",
    state="start",
    target="dog",
    category=None
)
model.goal.add(goal)

# Create simulation
sim = model.simulation()

# Run for 1 second
sim.run(1.0)

print(f"Simulation time: {sim.now}")
print("Check goal buffer for category result!")

# You can also trace execution
model.model_parameters["trace"] = True`
          },
          {
            type: 'explanation',
            content: 'The trace parameter shows each cognitive step! In real models, categorization takes ~500ms, matching human reaction times.'
          }
        ]
      },
      {
        title: 'Exercises and Practice',
        content: [
          {
            type: 'text',
            content: 'Exercise: Build a model that plays tic-tac-toe with different strategies'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Tic-tac-toe model
ttt_model = actr.ACTRModel()

actr.chunktype("board_state", "position mark")
actr.chunktype("strategy", "name priority condition")
actr.chunktype("game_goal", "state strategy")

# Add strategies
strategies = [
    ("win", 10, "two_in_row_self"),
    ("block", 8, "two_in_row_opponent"),
    ("center", 5, "center_empty"),
    ("corner", 3, "corner_empty")
]

for name, priority, condition in strategies:
    ttt_model.decmem.add(actr.makechunk(
        chunktype="strategy",
        name=name,
        priority=str(priority),
        condition=condition
    ))

print("Tic-tac-toe AI strategies loaded")
print("Will try: win > block > center > corner")`
          }
        ]
      },
      {
        title: 'Model Variations',
        content: [
          {
            type: 'text',
            content: 'Different versions of the same model:'
          },
          {
            type: 'code',
            content: `# Novice vs Expert animal categorizer
def create_categorizer(expertise_level):
    model = actr.ACTRModel()
    model.model_parameters["subsymbolic"] = True

    if expertise_level == "novice":
        # Slower, more errors
        model.model_parameters["latency_factor"] = 0.3
        model.model_parameters["instantaneous_noise"] = 0.5
    else:  # expert
        # Faster, fewer errors
        model.model_parameters["latency_factor"] = 0.1
        model.model_parameters["instantaneous_noise"] = 0.2
        # Experts have compiled productions
        model.model_parameters["production_compilation"] = True

    return model`
          }
        ]
      },
      {
        title: 'Debugging Tips',
        content: [
          {
            type: 'text',
            content: 'How to debug ACT-R models:'
          },
          {
            type: 'explanation',
            content: '1. Enable trace: model.model_parameters["trace"] = True\n2. Check goal buffer contents after each step\n3. Verify chunks exist in declarative memory\n4. Test productions individually\n5. Use !output! in productions for debugging'
          }
        ]
      },
      {
        title: 'Real-World Application',
        content: [
          {
            type: 'text',
            content: 'Complete models in research:'
          },
          {
            type: 'explanation',
            content: '• SGOMS: Modeling smartphone app usage\n• ACT-R/Phi: Modeling fMRI data\n• ACT-Touch: Modeling touchscreen interactions\n• ACT-Droid: Modeling mobile app learning\n• Many models available at: http://act-r.psy.cmu.edu/models/'
          }
        ]
      },
    ]
  },
  5: {
    sections: [
      {
        title: 'Advanced Subsymbolic Processing',
        content: [
          {
            type: 'text',
            content: 'Subsymbolic parameters make ACT-R models behave like humans - with errors, forgetting, and learning. Let\'s explore these mechanisms.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Model with all subsymbolic features
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True

# Key parameters that affect behavior
model.model_parameters["decay"] = 0.5           # Memory decay
model.model_parameters["instantaneous_noise"] = 0.25  # Activation noise
model.model_parameters["utility_noise"] = 0.5   # Decision variability
model.model_parameters["retrieval_threshold"] = -2.0  # Minimum activation

# Production compilation (learning)
model.model_parameters["production_compilation"] = True
model.model_parameters["utility_learning"] = True

print("Subsymbolic parameters set:")
for param in ["decay", "instantaneous_noise", "utility_noise"]:
    print(f"  {param}: {model.model_parameters[param]}")

print("\\nThese make the model more human-like!")`
          },
          {
            type: 'explanation',
            content: 'Decay models forgetting over time. Noise adds variability. Threshold prevents weak memories from being retrieved. Together, they create human-like errors!'
          }
        ]
      },
      {
        title: 'Spreading Activation',
        content: [
          {
            type: 'text',
            content: 'Spreading activation models how thinking about one concept activates related concepts. It\'s why thinking "dog" makes "cat" easier to remember!'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Model with spreading activation
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True
model.model_parameters["spreading_activation"] = True
model.model_parameters["strength_of_association"] = 1.0
model.model_parameters["buffer_spreading_activation"] = {"goal": 1}

# Create associated facts
actr.chunktype("fact", "subject relation object")
actr.chunktype("cue", "category")

# Add related facts (dogs and cats are both pets)
facts = [
    ("dog", "isa", "pet"),
    ("cat", "isa", "pet"),
    ("dog", "friend_of", "human"),
    ("cat", "friend_of", "human"),
    ("goldfish", "isa", "pet"),
]

for s, r, o in facts:
    model.decmem.add(actr.makechunk(
        chunktype="fact",
        subject=s,
        relation=r,
        object=o
    ))

# Set goal with "dog" - this will spread activation
model.goal.add(actr.makechunk(chunktype="cue", category="dog"))

print("Goal buffer contains 'dog'")
print("This spreads activation to related chunks!")
print("Cat-related facts now have higher activation")`
          },
          {
            type: 'explanation',
            content: 'The goal buffer spreads activation through shared features. "Dog" activates "pet", which activates "cat". This models semantic priming in human memory!'
          }
        ]
      },
      {
        title: 'Partial Matching',
        content: [
          {
            type: 'text',
            content: 'Partial matching allows retrieval of similar (not exact) chunks. This models how we can remember "something like" what we\'re looking for.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Model with partial matching
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True
model.model_parameters["partial_matching"] = True
model.model_parameters["mismatch_penalty"] = 1.0

# Facts about sizes
actr.chunktype("size_fact", "object size color")

sizes = [
    ("mouse", "tiny", "gray"),
    ("cat", "small", "varied"),
    ("dog", "medium", "varied"),
    ("horse", "large", "brown"),
]

for obj, size, color in sizes:
    model.decmem.add(actr.makechunk(
        chunktype="size_fact",
        object=obj,
        size=size,
        color=color
    ))

# Now request something "small" and "brown"
# No exact match, but partial matching finds similar!
print("Requesting: small brown animal")
print("No exact match exists...")
print("Partial matching will find closest match!")

# The model might retrieve cat (small, wrong color)
# or horse (brown, wrong size) depending on weights`
          },
          {
            type: 'explanation',
            content: 'Mismatch penalty controls how "fuzzy" matching is. Lower penalty = more flexible matching. This models how we find "close enough" memories!'
          }
        ]
      },
      {
        title: 'Exercises and Practice',
        content: [
          {
            type: 'text',
            content: 'Exercise: Implement blending for estimating values'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Price estimation through blending
blend_model = actr.ACTRModel()
blend_model.model_parameters["subsymbolic"] = True
blend_model.model_parameters["partial_matching"] = True
blend_model.model_parameters["blending"] = True

actr.chunktype("price_memory", "item category price")

# Add price memories
prices = [
    ("coffee_small", "beverage", "3"),
    ("coffee_large", "beverage", "5"),
    ("tea", "beverage", "4"),
    ("sandwich", "food", "8"),
    ("salad", "food", "10")
]

for item, cat, price in prices:
    blend_model.decmem.add(actr.makechunk(
        chunktype="price_memory",
        item=item,
        category=cat,
        price=price
    ))

# Request: "beverage" price
# Blending will average coffee and tea prices
print("Estimating typical beverage price...")
print("Will blend: $3, $5, $4 -> ~$4")`
          }
        ]
      },
      {
        title: 'Parameter Deep Dive',
        content: [
          {
            type: 'text',
            content: 'Advanced parameter interactions:'
          },
          {
            type: 'code',
            content: `# How noise and temperature interact
import numpy as np

def retrieval_probability(activation, threshold, temperature):
    """Calculate probability of retrieval"""
    return 1 / (1 + np.exp(-(activation - threshold) / temperature))

# Test different parameter combinations
activations = [-2, -1, 0, 1, 2]
threshold = 0
temperatures = [0.1, 0.5, 1.0]

for temp in temperatures:
    print(f"\nTemperature = {temp}:")
    for act in activations:
        prob = retrieval_probability(act, threshold, temp)
        print(f"  Activation {act}: {prob:.3f} retrieval probability")`
          }
        ]
      },
      {
        title: 'Performance Optimization',
        content: [
          {
            type: 'text',
            content: 'Making models run efficiently:'
          },
          {
            type: 'explanation',
            content: '1. Use retrieval threshold to limit search\n2. Disable unused subsymbolic computations\n3. Optimize production patterns for fast matching\n4. Use finsts to avoid re-attending to items\n5. Profile with model.model_parameters["trace"]'
          }
        ]
      },
      {
        title: 'Research Applications',
        content: [
          {
            type: 'text',
            content: 'Subsymbolic mechanisms explain:'
          },
          {
            type: 'explanation',
            content: '• Serial position effects in free recall\n• Power law of forgetting\n• Spacing effects in learning\n• Context effects on memory\n• Individual differences in working memory\n• Speed-accuracy tradeoffs'
          }
        ]
      },
    ]
  },
  6: {
    sections: [
      {
        title: 'Real-World Application: N-Back Task',
        content: [
          {
            type: 'text',
            content: 'The N-back task is a cognitive test where you must remember if the current stimulus matches one from N steps ago. Let\'s build a model that performs 2-back!'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# N-back task model
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True

# Chunk types for the task
actr.chunktype("stimulus", "value position")
actr.chunktype("nback_goal", "state current n_back_1 n_back_2 response")

# Initialize with empty history
goal = actr.makechunk(
    chunktype="nback_goal",
    state="ready",
    current=None,
    n_back_1=None,
    n_back_2=None,
    response=None
)
model.goal.add(goal)

print("2-back task model created")
print("Must compare current stimulus with 2 steps ago")
print("Sequence: A -> B -> C -> A (match!)")`
          },
          {
            type: 'explanation',
            content: 'N-back tasks measure working memory. 2-back is hard for humans because we must maintain and update multiple items. The model will show why!'
          }
        ]
      },
      {
        title: 'N-Back Productions',
        content: [
          {
            type: 'text',
            content: 'Let\'s add productions to process stimuli and detect matches:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Complete N-back model
actr.chunktype("stimulus", "value")
actr.chunktype("nback_goal", "state current back1 back2 response")

model = actr.ACTRModel()

# Update history (shift items back)
model.productionstring(
    name="update_history",
    string='''
    =g>
        isa nback_goal
        state attending
        current =new
        back1 =old1
        back2 =old2
    ==>
    =g>
        state compare
        back1 =new
        back2 =old1
'''
)

# Check for 2-back match
model.productionstring(
    name="check_match",
    string='''
    =g>
        isa nback_goal
        state compare
        current =item
        back2 =item
    ==>
    =g>
        state respond
        response match
'''
)

# Check for non-match
model.productionstring(
    name="check_no_match",
    string='''
    =g>
        isa nback_goal
        state compare
        current =item
        back2 ~=item
    ==>
    =g>
        state respond
        response no_match
'''
)

# Initialize goal
goal = actr.makechunk(
    chunktype="nback_goal",
    state="attending",
    current="A",
    back1="B",
    back2="C",
    response=None
)
model.goal.add(goal)

print("N-back model ready!")
print("Current: A, 1-back: B, 2-back: C")
print("Is this a match? Run to find out!")`
          },
          {
            type: 'explanation',
            content: 'Notice ~=item means "NOT equal". The model shifts history and compares. Real humans make errors when items are similar or under time pressure!'
          }
        ]
      },
      {
        title: 'Modeling Human Performance',
        content: [
          {
            type: 'text',
            content: 'Let\'s make our N-back model more realistic by adding timing, errors, and capacity limits like real humans have:'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Realistic N-back model
model = actr.ACTRModel()
model.model_parameters["subsymbolic"] = True

# Human-like parameters
model.model_parameters["decay"] = 0.5  # Forgetting
model.model_parameters["instantaneous_noise"] = 0.25  # Memory noise
model.model_parameters["retrieval_threshold"] = -1.0  # Can fail to retrieve

# Add timing parameters
model.model_parameters["latency_factor"] = 0.1
model.model_parameters["latency_exponent"] = 1.0

# Production for timed response
model.productionstring(
    name="respond_match",
    string='''
    =g>
        isa nback_goal
        state compare
        current =x
        back2 =x
    ==>
    =g>
        response match
'''
)

# Track performance
performance = {
    "hits": 0,      # Correct "match" responses
    "misses": 0,    # Failed to detect match
    "false_alarms": 0,  # Said match when not
    "correct_rejects": 0  # Correct "no match"
}

print("Human-like N-back model created!")
print("Parameters cause realistic errors:")
print("- Decay: items forgotten over time")
print("- Noise: similar items confused")
print("- Threshold: complete retrieval failures")
print("\\nJust like real humans in this difficult task!")`
          },
          {
            type: 'explanation',
            content: 'Real humans show ~80% accuracy on 2-back. The model\'s parameters can be tuned to match human data, validating our theory of working memory!'
          }
        ]
      },
      {
        title: 'Exercises and Practice',
        content: [
          {
            type: 'text',
            content: 'Exercise: Extend the N-back model to handle 3-back'
          },
          {
            type: 'code',
            content: `# 3-back extension
actr.chunktype("nback_goal", "state current back1 back2 back3")

# Production for 3-back comparison
model.productionstring(
    name="check_3back_match",
    string='''
    =g>
        isa nback_goal
        state compare
        current =item
        back3 =item
    ==>
    =g>
        response match_3back
'''
)

# More challenging: requires maintaining 4 items in working memory
print("3-back is much harder than 2-back!")
print("Performance typically drops from ~80% to ~60%")`
          }
        ]
      },
      {
        title: 'Using Real Data',
        content: [
          {
            type: 'text',
            content: 'Loading and fitting to actual experimental data:'
          },
          {
            type: 'code',
            content: `import pandas as pd
import numpy as np

# Simulate loading real N-back data
data = pd.DataFrame({
    'subject': ['S1', 'S1', 'S2', 'S2'],
    'n_back': [1, 2, 1, 2],
    'accuracy': [0.95, 0.80, 0.92, 0.75],
    'mean_rt': [0.65, 0.82, 0.70, 0.88]
})

# Fit model parameters to match human performance
def fit_nback_model(data):
    # Grid search over parameters
    best_params = None
    best_fit = float('inf')

    for decay in [0.3, 0.5, 0.7]:
        for noise in [0.2, 0.3, 0.4]:
            # Run model with parameters
            # Compare to human data
            # Calculate RMSE
            pass

    return best_params

print("Fitting model to human N-back data...")`
          }
        ]
      },
      {
        title: 'Model Validation',
        content: [
          {
            type: 'text',
            content: 'Validating models against human data:'
          },
          {
            type: 'explanation',
            content: '1. Collect human data (RT and accuracy)\n2. Run model multiple times (stochastic)\n3. Compare distributions, not just means\n4. Test on held-out conditions\n5. Look for signature effects (e.g., serial position)\n6. Parameter sensitivity analysis'
          }
        ]
      },
      {
        title: 'Applications',
        content: [
          {
            type: 'text',
            content: 'Real-world impact of cognitive models:'
          },
          {
            type: 'explanation',
            content: '• Education: Intelligent tutoring systems\n• Aviation: Pilot training and cockpit design\n• Medicine: Diagnostic decision support\n• Military: Situation awareness training\n• UX Design: Predicting user behavior\n• Neuropsychology: Understanding deficits'
          }
        ]
      },
    ]
  },
  7: {
    sections: [
      {
        title: 'Introduction to Motor Control',
        content: [
          {
            type: 'text',
            content: 'ACT-R includes a motor module that simulates physical actions like typing, clicking, and moving. This allows us to model not just thinking, but also the time it takes to execute actions.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Create a model with motor capabilities
model = actr.ACTRModel()

# Motor module is automatically included
# Let's explore key press timing

# Define a typing task
actr.chunktype("type_goal", "state letter")

# Production to initiate key press
model.productionstring(
    name="press_key",
    string='''
    =g>
        isa type_goal
        state ready
        letter =key
    ?manual>
        state free
    ==>
    =g>
        state pressing
    +manual>
        isa _manual
        cmd press_key
        key =key
'''
)

# The ?manual> checks if hands are free
# +manual> initiates the motor action
print("Motor model created!")
print("Key press takes ~250ms (preparation + execution)")`
          },
          {
            type: 'explanation',
            content: 'The motor module simulates real physical constraints. Key presses take time because of motor preparation and execution, just like real typing!'
          }
        ]
      },
      {
        title: 'Typing Model with Realistic Timing',
        content: [
          {
            type: 'text',
            content: 'Let\'s build a model that types a word with realistic timing, including the time to move fingers between keys.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Typing model with multiple keys
typing_model = actr.ACTRModel()
typing_model.model_parameters["motor_prepared"] = True

# Define the task
actr.chunktype("typing_goal", "state word current_pos")
actr.chunktype("letter_sequence", "position letter")

# Add word to type: "cat"
word = "cat"
for i, letter in enumerate(word):
    typing_model.decmem.add(
        actr.makechunk(
            chunktype="letter_sequence",
            position=str(i),
            letter=letter
        )
    )

# Production to retrieve next letter
typing_model.productionstring(
    name="get_letter",
    string='''
    =g>
        isa typing_goal
        state typing
        current_pos =pos
    ?manual>
        state free
    ==>
    =g>
        state retrieving
    +retrieval>
        isa letter_sequence
        position =pos
'''
)

# Production to type the letter
typing_model.productionstring(
    name="type_letter",
    string='''
    =g>
        isa typing_goal
        state retrieving
        current_pos =pos
    =retrieval>
        isa letter_sequence
        letter =letter
    ?manual>
        state free
    ==>
    =g>
        state typing
    +manual>
        isa _manual
        cmd press_key
        key =letter
    ~retrieval>
'''
)

# Production to advance position after typing
typing_model.productionstring(
    name="advance_position",
    string='''
    =g>
        isa typing_goal
        state typing
        current_pos 0
    ?manual>
        state free
    ==>
    =g>
        current_pos 1
        state typing
'''
)

print("Typing model ready!")
print(f"Will type: {word}")
print("Each key takes time based on finger movement distance")`
          },
          {
            type: 'explanation',
            content: 'Movement time between keys depends on physical distance - typing "qp" takes longer than "er" because fingers must move farther!'
          }
        ]
      },
      {
        title: 'Mouse Movement and Fitts\'s Law',
        content: [
          {
            type: 'text',
            content: 'ACT-R implements Fitts\'s Law for mouse movements: movement time = a + b * log2(2D/W), where D is distance and W is target width.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import math

# Model with mouse movements
mouse_model = actr.ACTRModel()

# Define a clicking task
actr.chunktype("click_goal", "state target_x target_y")

# Production to move mouse
mouse_model.productionstring(
    name="move_mouse",
    string='''
    =g>
        isa click_goal
        state ready
        target_x =x
        target_y =y
    ?manual>
        state free
    ==>
    =g>
        state moving
    +manual>
        isa _manual
        cmd move_cursor
        screen_pos =x =y
'''
)

# Production to click
mouse_model.productionstring(
    name="click_mouse",
    string='''
    =g>
        isa click_goal
        state moving
    ?manual>
        state free
    ==>
    =g>
        state done
    +manual>
        isa _manual
        cmd click_mouse
'''
)

# Calculate Fitts's Law time manually
def fitts_time(distance, width, a=0.1, b=0.1):
    """Calculate movement time using Fitts's Law"""
    return a + b * math.log2(2 * distance / width)

# Example: moving 200 pixels to 40-pixel target
distance = 200
target_width = 40
time = fitts_time(distance, target_width)

print(f"Fitts's Law prediction: {time:.3f} seconds")
print("ACT-R automatically applies this for mouse movements!")`
          },
          {
            type: 'explanation',
            content: 'Smaller targets take longer to click (harder to hit). Farther targets take longer too. This models the speed-accuracy tradeoff in human movement!'
          }
        ]
      }
    ]
  },
  8: {
    sections: [
      {
        title: 'Introduction to Vision Module',
        content: [
          {
            type: 'text',
            content: 'The vision module in ACT-R simulates how people search for visual information, shift attention, and process visual scenes. It models real constraints like limited attention span and eye movements.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Visual search model
visual_model = actr.ACTRModel()
visual_model.model_parameters['subsymbolic'] = True

# Visual representations
actr.chunktype("visual_object", "color shape location")
actr.chunktype("visual_goal", "state target found")
actr.chunktype("visual_location", "screen_x screen_y")

# Add visual scene
objects = [
    ("red", "circle", "100 200"),
    ("blue", "square", "200 200"),
    ("red", "square", "300 200"),
    ("green", "circle", "150 300")
]

for color, shape, location in objects:
    visual_model.decmem.add(
        actr.makechunk(
            chunktype="visual_object",
            color=color,
            shape=shape,
            location=location
        )
    )

# Production to attend to location
visual_model.productionstring(
    name="find_red_object",
    string='''
    =g>
        isa visual_goal
        state searching
        target red
    =visual_location>
        isa visual_location
        screen_x =x
        screen_y =y
    ==>
    =g>
        state attending
    +visual>
        isa _visual
        cmd move_attention
        screen_x =x
        screen_y =y
'''
)

print("Visual search model created!")
print("Scene contains 4 objects")
print("Model will search for red objects")`
          },
          {
            type: 'explanation',
            content: 'The vision module has two buffers: visual-location (where) and visual (what). First find WHERE something is, then attend to see WHAT it is!'
          }
        ]
      },
      {
        title: 'Visual Search Strategies',
        content: [
          {
            type: 'text',
            content: 'Let\'s model different visual search strategies: feature search (fast) vs conjunction search (slow).'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Feature vs Conjunction search model
search_model = actr.ACTRModel()
search_model.model_parameters['visual_finst_span'] = 4  # Track 4 locations

actr.chunktype("search_goal", "state target_color target_shape found")
actr.chunktype("visual_object", "color shape x y")

# Production for feature search (just color)
search_model.productionstring(
    name="feature_search",
    string='''
    =g>
        isa search_goal
        state searching
        target_color =color
        target_shape none
    ==>
    =g>
        state locating
    +visual_location>
        isa _visual_location
        color =color
'''
)

# Production for conjunction search (color AND shape)
search_model.productionstring(
    name="conjunction_search",
    string='''
    =g>
        isa search_goal
        state searching
        target_color =color
        target_shape =shape
    ==>
    =g>
        state scanning
    +visual_location>
        isa _visual_location
'''
)

# Check if found target
search_model.productionstring(
    name="check_object",
    string='''
    =g>
        isa search_goal
        state attending
        target_color =color
        target_shape =shape
    =visual>
        isa visual_object
        color =color
        shape =shape
    ==>
    =g>
        state done
        found yes
'''
)

print("Visual search model ready!")
print("Feature search: Find any RED object (fast)")
print("Conjunction search: Find RED SQUARE (slower)")
print("Note: visual_finst_span tracks attended locations")`
          },
          {
            type: 'explanation',
            content: 'Feature search "pops out" - finding a red object among blue ones is fast regardless of number. Conjunction search is serial - must check each item!'
          }
        ]
      },
      {
        title: 'Modeling Eye Movements',
        content: [
          {
            type: 'text',
            content: 'ACT-R can model saccadic eye movements, including timing and the decision of where to look next.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Eye movement model
eye_model = actr.ACTRModel()
eye_model.model_parameters['subsymbolic'] = True

# Eye movement parameters
eye_model.model_parameters['visual_attention_latency'] = 0.085  # 85ms
eye_model.model_parameters['visual_movement_time'] = 0.035     # 35ms per degree

# Scene with text to read
actr.chunktype("word_location", "word x y width")
actr.chunktype("reading_goal", "state current_word")

# Add words in a line
words = [
    ("The", 50, 100, 30),
    ("cat", 100, 100, 30),
    ("sat", 150, 100, 30),
    ("on", 200, 100, 20),
    ("mat", 240, 100, 30)
]

for word, x, y, width in words:
    eye_model.decmem.add(
        actr.makechunk(
            chunktype="word_location",
            word=word,
            x=str(x),
            y=str(y),
            width=str(width)
        )
    )

# Saccade to next word
eye_model.productionstring(
    name="saccade_next_word",
    string='''
    =g>
        isa reading_goal
        state reading
        current_word =word
    =visual>
        isa word_location
        word =word
        x =x
    ==>
    =g>
        state finding_next
    +visual_location>
        isa _visual_location
        nearest current
'''
)

# Regressive saccade (look back)
eye_model.productionstring(
    name="regress_saccade",
    string='''
    =g>
        isa reading_goal
        state confused
        current_word =word
    =visual>
        isa word_location
        word =word
        x =x
    ==>
    =g>
        state rereading
    +visual_location>
        isa _visual_location
        nearest previous
'''
)

print("Eye movement model created!")
print("Models reading with forward saccades")
print("Can also make regressive saccades when confused")
print("Movement time depends on distance (degrees of visual angle)")`
          },
          {
            type: 'explanation',
            content: 'Eye movements take time: latency to plan + time proportional to distance. The \'nearest\' constraint finds the closest matching location. Real reading involves ~4 fixations per second!'
          }
        ]
      }
    ]
  },
  9: {
    sections: [
      {
        title: 'Introduction to Learning',
        content: [
          {
            type: 'text',
            content: 'ACT-R models several types of learning: production compilation (creating new rules), utility learning (which rule to prefer), and declarative strengthening. Let\'s explore these mechanisms.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Learning model
learning_model = actr.ACTRModel()
learning_model.model_parameters['subsymbolic'] = True

# Enable learning mechanisms
learning_model.model_parameters['production_compilation'] = True
learning_model.model_parameters['utility_learning'] = True
learning_model.model_parameters['alpha'] = 0.2  # Learning rate
learning_model.model_parameters['egs'] = 0.1    # Utility noise

# Task: Learn arithmetic facts through practice
actr.chunktype("arithmetic_goal", "state problem answer")
actr.chunktype("arithmetic_fact", "problem answer")

# Initially, must retrieve facts
learning_model.productionstring(
    name="retrieve_answer",
    string='''
    =g>
        isa arithmetic_goal
        state solving
        problem =prob
    ==>
    =g>
        state retrieving
    +retrieval>
        isa arithmetic_fact
        problem =prob
'''
)

# Use retrieved answer
learning_model.productionstring(
    name="use_retrieved",
    string='''
    =g>
        isa arithmetic_goal
        state retrieving
    =retrieval>
        isa arithmetic_fact
        answer =ans
    ==>
    =g>
        state done
        answer =ans
    ~retrieval>
''',
    reward=1  # Reward for successful retrieval
)

print("Learning model created!")
print("Production compilation will create shortcuts")
print("Utility learning will prefer successful strategies")`
          },
          {
            type: 'explanation',
            content: 'Production compilation watches sequences of rules fire and creates shortcuts. After practice, "3+4" might compile into a single rule that directly produces "7"!'
          }
        ]
      },
      {
        title: 'Power Law of Practice',
        content: [
          {
            type: 'text',
            content: 'The power law of practice describes how performance improves with practice: RT = a * N^(-b), where N is practice trials.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np
import matplotlib.pyplot as plt

# Model skill acquisition over trials
def power_law_rt(N, a=1.0, b=0.5):
    """Calculate RT using power law of practice"""
    return a * (N ** -b)

# Simulate learning over 100 trials
trials = np.arange(1, 101)
rts = [power_law_rt(n) for n in trials]

# ACT-R model that learns
practice_model = actr.ACTRModel()
practice_model.model_parameters['subsymbolic'] = True

# Track performance over time
actr.chunktype("task_goal", "state trial_num rt")

# Production that gets faster with practice
practice_model.productionstring(
    name="perform_task",
    string='''
    =g>
        isa task_goal
        state ready
        trial_num =n
    ==>
    =g>
        state done
''',
    utility=1  # Initial utility
)

# Utility learning will increase this production's utility
# Making it fire faster over time

print("Power Law of Practice:")
print(f"Trial 1: {power_law_rt(1):.3f}s")
print(f"Trial 10: {power_law_rt(10):.3f}s")
print(f"Trial 100: {power_law_rt(100):.3f}s")
print("\\nPerformance improves rapidly at first, then levels off")`
          },
          {
            type: 'explanation',
            content: 'The power law appears naturally in ACT-R through multiple mechanisms: strengthening of chunks, utility learning, and production compilation. This matches human learning curves!'
          }
        ]
      },
      {
        title: 'Production Compilation in Action',
        content: [
          {
            type: 'text',
            content: 'Let\'s see how production compilation creates new, more efficient rules from sequences of simpler rules.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Model that compiles productions
compilation_model = actr.ACTRModel()
compilation_model.model_parameters['production_compilation'] = True

# Task: Categorize animals (2-step process initially)
actr.chunktype("categorize", "state animal feature category")
actr.chunktype("feature_fact", "animal feature")
actr.chunktype("category_rule", "feature category")

# Step 1: Retrieve feature
compilation_model.productionstring(
    name="get_feature",
    string='''
    =g>
        isa categorize
        state start
        animal =a
    ==>
    =g>
        state retrieving_feature
    +retrieval>
        isa feature_fact
        animal =a
'''
)

# Step 2: Apply rule
compilation_model.productionstring(
    name="apply_rule",
    string='''
    =g>
        isa categorize
        state retrieving_feature
    =retrieval>
        isa feature_fact
        feature =f
    ==>
    =g>
        state retrieving_rule
        feature =f
    +retrieval>
        isa category_rule
        feature =f
'''
)

# Step 3: Report category
compilation_model.productionstring(
    name="report_category",
    string='''
    =g>
        isa categorize
        state retrieving_rule
    =retrieval>
        isa category_rule
        category =c
    ==>
    =g>
        state done
        category =c
'''
)

# After practice, compilation creates:
# "dog" -> "mammal" in one step!

print("Initial process: 3 steps")
print("1. Retrieve that dog has fur")
print("2. Retrieve that fur means mammal")
print("3. Report mammal")
print("\\nAfter compilation: 1 step!")
print("dog -> mammal (directly)")`
          },
          {
            type: 'explanation',
            content: 'Production compilation eliminates intermediate retrieval steps. This is how experts become fast - they develop specialized productions for common patterns!'
          }
        ]
      }
    ]
  },
  10: {
    sections: [
      {
        title: 'Introduction to Model Fitting',
        content: [
          {
            type: 'text',
            content: 'Model fitting involves adjusting ACT-R parameters to match human performance data. This allows us to test theories and make predictions about human cognition.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# Example human data: response times for different set sizes
human_data = {
    'set_size': [2, 4, 6, 8],
    'mean_rt': [0.45, 0.68, 0.92, 1.15],  # seconds
    'std_rt': [0.08, 0.10, 0.12, 0.15]
}

# Create a visual search model that we'll fit to this data
def create_search_model(retrieval_threshold, latency_factor, visual_finst_span):
    """Create model with specific parameters"""
    model = actr.ACTRModel()
    model.model_parameters['subsymbolic'] = True
    model.model_parameters['retrieval_threshold'] = retrieval_threshold
    model.model_parameters['latency_factor'] = latency_factor
    model.model_parameters['visual_finst_span'] = visual_finst_span

    # Model searches for target among distractors
    actr.chunktype("search_goal", "state target_found items_checked")
    actr.chunktype("visual_item", "item_type location")

    return model

print("Model fitting framework ready!")
print(f"Human data: {human_data}")`
          },
          {
            type: 'explanation',
            content: 'We have human RT data showing linear increase with set size. Our goal: find ACT-R parameters that produce the same pattern. This validates our cognitive theory!'
          }
        ]
      },
      {
        title: 'Grid Search Parameter Fitting',
        content: [
          {
            type: 'text',
            content: 'Grid search systematically explores parameter combinations to find the best fit.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np
from itertools import product

# Human data from visual search experiment
human_data = {
    'set_size': [2, 4, 6, 8],
    'mean_rt': [0.45, 0.68, 0.92, 1.15],  # seconds
    'std_rt': [0.08, 0.10, 0.12, 0.15]
}

# Define parameter grid
param_grid = {
    'retrieval_threshold': [-1.0, -0.5, 0.0, 0.5],
    'latency_factor': [0.1, 0.2, 0.3, 0.4],
    'latency_exponent': [0.5, 1.0, 1.5]
}

def simulate_response_time(params, set_size):
    """Simulate RT for a given set size"""
    # Simplified RT prediction based on ACT-R equations
    # RT = base_time + retrieval_time * log(set_size)
    base_time = 0.2
    retrieval_time = params['latency_factor'] * \\
                    (set_size ** params['latency_exponent'])
    noise = np.random.normal(0, 0.05)  # Add noise
    return base_time + retrieval_time + noise

def compute_rmse(params, human_data):
    """Compute root mean squared error"""
    predicted_rts = []
    for size in human_data['set_size']:
        # Run multiple simulations
        rts = [simulate_response_time(params, size) for _ in range(10)]
        predicted_rts.append(np.mean(rts))

    # Calculate RMSE
    rmse = np.sqrt(np.mean((np.array(predicted_rts) -
                           np.array(human_data['mean_rt']))**2))
    return rmse

# Grid search
best_params = None
best_rmse = float('inf')

# Generate all parameter combinations
param_combinations = list(product(*param_grid.values()))
param_names = list(param_grid.keys())

print(f"Testing {len(param_combinations)} parameter combinations...")

# Test first 10 for demo
for combo in param_combinations[:10]:
    params = dict(zip(param_names, combo))
    rmse = compute_rmse(params, human_data)

    if rmse < best_rmse:
        best_rmse = rmse
        best_params = params

print(f"\\nBest parameters: {best_params}")
print(f"Best RMSE: {best_rmse:.4f}")`
          },
          {
            type: 'explanation',
            content: 'Grid search tests all combinations. It\'s thorough but computationally expensive. For complex models with many parameters, we need smarter optimization methods!'
          }
        ]
      },
      {
        title: 'Cross-Validation',
        content: [
          {
            type: 'text',
            content: 'Cross-validation ensures our model generalizes to new data, not just fitting noise in training data.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Simple K-fold cross-validation implementation
class SimpleKFold:
    def __init__(self, n_splits=5, shuffle=True, random_state=None):
        self.n_splits = n_splits
        self.shuffle = shuffle
        self.random_state = random_state

    def split(self, data):
        n = len(data)
        indices = np.arange(n)

        if self.shuffle:
            np.random.seed(self.random_state)
            np.random.shuffle(indices)

        fold_size = n // self.n_splits

        for i in range(self.n_splits):
            test_start = i * fold_size
            test_end = test_start + fold_size if i < self.n_splits - 1 else n

            test_idx = indices[test_start:test_end]
            train_idx = np.concatenate([indices[:test_start], indices[test_end:]])

            yield train_idx, test_idx

# Human data from visual search experiment
human_data = {
    'set_size': [2, 4, 6, 8],
    'mean_rt': [0.45, 0.68, 0.92, 1.15],  # seconds
    'std_rt': [0.08, 0.10, 0.12, 0.15]
}

# Extended dataset with individual trials
np.random.seed(42)
trial_data = []

# Generate synthetic trial data
for set_size in [2, 4, 6, 8]:
    mean_rt = human_data['mean_rt'][human_data['set_size'].index(set_size)]
    std_rt = human_data['std_rt'][human_data['set_size'].index(set_size)]

    # 20 trials per condition
    for _ in range(20):
        rt = np.random.normal(mean_rt, std_rt)
        trial_data.append({'set_size': set_size, 'rt': max(0.2, rt)})

# Convert to numpy array for indexing
trial_array = np.array(trial_data)

# K-fold cross-validation
kfold = SimpleKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = []

for fold, (train_idx, test_idx) in enumerate(kfold.split(trial_array)):
    print(f"\\nFold {fold + 1}:")

    # Split data
    train_data = trial_array[train_idx]
    test_data = trial_array[test_idx]

    # Calculate mean RT per set size for training data
    train_means = {}
    for trial in train_data:
        size = trial['set_size']
        if size not in train_means:
            train_means[size] = []
        train_means[size].append(trial['rt'])

    for size in train_means:
        train_means[size] = np.mean(train_means[size])

    # Test on held-out data
    test_predictions = []
    test_actual = []

    for trial in test_data:
        # Simple linear prediction
        pred_rt = 0.3 + 0.1 * trial['set_size']
        test_predictions.append(pred_rt)
        test_actual.append(trial['rt'])

    # Calculate test RMSE
    test_rmse = np.sqrt(np.mean((np.array(test_predictions) -
                                np.array(test_actual))**2))
    cv_scores.append(test_rmse)

    print(f"   Test RMSE: {test_rmse:.4f}")

print(f"\\nCross-validation Results:")
print(f"Mean CV RMSE: {np.mean(cv_scores):.4f} ± {np.std(cv_scores):.4f}")
print("\\nGood generalization if test RMSE ≈ training RMSE!")`
          },
          {
            type: 'explanation',
            content: 'Cross-validation splits data into folds. Train on 4 folds, test on 1, repeat. This ensures the model works on unseen data, not just memorizing training examples!'
          }
        ]
      }
    ]
  },
  11: {
    sections: [
      {
        title: 'Complex Problem Solving',
        content: [
          {
            type: 'text',
            content: 'Complex problem solving involves planning, strategy selection, and managing multiple goals. ACT-R models these through goal stacks and production rules.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Water jug problem: Classic problem solving task
# Goal: Get exactly 4 gallons using 3-gallon and 5-gallon jugs

water_jug_model = actr.ACTRModel()

# Define problem state
actr.chunktype("jug_state", "jug3 jug5 goal_amount")
actr.chunktype("operator", "name precondition effect")
actr.chunktype("problem_goal", "state current_state target_amount")

# Add operators (possible actions)
operators = [
    ("fill3", "jug3<3", "jug3=3"),
    ("fill5", "jug5<5", "jug5=5"),
    ("empty3", "jug3>0", "jug3=0"),
    ("empty5", "jug5>0", "jug5=0"),
    ("pour3to5", "jug3>0,jug5<5", "transfer"),
    ("pour5to3", "jug5>0,jug3<3", "transfer")
]

for name, pre, eff in operators:
    water_jug_model.decmem.add(
        actr.makechunk(
            chunktype="operator",
            name=name,
            precondition=pre,
            effect=eff
        )
    )

# Production to select operator
water_jug_model.productionstring(
    name="select_operator",
    string='''
    =g>
        isa problem_goal
        state planning
        current_state =state
    ==>
    =g>
        state retrieving_operator
    +retrieval>
        isa operator
'''
)

# Production to apply operator
water_jug_model.productionstring(
    name="apply_operator",
    string='''
    =g>
        isa problem_goal
        state retrieving_operator
    =retrieval>
        isa operator
        name =op
    ==>
    =g>
        state applying
'''
)

print("Water jug problem solver initialized!")
print("Goal: Get exactly 4 gallons")
print("Tools: 3-gallon jug and 5-gallon jug")
print("\\nThis demonstrates:")
print("- Operator selection")
print("- State space search")
print("- Goal-directed problem solving")`
          },
          {
            type: 'explanation',
            content: 'Problem solving requires selecting operators that move closer to the goal. The model must track state, evaluate preconditions, and apply effects. Real problem solving also involves dead ends and backtracking!'
          }
        ]
      },
      {
        title: 'Means-Ends Analysis',
        content: [
          {
            type: 'text',
            content: 'Means-ends analysis is a fundamental problem-solving strategy where we reduce differences between current and goal states.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Route planning using means-ends analysis
planning_model = actr.ACTRModel()
planning_model.model_parameters['subsymbolic'] = True

# Define planning representations
actr.chunktype("location", "name connections distance_to_goal")
actr.chunktype("route_goal", "state current_loc target_loc path")
actr.chunktype("difference", "type magnitude action")

# Add map knowledge
locations = [
    ("home", "street1,street2", "5"),
    ("street1", "home,mall,street3", "4"),
    ("street2", "home,park", "3"),
    ("street3", "street1,office", "2"),
    ("mall", "street1,office", "3"),
    ("park", "street2,office", "2"),
    ("office", "street3,mall,park", "0")
]

for name, conn, dist in locations:
    planning_model.decmem.add(
        actr.makechunk(
            chunktype="location",
            name=name,
            connections=conn,
            distance_to_goal=dist
        )
    )

# Production for identifying differences
planning_model.productionstring(
    name="find_difference",
    string='''
    =g>
        isa route_goal
        state planning
        current_loc =current
        target_loc =target
    ?retrieval>
        buffer empty
    ==>
    =g>
        state analyzing
    +retrieval>
        isa location
        name =current
'''
)

# Production for selecting next move (hill climbing)
planning_model.productionstring(
    name="select_best_move",
    string='''
    =g>
        isa route_goal
        state analyzing
        current_loc =current
    =retrieval>
        isa location
        connections =connections
        distance_to_goal =dist
    ==>
    =g>
        state moving
'''
)

print("Route Planning with Means-Ends Analysis")
print("Goal: Navigate from home to office")
print("\\nStrategy: Reduce distance to goal at each step")
print("This models:")
print("- Difference reduction")
print("- Hill climbing heuristics")
print("- Local vs global optimization")`
          },
          {
            type: 'explanation',
            content: 'Means-ends analysis doesn\'t always find optimal solutions - it can get stuck in local minima. Humans often use this greedy strategy because it\'s cognitively efficient!'
          }
        ]
      },
      {
        title: 'Insight and Restructuring',
        content: [
          {
            type: 'text',
            content: 'Modeling "Aha!" moments and problem restructuring - when solvers suddenly see problems differently.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import random

# Nine-dot problem: Classic insight problem
insight_model = actr.ACTRModel()
insight_model.model_parameters['subsymbolic'] = True
insight_model.model_parameters['spreading_activation'] = True

# Problem representation
actr.chunktype("problem_space", "constraint assumption status")
actr.chunktype("insight_goal", "state constraint_active attempts")
actr.chunktype("solution_attempt", "approach success")

# Initial constraint (stay within the dots)
insight_model.decmem.add(
    actr.makechunk(
        chunktype="problem_space",
        constraint="stay_inside_dots",
        assumption="implicit",
        status="active"
    )
)

# Failed attempts strengthen need for restructuring
for i in range(5):
    insight_model.decmem.add(
        actr.makechunk(
            chunktype="solution_attempt",
            approach="within_bounds",
            success="false"
        )
    )

# Production for normal solving
insight_model.productionstring(
    name="constrained_attempt",
    string='''
    =g>
        isa insight_goal
        state solving
        constraint_active yes
    ==>
    =g>
        state attempting
    ''',
    utility=5
)

# Production for impasse detection
insight_model.productionstring(
    name="detect_impasse",
    string='''
    =g>
        isa insight_goal
        state attempting
        attempts 3
    ==>
    =g>
        state impasse
    +retrieval>
        isa problem_space
        status active
'''
)

# Production for constraint relaxation (insight!)
insight_model.productionstring(
    name="relax_constraint",
    string='''
    =g>
        isa insight_goal
        state impasse
    =retrieval>
        isa problem_space
        constraint stay_inside_dots
    ==>
    =g>
        state restructured
        constraint_active no
    =retrieval>
        status relaxed
    ''',
    utility=2  # Initially low utility
)

print("Nine-Dot Problem: Insight Modeling")
print("Connect 9 dots with 4 straight lines without lifting pen")
print("\\nInsight mechanism:")
print("1. Initial constraint: stay within dot boundaries")
print("2. Repeated failures build impasse")
print("3. Constraint relaxation → insight")
print("4. New solution space enables success")
print("\\nThis models how assumptions block problem solving")`
          },
          {
            type: 'explanation',
            content: 'Insight happens when we relax implicit constraints. The model shows how repeated failure can trigger restructuring. Real insights also involve spreading activation making remote associations suddenly available!'
          }
        ]
      }
    ]
  },
  12: {
    sections: [
      {
        title: 'Language Processing Basics',
        content: [
          {
            type: 'text',
            content: 'Language processing involves multiple levels: phonology, morphology, syntax, and semantics. ACT-R models these through declarative and procedural knowledge.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import time

# Basic word recognition model
word_model = actr.ACTRModel()
word_model.model_parameters['subsymbolic'] = True
word_model.model_parameters['activation_trace'] = True

# Lexical knowledge
actr.chunktype("word", "form meaning frequency category")
actr.chunktype("recognition_goal", "state input word")

# Add lexicon with frequency effects
words = [
    ("cat", "feline_animal", "high", "noun"),
    ("dog", "canine_animal", "high", "noun"),
    ("run", "move_fast", "high", "verb"),
    ("aardvark", "african_mammal", "low", "noun"),
    ("cogitate", "think_deeply", "low", "verb")
]

for form, meaning, freq, cat in words:
    chunk = actr.makechunk(
        chunktype="word",
        form=form,
        meaning=meaning,
        frequency=freq,
        category=cat
    )
    # Add to declarative memory
    # In subsymbolic mode, frequency affects retrieval naturally
    word_model.decmem.add(chunk)

# Production for word recognition
word_model.productionstring(
    name="recognize_word",
    string='''
    =g>
        isa recognition_goal
        state reading
        input =text
    ==>
    =g>
        state retrieving
    +retrieval>
        isa word
        form =text
'''
)

# Production for successful recognition
word_model.productionstring(
    name="word_found",
    string='''
    =g>
        isa recognition_goal
        state retrieving
    =retrieval>
        isa word
        form =word
        meaning =meaning
        frequency =freq
    ==>
    =g>
        state recognized
        word =word
'''
)

print("Word Recognition Model")
print("Demonstrates frequency effects:")
print("- High frequency words (cat, dog) recognized faster")
print("- Low frequency words (aardvark, cogitate) take longer")
print("- Frequency parameter affects retrieval in subsymbolic mode")`
          },
          {
            type: 'explanation',
            content: 'Word frequency is one of the strongest predictors of recognition time. High-frequency words have stronger memory traces, making them easier to retrieve. This models the word frequency effect in reading!'
          }
        ]
      },
      {
        title: 'Syntactic Parsing',
        content: [
          {
            type: 'text',
            content: 'Modeling how humans parse sentences incrementally using grammatical knowledge.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Syntactic parsing model
parser_model = actr.ACTRModel()
parser_model.model_parameters['subsymbolic'] = True

# Grammar representations
actr.chunktype("phrase", "type head modifier complete")
actr.chunktype("parse_state", "position word_list current_phrase stack")
actr.chunktype("grammar_rule", "lhs rhs1 rhs2")

# Add grammar rules
grammar = [
    ("S", "NP", "VP"),      # Sentence → NounPhrase VerbPhrase
    ("NP", "DET", "N"),     # NounPhrase → Determiner Noun
    ("NP", "ADJ", "N"),     # NounPhrase → Adjective Noun
    ("VP", "V", "NP"),      # VerbPhrase → Verb NounPhrase
    ("VP", "V", "PP"),      # VerbPhrase → Verb PrepPhrase
    ("PP", "P", "NP")       # PrepPhrase → Preposition NounPhrase
]

for lhs, rhs1, rhs2 in grammar:
    parser_model.decmem.add(
        actr.makechunk(
            chunktype="grammar_rule",
            lhs=lhs,
            rhs1=rhs1,
            rhs2=rhs2
        )
    )

# Production for starting parse
parser_model.productionstring(
    name="begin_parse",
    string='''
    =g>
        isa parse_state
        position start
        word_list =words
    ==>
    =g>
        position parsing
        current_phrase nil
        stack empty
'''
)

# Production for shift (read next word)
parser_model.productionstring(
    name="shift_word",
    string='''
    =g>
        isa parse_state
        position parsing
        word_list =words
    ==>
    =g>
        position shifting
    +retrieval>
        isa word
        form =words
'''
)

# Production for reduce (apply grammar rule)
parser_model.productionstring(
    name="reduce_phrase",
    string='''
    =g>
        isa parse_state
        position parsing
    =retrieval>
        isa grammar_rule
        rhs1 =cat1
        rhs2 =cat2
        lhs =result
    ==>
    =g>
        position reducing
'''
)

print("Syntactic Parser Model")
print("Implements incremental parsing with:")
print("- Shift-reduce parsing algorithm")
print("- Grammar rule application")
print("- Attachment ambiguity resolution")
print("\\nExample: 'The cat chased the mouse in the garden'")
print("Ambiguity: Does 'in the garden' attach to 'mouse' or 'chased'?")`
          },
          {
            type: 'explanation',
            content: 'Humans parse incrementally, word by word. The shift-reduce parser models this, including garden path sentences where initial parse is wrong and must be revised!'
          }
        ]
      },
      {
        title: 'Reading and Eye Movements',
        content: [
          {
            type: 'text',
            content: 'Modeling how readers move their eyes through text, including word skipping and regressions.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Reading model with eye movements
reading_model = actr.ACTRModel()
reading_model.model_parameters['subsymbolic'] = True

# Text and eye movement representations
actr.chunktype("text_location", "word position length frequency predictability")
actr.chunktype("reading_goal", "state current_word fixation_time")
actr.chunktype("eye_movement", "type target duration")

# Example sentence with properties
sentence = [
    ("The", "1", "3", "high", "high"),
    ("quick", "2", "5", "high", "medium"),
    ("brown", "3", "5", "high", "high"),
    ("fox", "4", "3", "high", "medium"),
    ("jumped", "5", "6", "medium", "low"),
    ("over", "6", "4", "high", "high"),
    ("the", "7", "3", "high", "high"),
    ("lazy", "8", "4", "medium", "medium"),
    ("dog", "9", "3", "high", "high")
]

for word, pos, length, freq, pred in sentence:
    reading_model.decmem.add(
        actr.makechunk(
            chunktype="text_location",
            word=word,
            position=pos,
            length=length,
            frequency=freq,
            predictability=pred
        )
    )

# Production for fixation duration based on frequency
reading_model.productionstring(
    name="process_frequent_word",
    string='''
    =g>
        isa reading_goal
        state processing
    =retrieval>
        isa text_location
        word =word
        frequency high
        length 3
    ==>
    =g>
        state planning_saccade
        fixation_time 200
'''
)

# Production for difficult word processing
reading_model.productionstring(
    name="process_difficult_word",
    string='''
    =g>
        isa reading_goal
        state processing
    =retrieval>
        isa text_location
        word =word
        frequency low
    ==>
    =g>
        state planning_saccade
        fixation_time 350
'''
)

# Production for word skipping (predictable words)
reading_model.productionstring(
    name="skip_predictable_word",
    string='''
    =g>
        isa reading_goal
        state planning_saccade
        current_word =pos
    ==>
    =g>
        state skipping
    +retrieval>
        isa text_location
        predictability high
        length 4
'''
)

print("Reading Model with Eye Movements")
print("\\nEye movement behaviors:")
print("1. Fixation duration varies with:")
print("   - Word frequency (common words: ~200ms)")
print("   - Word length (longer words: more time)")
print("   - Predictability (expected words: shorter)")
print("\\n2. Word skipping:")
print("   - Short, predictable words often skipped")
print("   - 'the' skipped ~50% of time")
print("\\n3. Regressions:")
print("   - ~10-15% of saccades go backward")
print("   - Triggered by comprehension difficulty")`
          },
          {
            type: 'explanation',
            content: 'Eye tracking reveals reading processes. We don\'t read every word - short, predictable words are often skipped. Difficult passages trigger regressions. This model captures these patterns!'
          }
        ]
      }
    ]
  }
}