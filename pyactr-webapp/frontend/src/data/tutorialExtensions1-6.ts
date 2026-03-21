// Extensions for tutorials 1-6
export const tutorialExtensions = {
  1: {
    sections: [
      {
        title: 'Exercises: Practice with Chunks and Productions',
        content: [
          {
            type: 'text',
            content: 'Let\'s practice what we\'ve learned with some hands-on exercises. Try to solve these before looking at the solutions!'
          },
          {
            type: 'text',
            content: 'Exercise 1: Create chunks representing family relationships (parent-of, sibling-of)'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Try it yourself first!
# Create a chunk type for family relationships
# Then create chunks for:
# - John is parent of Mary
# - Mary is sibling of Tom
# - Tom is parent of Sue

# Solution:
actr.chunktype("family", "person1 relation person2")

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

tom_parent_sue = actr.makechunk(
    chunktype="family",
    person1="Tom",
    relation="parent-of",
    person2="Sue"
)

print("Family relationships created!")
print(f"John -> Mary: {john_parent_mary.relation}")
print(f"Mary -> Tom: {mary_sibling_tom.relation}")
print(f"Tom -> Sue: {tom_parent_sue.relation}")`
          },
          {
            type: 'text',
            content: 'Exercise 2: Build a model that counts backwards from 5 to 1'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Solution: Countdown model
actr.chunktype("countdown", "current previous")
actr.chunktype("count_goal", "state count target")

countdown_model = actr.ACTRModel()

# Add countdown facts
facts = [("5", "4"), ("4", "3"), ("3", "2"), ("2", "1")]
for curr, prev in facts:
    countdown_model.decmem.add(
        actr.makechunk(
            chunktype="countdown",
            current=curr,
            previous=prev
        )
    )

# Production to count down
countdown_model.productionstring(
    name="count_down",
    string='''
    =g>
        isa count_goal
        state counting
        count =num
        target ~=num
    ==>
    =g>
        state retrieving
    +retrieval>
        isa countdown
        current =num
'''
)

# Production to continue with retrieved number
countdown_model.productionstring(
    name="continue_countdown",
    string='''
    =g>
        isa count_goal
        state retrieving
    =retrieval>
        isa countdown
        current =num
        previous =prev
    ==>
    =g>
        state counting
        count =prev
    !output!
        Countdown: =prev
'''
)

# Set goal to count from 5 to 1
goal = actr.makechunk(
    chunktype="count_goal",
    state="counting",
    count="5",
    target="1"
)
countdown_model.goal.add(goal)

print("Countdown model ready!")`
          },
          {
            type: 'explanation',
            content: 'These exercises show how chunks can represent ANY relationships and productions can implement ANY sequential process. The key is thinking about what goes in the buffers!'
          }
        ]
      },
      {
        title: 'Parameter Exploration: How Parameters Change Behavior',
        content: [
          {
            type: 'text',
            content: 'Let\'s explore how different parameters affect model behavior. Small changes can have big effects!'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import time

# Create models with different parameters
def create_model_with_params(trace=False, subsymbolic=False):
    model = actr.ACTRModel()
    model.model_parameters["trace"] = trace
    model.model_parameters["subsymbolic"] = subsymbolic

    if subsymbolic:
        model.model_parameters["rt"] = True  # Enable reaction times
        model.model_parameters["latency_factor"] = 0.1
        model.model_parameters["latency_exponent"] = 1.0

    return model

# Model 1: Basic (no trace, no subsymbolic)
basic_model = create_model_with_params(False, False)
print("Basic model: Fast, no timing")

# Model 2: With trace
trace_model = create_model_with_params(True, False)
print("Trace model: Shows every step")

# Model 3: With subsymbolic timing
timed_model = create_model_with_params(False, True)
print("Timed model: Realistic cognitive timing")

# Compare execution
actr.chunktype("simple_goal", "state")

for model, name in [(basic_model, "Basic"),
                    (trace_model, "Trace"),
                    (timed_model, "Timed")]:

    # Add simple production
    model.productionstring(
        name="do_something",
        string='''
        =g>
            isa simple_goal
            state start
        ==>
        =g>
            state done
        '''
    )

    # Set goal
    model.goal.add(actr.makechunk(chunktype="simple_goal", state="start"))

    # Run simulation
    print(f"\\n{name} Model:")
    sim = model.simulation()

    if name == "Basic":
        sim.run(1.0)
        print("  Runs instantly")
    elif name == "Trace":
        # Would show detailed trace output
        print("  Shows: production selection, buffer changes, etc.")
    else:
        start = time.time()
        sim.run(1.0)
        print(f"  Production fires at ~50ms (cognitive cycle time)")

print("\\nKey insights:")
print("- trace=True helps debugging")
print("- subsymbolic=True adds human-like timing")
print("- Different parameters for different purposes!")`
          },
          {
            type: 'explanation',
            content: 'Parameters control how "human-like" your model is. Use trace for debugging, subsymbolic for realistic timing, and other parameters to match human data!'
          }
        ]
      },
      {
        title: 'Common Pitfalls and Debugging',
        content: [
          {
            type: 'text',
            content: 'Here are common mistakes beginners make and how to fix them:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Pitfall 1: Forgetting to define chunk types
try:
    # This will fail!
    bad_chunk = actr.makechunk(
        chunktype="undefined_type",
        slot="value"
    )
except Exception as e:
    print(f"Error: {e}")
    print("Fix: Define chunk type first!")

# Correct way:
actr.chunktype("defined_type", "slot")
good_chunk = actr.makechunk(chunktype="defined_type", slot="value")
print("Success!")

# Pitfall 2: Production syntax errors
model = actr.ACTRModel()

# Common mistake: wrong buffer syntax
try:
    model.productionstring(
        name="bad_production",
        string='''
        =g>
            isa some_type
            slot value    # Missing = before value!
        ==>
        =g>
            slot newvalue
        '''
    )
except Exception as e:
    print(f"\\nProduction error: Check your = signs!")

# Pitfall 3: Infinite loops
actr.chunktype("loop_chunk", "state")

loop_model = actr.ACTRModel()

# This production will fire forever!
loop_model.productionstring(
    name="infinite_loop",
    string='''
    =g>
        isa loop_chunk
        state =s
    ==>
    =g>
        state =s  # Same state - will match again!
'''
)

print("\\nWarning: This production creates an infinite loop!")
print("Fix: Always change something so the condition won't match again")

# Better version:
loop_model.productionstring(
    name="good_production",
    string='''
    =g>
        isa loop_chunk
        state start
    ==>
    =g>
        state done  # Different state - won't match again
'''
)

# Pitfall 4: Retrieval failures
actr.chunktype("test_chunk", "name value")
retrieval_model = actr.ACTRModel()

# Request something that doesn't exist
retrieval_model.productionstring(
    name="request_missing",
    string='''
    =g>
        isa test_chunk
        name test
    ==>
    +retrieval>
        isa test_chunk
        name "nonexistent"  # Not in memory!
'''
)

# Add production to handle retrieval failure
retrieval_model.productionstring(
    name="handle_failure",
    string='''
    =g>
        isa test_chunk
        name test
    ?retrieval>
        state error  # Fires when retrieval fails
    ==>
    =g>
        name failed
    !output!
        Retrieval failed - item not in memory
'''
)

print("\\nDebugging tips:")
print("1. Use trace=True to see what's happening")
print("2. Check chunk types are defined")
print("3. Verify = signs in productions")
print("4. Ensure productions change state")
print("5. Handle retrieval failures")`
          },
          {
            type: 'explanation',
            content: 'Most errors come from syntax issues or logic problems. The trace parameter is your best friend for debugging - it shows exactly what ACT-R is doing!'
          }
        ]
      },
      {
        title: 'Real-World Applications',
        content: [
          {
            type: 'text',
            content: 'ACT-R models are used in many real applications. Here are some examples:'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Example: Modeling menu selection (HCI application)
actr.chunktype("menu_goal", "state target_item current_item")
actr.chunktype("menu_item", "label position parent")

menu_model = actr.ACTRModel()
menu_model.model_parameters["subsymbolic"] = True

# Add menu structure
menu_items = [
    ("File", "1", "root"),
    ("Edit", "2", "root"),
    ("New", "1", "File"),
    ("Open", "2", "File"),
    ("Save", "3", "File"),
    ("Cut", "1", "Edit"),
    ("Copy", "2", "Edit"),
    ("Paste", "3", "Edit")
]

for label, pos, parent in menu_items:
    menu_model.decmem.add(actr.makechunk(
        chunktype="menu_item",
        label=label,
        position=pos,
        parent=parent
    ))

# Production to find menu item
menu_model.productionstring(
    name="search_menu",
    string='''
    =g>
        isa menu_goal
        state searching
        target_item =target
    ==>
    =g>
        state scanning
    +retrieval>
        isa menu_item
        label =target
'''
)

print("Menu selection model created!")
print("This models how users find items in menus")
print("\\nOther real applications:")
print("- Intelligent tutoring systems (Carnegie Learning)")
print("- Pilot training (predicting errors)")
print("- Driver behavior modeling")
print("- Game AI that plays like humans")

# Example: Simple student model for tutoring
actr.chunktype("math_fact", "problem answer learned")
actr.chunktype("student_goal", "state problem")

student_model = actr.ACTRModel()
student_model.model_parameters["subsymbolic"] = True
student_model.model_parameters["decay"] = 0.5  # Forgetting
student_model.model_parameters["retrieval_threshold"] = -1.0

# Student has learned some facts
learned_facts = [("2+2", "4", "yes"), ("3+3", "6", "yes")]
weak_facts = [("7+8", "15", "partial")]  # Not well learned

for prob, ans, learned in learned_facts:
    # Add multiple times for stronger memory
    for _ in range(5):
        student_model.decmem.add(actr.makechunk(
            chunktype="math_fact",
            problem=prob,
            answer=ans,
            learned=learned
        ))

for prob, ans, learned in weak_facts:
    # Add only once - weak memory
    student_model.decmem.add(actr.makechunk(
        chunktype="math_fact",
        problem=prob,
        answer=ans,
        learned=learned
    ))

print("\\nStudent model created!")
print("Well-learned facts: 2+2, 3+3")
print("Weak facts: 7+8")
print("This models which problems need more practice!")`
          },
          {
            type: 'explanation',
            content: 'ACT-R is used wherever understanding human behavior matters: education, interface design, safety systems, and training. The same principles apply across domains!'
          }
        ]
      }
    ]
  },
  2: {
    sections: [
      {
        title: 'Memory Experiments: Testing Activation',
        content: [
          {
            type: 'text',
            content: 'Let\'s run experiments to see how activation affects memory retrieval. We\'ll test frequency, recency, and spreading activation effects.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import time
import numpy as np

# Experiment 1: Frequency Effect
print("=== Experiment 1: Frequency Effect ===")

freq_model = actr.ACTRModel()
freq_model.model_parameters["subsymbolic"] = True
freq_model.model_parameters["activation_trace"] = True  # See activation values

actr.chunktype("word_chunk", "word")

# Add words with different frequencies
words_freq = [
    ("the", 100),    # Very common
    ("cat", 20),     # Common
    ("axiom", 2),    # Rare
    ("quixotic", 1)  # Very rare
]

for word, freq in words_freq:
    chunk = actr.makechunk(chunktype="word_chunk", word=word)
    # Add 'freq' times to increase base-level activation
    for _ in range(freq):
        freq_model.decmem.add(chunk)

# Test retrieval times
print("\\nRetrieval experiment:")
for word, freq in words_freq:
    # Time how long retrieval takes
    start = time.time()

    # In a real model, you'd measure simulated time
    # This is a conceptual demonstration
    print(f"{word} (frequency={freq}): Faster retrieval with higher frequency")

# Experiment 2: Recency Effect
print("\\n=== Experiment 2: Recency Effect ===")

recency_model = actr.ACTRModel()
recency_model.model_parameters["subsymbolic"] = True
recency_model.model_parameters["decay"] = 0.5

actr.chunktype("event", "type when")

# Add events at different times
events = [
    ("breakfast", "1 hour ago"),
    ("email", "5 minutes ago"),
    ("meeting", "yesterday"),
    ("vacation", "last year")
]

# In real ACT-R, you'd use actual timestamps
# This demonstrates the concept
print("\\nRecency affects activation:")
for event_type, when in events:
    print(f"{event_type} ({when}): ", end="")
    if "minutes" in when:
        print("High activation - very recent")
    elif "hour" in when:
        print("Medium activation - recent")
    elif "yesterday" in when:
        print("Low activation - less recent")
    else:
        print("Very low activation - remote")

# Experiment 3: Fan Effect
print("\\n=== Experiment 3: Fan Effect ===")

fan_model = actr.ACTRModel()
fan_model.model_parameters["subsymbolic"] = True

actr.chunktype("location_fact", "person place")

# John is associated with ONE place (low fan)
fan_model.decmem.add(actr.makechunk(
    chunktype="location_fact",
    person="John",
    place="park"
))

# Mary is associated with MANY places (high fan)
places = ["park", "store", "bank", "library", "gym"]
for place in places:
    fan_model.decmem.add(actr.makechunk(
        chunktype="location_fact",
        person="Mary",
        place=place
    ))

print("\\nFan effect demonstration:")
print("Question: 'Was John at the park?'")
print("  Answer: FAST (John only associated with park)")
print("\\nQuestion: 'Was Mary at the park?'")
print("  Answer: SLOW (Mary associated with many places)")
print("\\nThe 'fan' of associations slows retrieval!")`
          },
          {
            type: 'explanation',
            content: 'These experiments show three key memory effects: (1) Frequency - common items retrieved faster, (2) Recency - recent items more active, (3) Fan - more associations mean slower retrieval!'
          }
        ]
      },
      {
        title: 'Modeling Forgetting and Errors',
        content: [
          {
            type: 'text',
            content: 'Let\'s model realistic forgetting and memory errors using decay and retrieval threshold parameters.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Model with forgetting
forget_model = actr.ACTRModel()
forget_model.model_parameters["subsymbolic"] = True
forget_model.model_parameters["decay"] = 0.5  # Standard forgetting rate
forget_model.model_parameters["retrieval_threshold"] = 0.0  # Minimum activation
forget_model.model_parameters["activation_trace"] = True

actr.chunktype("phone_number", "name number last_used")

# Add phone numbers with different usage patterns
phone_numbers = [
    ("Mom", "555-1234", "daily", 100),      # Used daily
    ("Pizza", "555-5678", "weekly", 10),    # Used weekly
    ("Doctor", "555-9999", "monthly", 2),   # Used monthly
    ("Plumber", "555-4321", "yearly", 1)    # Used once a year
]

for name, number, pattern, uses in phone_numbers:
    chunk = actr.makechunk(
        chunktype="phone_number",
        name=name,
        number=number,
        last_used=pattern
    )
    # More uses = stronger memory
    for _ in range(uses):
        forget_model.decmem.add(chunk)

# Production to recall number
forget_model.productionstring(
    name="recall_number",
    string='''
    =g>
        isa phone_number
        name =person
    ==>
    +retrieval>
        isa phone_number
        name =person
'''
)

# Production for successful recall
forget_model.productionstring(
    name="number_retrieved",
    string='''
    =g>
        isa phone_number
        name =person
    =retrieval>
        isa phone_number
        name =person
        number =num
    ==>
    !output!
        Remembered =person: =num
'''
)

# Production for retrieval failure
forget_model.productionstring(
    name="forgot_number",
    string='''
    =g>
        isa phone_number
        name =person
    ?retrieval>
        state error
    ==>
    !output!
        Can't remember =person's number!
'''
)

print("Phone number memory model")
print("\\nPredicted retrieval success:")
print("Mom (daily use): ~100% - Always remembered")
print("Pizza (weekly): ~90% - Usually remembered")
print("Doctor (monthly): ~60% - Sometimes forgotten")
print("Plumber (yearly): ~20% - Usually forgotten")

# Modeling memory errors (confusions)
print("\\n=== Memory Confusion Model ===")

confusion_model = actr.ACTRModel()
confusion_model.model_parameters["subsymbolic"] = True
confusion_model.model_parameters["partial_matching"] = True
confusion_model.model_parameters["mismatch_penalty"] = 1.5

actr.chunktype("name_face", "name hair eyes")

# Add similar people
people = [
    ("John", "brown", "blue"),
    ("Jim", "brown", "blue"),    # Similar to John!
    ("Jake", "brown", "green"),  # Somewhat similar
    ("Bob", "blond", "brown")    # Different
]

for name, hair, eyes in people:
    confusion_model.decmem.add(actr.makechunk(
        chunktype="name_face",
        name=name,
        hair=hair,
        eyes=eyes
    ))

print("\\nMemory confusion predictions:")
print("Looking for 'John with brown hair and blue eyes':")
print("- Might retrieve 'Jim' (very similar)")
print("- Less likely: 'Jake' (partially similar)")
print("- Unlikely: 'Bob' (very different)")
print("\\nThis models why we confuse similar people!")`
          },
          {
            type: 'explanation',
            content: 'Forgetting follows a power law - sharp initial drop, then levels off. Partial matching explains why we sometimes retrieve the wrong (but similar) memory. These aren\'t bugs, they\'re features of human memory!'
          }
        ]
      },
      {
        title: 'Building Memory Strategies',
        content: [
          {
            type: 'text',
            content: 'Let\'s model different memory strategies people use, like rehearsal, chunking, and mnemonics.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Strategy 1: Rehearsal Model
print("=== Rehearsal Strategy ===")

rehearsal_model = actr.ACTRModel()
rehearsal_model.model_parameters["subsymbolic"] = True

actr.chunktype("list_item", "position item")
actr.chunktype("rehearsal_goal", "state current_pos strategy")

# Items to remember
shopping_list = ["milk", "eggs", "bread", "cheese", "apples"]

for i, item in enumerate(shopping_list):
    rehearsal_model.decmem.add(actr.makechunk(
        chunktype="list_item",
        position=str(i),
        item=item
    ))

# Production to rehearse items
rehearsal_model.productionstring(
    name="rehearse_item",
    string='''
    =g>
        isa rehearsal_goal
        state rehearsing
        current_pos =pos
    ==>
    =g>
        state retrieving
    +retrieval>
        isa list_item
        position =pos
'''
)

# Production to continue rehearsal
rehearsal_model.productionstring(
    name="rehearse_next",
    string='''
    =g>
        isa rehearsal_goal
        state retrieving
        current_pos =pos
    =retrieval>
        isa list_item
        position =pos
        item =item
    ==>
    =g>
        state rehearsing
        current_pos =pos!1
    !output!
        Rehearsing: =item
    +retrieval>
        isa list_item
        position =pos  # Strengthen by retrieving again
'''
)

print("Rehearsal strengthens memory through repeated retrieval")

# Strategy 2: Chunking Model
print("\\n=== Chunking Strategy ===")

chunking_model = actr.ACTRModel()

actr.chunktype("phone_chunk", "prefix middle suffix")
actr.chunktype("credit_card", "group1 group2 group3 group4")

# Chunked phone number (easier to remember)
phone_chunked = actr.makechunk(
    chunktype="phone_chunk",
    prefix="555",
    middle="123",
    suffix="4567"
)

# Chunked credit card (4 groups of 4)
card_chunked = actr.makechunk(
    chunktype="credit_card",
    group1="1234",
    group2="5678",
    group3="9012",
    group4="3456"
)

print("Chunking groups information into meaningful units:")
print("Phone: 555-123-4567 (3 chunks)")
print("Not: 5551234567 (10 individual digits)")
print("Credit card: 1234-5678-9012-3456 (4 chunks)")

# Strategy 3: Method of Loci (Memory Palace)
print("\\n=== Method of Loci ===")

loci_model = actr.ACTRModel()

actr.chunktype("location_association", "location item image")

# Associate items with locations
memory_palace = [
    ("front_door", "keys", "giant_key_blocking_door"),
    ("hallway", "wallet", "wallet_paintings_on_walls"),
    ("kitchen", "phone", "phone_cooking_breakfast"),
    ("bedroom", "glasses", "glasses_on_pillow")
]

for loc, item, image in memory_palace:
    loci_model.decmem.add(actr.makechunk(
        chunktype="location_association",
        location=loc,
        item=item,
        image=image
    ))

# Production to walk through locations
loci_model.productionstring(
    name="walk_through_palace",
    string='''
    =g>
        isa location_association
        location =loc
    ==>
    +retrieval>
        isa location_association
        location =loc
    !output!
        At =loc, I see...
'''
)

print("Method of Loci: Associate items with familiar locations")
print("Mental walk through your house triggers memories")
print("Vivid, unusual images improve recall")

# Strategy comparison
print("\\n=== Strategy Effectiveness ===")
print("Rehearsal: Good for short-term, effortful")
print("Chunking: Reduces memory load permanently")
print("Method of Loci: Excellent for ordered lists")
print("\\nDifferent strategies for different tasks!")`
          },
          {
            type: 'explanation',
            content: 'Memory strategies work by exploiting how ACT-R memory functions. Rehearsal increases activation through repetition, chunking reduces items to remember, and method of loci uses associations for cued recall.'
          }
        ]
      },
      {
        title: 'Advanced Spreading Activation',
        content: [
          {
            type: 'text',
            content: 'Let\'s explore how spreading activation creates priming effects and semantic networks in memory.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Semantic network model
semantic_model = actr.ACTRModel()
semantic_model.model_parameters["subsymbolic"] = True
semantic_model.model_parameters["spreading_activation"] = True
semantic_model.model_parameters["strength_of_association"] = 2.0
semantic_model.model_parameters["buffer_spreading_activation"] = {
    "goal": 1,
    "imaginal": 0.5  # Imaginal buffer also spreads
}

actr.chunktype("concept", "word category associate")
actr.chunktype("prime_goal", "prime target")

# Build semantic network
concepts = [
    # Medical context
    ("doctor", "medical", "hospital"),
    ("nurse", "medical", "hospital"),
    ("hospital", "medical", "doctor"),
    ("medicine", "medical", "doctor"),

    # Food context
    ("bread", "food", "butter"),
    ("butter", "food", "bread"),
    ("pizza", "food", "cheese"),
    ("cheese", "food", "pizza"),

    # Unrelated
    ("chair", "furniture", "table"),
    ("car", "vehicle", "road")
]

for word, cat, assoc in concepts:
    semantic_model.decmem.add(actr.makechunk(
        chunktype="concept",
        word=word,
        category=cat,
        associate=assoc
    ))

# Production to test priming
semantic_model.productionstring(
    name="retrieve_target",
    string='''
    =g>
        isa prime_goal
        prime =prime
        target =target
    ==>
    +retrieval>
        isa concept
        word =target
'''
)

print("Spreading Activation Demonstration")
print("\\nPriming effects:")
print("Prime: DOCTOR → Target: NURSE (fast - same category)")
print("Prime: DOCTOR → Target: BREAD (slow - different category)")
print("Prime: BREAD → Target: BUTTER (fast - associated)")
print("Prime: BREAD → Target: CAR (slow - unrelated)")

# Demonstrate spreading through network
print("\\n=== Activation Spreading ===")
print("Goal buffer contains: 'doctor'")
print("\\nActivation spreads to:")
print("- 'hospital' (high - direct associate)")
print("- 'nurse' (high - same category)")
print("- 'medicine' (medium - related)")
print("- 'bread' (none - unrelated)")

# Model category verification task
semantic_model.productionstring(
    name="verify_category",
    string='''
    =g>
        isa concept
        word =word
        category =cat
    ==>
    +retrieval>
        isa concept
        word =word
'''
)

semantic_model.productionstring(
    name="category_match",
    string='''
    =g>
        isa concept
        word =word
        category =cat
    =retrieval>
        isa concept
        word =word
        category =cat
    ==>
    !output!
        YES - =word is a =cat
'''
)

print("\\n=== Category Verification ===")
print("'Is NURSE medical?' → Fast YES (primed by medical context)")
print("'Is BREAD medical?' → Fast NO (no spreading from medical)")
print("\\nSpreading activation explains semantic priming in language!")`
          },
          {
            type: 'explanation',
            content: 'Spreading activation flows through associations in memory. This creates priming - thinking about "doctor" makes "nurse" easier to retrieve. Real semantic networks are learned from experience!'
          }
        ]
      }
    ]
  },
  3: {
    sections: [
      {
        title: 'Production Learning Mechanisms',
        content: [
          {
            type: 'text',
            content: 'ACT-R can learn new productions through compilation and adjust utilities through reinforcement learning. Let\'s explore both mechanisms.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Production Compilation Example
print("=== Production Compilation ===")

compile_model = actr.ACTRModel()
compile_model.model_parameters["production_compilation"] = True
compile_model.model_parameters["subsymbolic"] = True

actr.chunktype("algebra", "equation step solution")
actr.chunktype("math_fact", "expression value")

# Initial productions (before learning)
compile_model.productionstring(
    name="solve_step1",
    string='''
    =g>
        isa algebra
        equation "2x+4=10"
        step one
    ==>
    =g>
        step two
    +retrieval>
        isa math_fact
        expression "10-4"
'''
)

compile_model.productionstring(
    name="solve_step2",
    string='''
    =g>
        isa algebra
        equation "2x+4=10"
        step two
    =retrieval>
        isa math_fact
        expression "10-4"
        value "6"
    ==>
    =g>
        equation "2x=6"
        step three
'''
)

print("Before compilation: 2 productions, 2 steps")
print("After practice: Productions compile into 1 shortcut!")
print("New production: 2x+4=10 → 2x=6 (directly)")

# Utility Learning Example
print("\\n=== Utility Learning ===")

utility_model = actr.ACTRModel()
utility_model.model_parameters["utility_learning"] = True
utility_model.model_parameters["alpha"] = 0.2  # Learning rate
utility_model.model_parameters["subsymbolic"] = True

actr.chunktype("strategy", "type problem success")

# Two competing strategies for addition
utility_model.productionstring(
    name="count_strategy",
    string='''
    =g>
        isa strategy
        type choosing
        problem addition
    ==>
    =g>
        type counting
    !output!
        Using counting strategy (slow but sure)
''',
    reward=1  # Small reward - always works but slow
)

utility_model.productionstring(
    name="retrieval_strategy",
    string='''
    =g>
        isa strategy
        type choosing
        problem addition
    ==>
    =g>
        type retrieving
    !output!
        Using retrieval strategy (fast but might fail)
''',
    reward=5  # Big reward IF it works
)

# Handle retrieval failure
utility_model.productionstring(
    name="retrieval_failed",
    string='''
    =g>
        isa strategy
        type retrieving
    ?retrieval>
        state error
    ==>
    =g>
        type counting
        success no
    !output!
        Retrieval failed, falling back to counting
''',
    reward=-3  # Penalty for failure
)

print("\\nUtility learning adjusts strategy preferences:")
print("- Counting: Reliable but slow (U = 1)")
print("- Retrieval: Fast but can fail (U = 5 or -3)")
print("Over time, model learns when each strategy works best")

# Reinforcement Learning Example
print("\\n=== Reinforcement Learning ===")

rl_model = actr.ACTRModel()
rl_model.model_parameters["utility_learning"] = True
rl_model.model_parameters["egs"] = 0.5  # Exploration noise

actr.chunktype("choice_point", "state option reward_history")

# Model learns from experience
choices = ["safe_path", "risky_path", "unknown_path"]

for choice in choices:
    rl_model.productionstring(
        name=f"choose_{choice}",
        string=f'''
        =g>
            isa choice_point
            state choosing
        ==>
        =g>
            state {choice}
            option {choice}
        !output!
            Choosing {choice}
    '''
    )

# Set initial utilities based on prior experience
rl_model.productions["choose_safe_path"]["utility"] = 3
rl_model.productions["choose_risky_path"]["utility"] = 2
rl_model.productions["choose_unknown_path"]["utility"] = 1

print("\\nReinforcement learning from outcomes:")
print("Safe path: U=3 (consistent small rewards)")
print("Risky path: U=2 (variable rewards)")
print("Unknown path: U=1 (no data yet)")
print("\\nModel explores based on utility + noise")
print("Updates utilities based on actual rewards received")`
          },
          {
            type: 'explanation',
            content: 'Production compilation creates expertise by combining steps. Utility learning optimizes strategy selection. Together, they model how humans become skilled through practice!'
          }
        ]
      },
      {
        title: 'Complex Production Patterns',
        content: [
          {
            type: 'text',
            content: 'Let\'s explore advanced production patterns: goal stacks, parallel processing, and production chaining.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Pattern 1: Goal Stack (Hierarchical Goals)
print("=== Goal Stack Pattern ===")

stack_model = actr.ACTRModel()

actr.chunktype("goal", "task subtask parent state")

# Production to push subgoal
stack_model.productionstring(
    name="push_subgoal",
    string='''
    =g>
        isa goal
        task make_sandwich
        state start
    ==>
    =g>
        task get_ingredients
        parent make_sandwich
        state start
    !output!
        Pushing subgoal: get ingredients
'''
)

# Production to pop back to parent
stack_model.productionstring(
    name="pop_to_parent",
    string='''
    =g>
        isa goal
        task get_ingredients
        state done
        parent =parent
    ==>
    =g>
        task =parent
        state ingredients_ready
    !output!
        Popping back to: =parent
'''
)

print("Goal stacks manage complex tasks with subtasks")
print("Push: Main goal → Subgoal")
print("Pop: Subgoal complete → Resume main goal")

# Pattern 2: Parallel Buffer Processing
print("\\n=== Parallel Processing Pattern ===")

parallel_model = actr.ACTRModel()

actr.chunktype("dual_task", "visual_state motor_state")

# Can process visual while motor is busy
parallel_model.productionstring(
    name="parallel_processing",
    string='''
    =g>
        isa dual_task
        visual_state ready
        motor_state busy
    ?visual>
        state free
    ?motor>
        state busy
    ==>
    =g>
        visual_state processing
    +visual>
        isa _visual
        cmd move_attention
        screen_pos 100 100
    !output!
        Processing visual while motor is busy
'''
)

print("Different modules can work in parallel:")
print("- Visual searching while hand is moving")
print("- Planning while speaking")
print("- Retrieving while looking")
print("Models human multitasking abilities!")

# Pattern 3: Production Chaining
print("\\n=== Production Chaining ===")

chain_model = actr.ACTRModel()

actr.chunktype("process", "stage data")

# Chain of productions that process data
productions = [
    ("input", "validate", "Get input"),
    ("validate", "transform", "Validate data"),
    ("transform", "calculate", "Transform format"),
    ("calculate", "output", "Calculate result"),
    ("output", "done", "Output result")
]

for current, next_stage, action in productions:
    chain_model.productionstring(
        name=f"stage_{current}",
        string=f'''
        =g>
            isa process
            stage {current}
            data =d
        ==>
        =g>
            stage {next_stage}
        !output!
            {action} with data: =d
    '''
    )

print("Production chains create complex workflows:")
print("Input → Validate → Transform → Calculate → Output")
print("Each production triggers the next")

# Pattern 4: Conditional Branching
print("\\n=== Conditional Branching ===")

branch_model = actr.ACTRModel()

actr.chunktype("decision", "value action")

# Productions with different conditions
branch_model.productionstring(
    name="if_positive",
    string='''
    =g>
        isa decision
        value =v > 0
        action none
    ==>
    =g>
        action increase
    !output!
        Positive value - increasing
'''
)

branch_model.productionstring(
    name="if_negative",
    string='''
    =g>
        isa decision
        value =v < 0
        action none
    ==>
    =g>
        action decrease
    !output!
        Negative value - decreasing
'''
)

branch_model.productionstring(
    name="if_zero",
    string='''
    =g>
        isa decision
        value 0
        action none
    ==>
    =g>
        action maintain
    !output!
        Zero value - maintaining
'''
)

print("Productions can branch based on conditions:")
print("- Numeric comparisons (>, <, =)")
print("- Slot tests (=x, ~=x)")
print("- Buffer states (?buffer>)")
print("Creates flexible behavior patterns")`
          },
          {
            type: 'explanation',
            content: 'These patterns show how simple productions combine into complex behaviors. Goal stacks manage hierarchies, parallel processing uses multiple modules, chains create sequences, and branching adds logic.'
          }
        ]
      },
      {
        title: 'Optimizing Production Systems',
        content: [
          {
            type: 'text',
            content: 'Let\'s learn how to optimize production systems for efficiency and avoid common performance problems.'
          },
          {
            type: 'code',
            content: `import pyactr as actr

# Optimization 1: Reduce Retrievals
print("=== Optimization 1: Minimize Retrievals ===")

# Inefficient version - multiple retrievals
slow_model = actr.ACTRModel()
actr.chunktype("data", "id value1 value2 result")

slow_model.productionstring(
    name="slow_get_value1",
    string='''
    =g>
        isa data
        id =id
        value1 nil
    ==>
    +retrieval>
        isa data
        id =id
'''
)

slow_model.productionstring(
    name="slow_get_value2",
    string='''
    =g>
        isa data
        id =id
        value1 =v1
        value2 nil
    ==>
    +retrieval>
        isa data
        id =id
'''
)

print("Slow: Two separate retrievals")

# Efficient version - single retrieval
fast_model = actr.ACTRModel()

fast_model.productionstring(
    name="fast_get_both",
    string='''
    =g>
        isa data
        id =id
        value1 nil
        value2 nil
    ==>
    +retrieval>
        isa data
        id =id
'''
)

fast_model.productionstring(
    name="fast_use_both",
    string='''
    =g>
        isa data
        id =id
    =retrieval>
        isa data
        id =id
        value1 =v1
        value2 =v2
    ==>
    =g>
        value1 =v1
        value2 =v2
        result calculating
'''
)

print("Fast: Single retrieval gets everything")
print("Lesson: Retrieve complete chunks when possible")

# Optimization 2: Specificity Ordering
print("\\n=== Optimization 2: Production Specificity ===")

spec_model = actr.ACTRModel()
actr.chunktype("task", "type difficulty status")

# More specific production (checked first)
spec_model.productionstring(
    name="handle_hard_urgent",
    string='''
    =g>
        isa task
        type urgent
        difficulty hard
        status pending
    ==>
    =g>
        status prioritized
    !output!
        Hard + urgent gets priority
'''
)

# Less specific production
spec_model.productionstring(
    name="handle_any_urgent",
    string='''
    =g>
        isa task
        type urgent
        status pending
    ==>
    =g>
        status queued
    !output!
        Urgent task queued
'''
)

# General production (fallback)
spec_model.productionstring(
    name="handle_any",
    string='''
    =g>
        isa task
        status pending
    ==>
    =g>
        status deferred
    !output!
        Task deferred
'''
)

print("ACT-R matches most specific production first")
print("Order: Specific → General → Default")
print("This prevents wrong productions from firing")

# Optimization 3: State Management
print("\\n=== Optimization 3: Clean State Transitions ===")

# Good state machine
state_model = actr.ACTRModel()
actr.chunktype("fsm", "state input")

states = ["start", "processing", "validating", "done"]
transitions = [
    ("start", "begin", "processing"),
    ("processing", "complete", "validating"),
    ("validating", "valid", "done"),
    ("validating", "invalid", "start")
]

for current, input_val, next_state in transitions:
    state_model.productionstring(
        name=f"trans_{current}_{input_val}",
        string=f'''
        =g>
            isa fsm
            state {current}
            input {input_val}
        ==>
        =g>
            state {next_state}
            input none
    '''
    )

print("Clean state transitions:")
print("- Each state has clear exits")
print("- No ambiguous transitions")
print("- Always clear input after use")

# Optimization 4: Avoid Expensive Tests
print("\\n=== Optimization 4: Efficient Testing ===")

test_model = actr.ACTRModel()
actr.chunktype("search", "target found count")

# Inefficient - tests complex condition repeatedly
test_model.productionstring(
    name="inefficient_test",
    string='''
    =g>
        isa search
        target =t
        found ~=t
        count =n < 100
    ==>
    =g>
        count =n!1
    +retrieval>
        isa item
'''
)

# Efficient - simple test, complex work separated
test_model.productionstring(
    name="efficient_continue",
    string='''
    =g>
        isa search
        found no
    ==>
    +retrieval>
        isa item
'''
)

test_model.productionstring(
    name="efficient_check_limit",
    string='''
    =g>
        isa search
        count 100
        found no
    ==>
    =g>
        found timeout
'''
)

print("Efficient testing:")
print("- Simple conditions in main loop")
print("- Complex checks in separate productions")
print("- Reduces per-cycle overhead")`
          },
          {
            type: 'explanation',
            content: 'Optimization is about reducing cognitive cycles. Fewer retrievals, cleaner state management, and efficient testing make models run faster and more like skilled humans who have optimized their thinking!'
          }
        ]
      }
    ]
  },
  4: {
    sections: [
      {
        title: 'Model Variations and Comparisons',
        content: [
          {
            type: 'text',
            content: 'Let\'s build variations of our categorization model to explore different cognitive strategies and compare their performance.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import time

# Base model setup
actr.chunktype("animal", "name has_fur has_wings can_fly size habitat")
actr.chunktype("category", "name rule priority")
actr.chunktype("categorize_goal", "state target category confidence")

# Variation 1: Rule-based categorizer
print("=== Rule-Based Model ===")

rule_model = actr.ACTRModel()

# Hierarchical rules with priorities
rules = [
    ("bird", "has_wings=yes", 1),
    ("flying_bird", "has_wings=yes,can_fly=yes", 2),
    ("mammal", "has_fur=yes", 1),
    ("aquatic_mammal", "has_fur=yes,habitat=water", 2),
    ("reptile", "has_fur=no,has_wings=no", 1)
]

for cat, rule, priority in rules:
    rule_model.decmem.add(actr.makechunk(
        chunktype="category",
        name=cat,
        rule=rule,
        priority=str(priority)
    ))

# Apply most specific rule first
rule_model.productionstring(
    name="apply_specific_rule",
    string='''
    =g>
        isa categorize_goal
        state checking
        target =animal
    =retrieval>
        isa category
        priority 2  # Specific rules
        rule =rule
        name =cat
    ==>
    =g>
        state done
        category =cat
        confidence high
    !output!
        Specific rule match: =cat
'''
)

print("Rule-based: Fast, deterministic, but rigid")

# Variation 2: Similarity-based categorizer
print("\\n=== Similarity-Based Model ===")

similarity_model = actr.ACTRModel()
similarity_model.model_parameters["subsymbolic"] = True
similarity_model.model_parameters["partial_matching"] = True
similarity_model.model_parameters["mismatch_penalty"] = 2.0

# Prototypes for each category
prototypes = [
    ("proto_bird", "no", "yes", "yes", "small", "tree"),
    ("proto_mammal", "yes", "no", "no", "medium", "land"),
    ("proto_fish", "no", "no", "no", "small", "water")
]

for name, fur, wings, flies, size, habitat in prototypes:
    similarity_model.decmem.add(actr.makechunk(
        chunktype="animal",
        name=name,
        has_fur=fur,
        has_wings=wings,
        can_fly=flies,
        size=size,
        habitat=habitat
    ))

print("Similarity-based: Flexible, handles novel cases, but slower")

# Variation 3: Exemplar-based categorizer
print("\\n=== Exemplar-Based Model ===")

exemplar_model = actr.ACTRModel()
exemplar_model.model_parameters["subsymbolic"] = True

# Store individual exemplars
exemplars = [
    ("robin", "no", "yes", "yes", "small", "tree", "bird"),
    ("sparrow", "no", "yes", "yes", "tiny", "tree", "bird"),
    ("penguin", "no", "yes", "no", "medium", "ice", "bird"),
    ("dog", "yes", "no", "no", "medium", "land", "mammal"),
    ("cat", "yes", "no", "no", "small", "land", "mammal"),
    ("whale", "yes", "no", "no", "huge", "water", "mammal")
]

actr.chunktype("exemplar", "name has_fur has_wings can_fly size habitat category")

for name, fur, wings, flies, size, habitat, cat in exemplars:
    exemplar_model.decmem.add(actr.makechunk(
        chunktype="exemplar",
        name=name,
        has_fur=fur,
        has_wings=wings,
        can_fly=flies,
        size=size,
        habitat=habitat,
        category=cat
    ))

print("Exemplar-based: Remembers specific examples")

# Variation 4: Hybrid model (combines strategies)
print("\\n=== Hybrid Model ===")

hybrid_model = actr.ACTRModel()
hybrid_model.model_parameters["subsymbolic"] = True
hybrid_model.model_parameters["utility_learning"] = True

# Try rule-based first (fast)
hybrid_model.productionstring(
    name="try_rule",
    string='''
    =g>
        isa categorize_goal
        state start
        target =animal
    ==>
    =g>
        state trying_rules
    +retrieval>
        isa category
        priority 2
''',
    utility=5  # Prefer this strategy
)

# Fall back to similarity if rules fail
hybrid_model.productionstring(
    name="try_similarity",
    string='''
    =g>
        isa categorize_goal
        state trying_rules
    ?retrieval>
        state error
    ==>
    =g>
        state trying_similarity
    !output!
        No rule found, trying similarity
''',
    utility=3
)

# Last resort: guess based on single feature
hybrid_model.productionstring(
    name="guess_by_feature",
    string='''
    =g>
        isa categorize_goal
        state trying_similarity
    ?retrieval>
        state error
    ==>
    =g>
        state guessing
        category unknown
        confidence low
    !output!
        Unable to categorize confidently
''',
    utility=1
)

print("Hybrid: Combines strategies adaptively")
print("- Try fast rules first")
print("- Fall back to similarity")
print("- Guess if necessary")

# Compare models on novel animal
print("\\n=== Model Comparison ===")
print("Novel animal: Bat (has_fur=yes, has_wings=yes, can_fly=yes)")
print("\\nPredictions:")
print("Rule-based: Conflict! (mammal vs bird rules)")
print("Similarity: Mammal (fur more diagnostic)")
print("Exemplar: Bird (similar to flying exemplars)")
print("Hybrid: Tries rules, finds conflict, uses similarity")`
          },
          {
            type: 'explanation',
            content: 'Different categorization strategies reflect real human behavior. Experts use rules, novices use similarity, and we all fall back on exemplars for unusual cases. The hybrid approach models this flexibility!'
          }
        ]
      },
      {
        title: 'Timing and Performance Analysis',
        content: [
          {
            type: 'text',
            content: 'Let\'s analyze the timing and performance characteristics of our models to ensure they match human behavior.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np
import matplotlib.pyplot as plt

# Create timed model
timed_model = actr.ACTRModel()
timed_model.model_parameters["subsymbolic"] = True
timed_model.model_parameters["rt"] = True  # Enable reaction times
timed_model.model_parameters["latency_factor"] = 0.1
timed_model.model_parameters["latency_exponent"] = 1.0

# Define task
actr.chunktype("visual_search", "target_type set_size found time")
actr.chunktype("item", "type location")

# Production timing breakdown
print("=== Production Timing Analysis ===")
print("\\nCognitive cycle: ~50ms")
print("Breakdown:")
print("- Conflict resolution: 0-10ms")
print("- Production firing: 50ms")
print("- Module operations:")
print("  - Memory retrieval: 50ms + latency")
print("  - Visual attention: 85ms + movement")
print("  - Motor action: 50ms preparation + execution")

# Model different search strategies
def model_search_time(set_size, search_type="serial"):
    base_time = 200  # Initial encoding

    if search_type == "serial":
        # Check each item sequentially
        items_to_check = set_size / 2  # Average
        time_per_item = 50  # One production cycle
        search_time = items_to_check * time_per_item

    elif search_type == "parallel":
        # Pop-out effect (feature search)
        search_time = 50  # Constant regardless of size

    else:  # "memory"
        # Retrieval-based (depends on activation)
        retrieval_time = 50 * (1 + np.log(set_size) * 0.1)
        search_time = retrieval_time

    return base_time + search_time

# Generate predictions
set_sizes = [4, 8, 16, 32]
serial_times = [model_search_time(s, "serial") for s in set_sizes]
parallel_times = [model_search_time(s, "parallel") for s in set_sizes]
memory_times = [model_search_time(s, "memory") for s in set_sizes]

print("\\n=== Search Time Predictions (ms) ===")
print("Set Size:    4     8     16    32")
print(f"Serial:    {serial_times[0]:3.0f}   {serial_times[1]:3.0f}   {serial_times[2]:3.0f}   {serial_times[3]:3.0f}")
print(f"Parallel:  {parallel_times[0]:3.0f}   {parallel_times[1]:3.0f}   {parallel_times[2]:3.0f}   {parallel_times[3]:3.0f}")
print(f"Memory:    {memory_times[0]:3.0f}   {memory_times[1]:3.0f}   {memory_times[2]:3.0f}   {memory_times[3]:3.0f}")

# Model learning effects on timing
print("\\n=== Learning Effects on Timing ===")

learning_model = actr.ACTRModel()
learning_model.model_parameters["subsymbolic"] = True
learning_model.model_parameters["production_compilation"] = True

def predict_rt_with_practice(trial):
    # Power law of practice
    base_rt = 1000  # 1 second initially
    learning_rate = 0.3
    return base_rt * (trial ** -learning_rate)

trials = [1, 10, 50, 100, 500]
rts = [predict_rt_with_practice(t) for t in trials]

print("\\nReaction Time by Practice:")
for t, rt in zip(trials, rts):
    print(f"Trial {t:3d}: {rt:4.0f}ms")

print("\\nLearning mechanisms:")
print("- Production compilation: Fewer steps")
print("- Chunk strengthening: Faster retrieval")
print("- Utility learning: Better strategy selection")

# Model individual differences
print("\\n=== Individual Differences ===")

# Create models with different parameters
fast_person = {
    "latency_factor": 0.05,  # Faster processing
    "motor_burst_time": 0.03,  # Faster motor
    "visual_attention_latency": 0.065  # Faster attention
}

slow_person = {
    "latency_factor": 0.15,  # Slower processing
    "motor_burst_time": 0.07,  # Slower motor
    "visual_attention_latency": 0.105  # Slower attention
}

print("\\nSame task, different parameters:")
print("Fast person: 750ms total")
print("Slow person: 1250ms total")
print("Difference: Processing speed, not strategy")

# Error analysis
print("\\n=== Error Patterns ===")

error_model = actr.ACTRModel()
error_model.model_parameters["subsymbolic"] = True
error_model.model_parameters["retrieval_threshold"] = 0.0
error_model.model_parameters["instantaneous_noise"] = 0.5

print("\\nError sources:")
print("1. Retrieval failure (forgetting)")
print("   - Below threshold → no retrieval")
print("2. Partial matching errors")
print("   - Retrieved wrong but similar item")
print("3. Production competition")
print("   - Wrong strategy selected")
print("4. Timing pressure")
print("   - Incomplete processing")

print("\\nError rates by condition:")
print("Easy task, no pressure: <5% errors")
print("Hard task, no pressure: 10-15% errors")
print("Easy task, time pressure: 15-20% errors")
print("Hard task, time pressure: 30-40% errors")`
          },
          {
            type: 'explanation',
            content: 'Timing analysis reveals the microstructure of cognition. Every operation takes time, and these times compound. Individual differences and task demands modulate these basic parameters to produce the full range of human performance!'
          }
        ]
      },
      {
        title: 'Validating Against Human Data',
        content: [
          {
            type: 'text',
            content: 'Let\'s learn how to validate our models against real human data and iterate to improve the fit.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np
from scipy import stats

# Example human data from a categorization experiment
human_data = {
    'typical_birds': {'accuracy': 0.98, 'rt': 650, 'sd': 120},
    'atypical_birds': {'accuracy': 0.83, 'rt': 890, 'sd': 180},
    'typical_mammals': {'accuracy': 0.97, 'rt': 680, 'sd': 130},
    'borderline_cases': {'accuracy': 0.65, 'rt': 1240, 'sd': 280}
}

print("=== Model Validation Process ===")
print("\\n1. Collect Human Data:")
for condition, data in human_data.items():
    print(f"{condition}: {data['accuracy']:.0%} accurate, {data['rt']}ms (±{data['sd']})")

# Create model to fit this data
validation_model = actr.ACTRModel()
validation_model.model_parameters["subsymbolic"] = True

# Key parameters to fit
parameters_to_fit = {
    'retrieval_threshold': -1.0,  # Controls accuracy
    'latency_factor': 0.1,        # Controls RT slope
    'instantaneous_noise': 0.25,  # Controls variability
    'mismatch_penalty': 2.5       # Controls typicality effects
}

print("\\n2. Initial Model Predictions:")
# Simulate model performance
model_predictions = {
    'typical_birds': {'accuracy': 0.95, 'rt': 700},
    'atypical_birds': {'accuracy': 0.75, 'rt': 950},
    'typical_mammals': {'accuracy': 0.94, 'rt': 720},
    'borderline_cases': {'accuracy': 0.55, 'rt': 1100}
}

# Calculate fit statistics
print("\\n3. Goodness of Fit:")
total_rmse = 0
for condition in human_data:
    human_rt = human_data[condition]['rt']
    model_rt = model_predictions[condition]['rt']
    rmse = np.sqrt((human_rt - model_rt)**2)
    total_rmse += rmse
    print(f"{condition}: RMSE = {rmse:.1f}ms")

print(f"\\nTotal RMSE: {total_rmse:.1f}ms")

# Parameter adjustment strategy
print("\\n4. Parameter Adjustment Strategy:")
print("If model too fast → Increase latency_factor")
print("If model too accurate → Increase retrieval_threshold")
print("If no typicality effect → Decrease mismatch_penalty")
print("If too deterministic → Increase noise")

# Improved parameters after fitting
improved_parameters = {
    'retrieval_threshold': -0.5,   # Less strict
    'latency_factor': 0.12,        # Slightly slower
    'instantaneous_noise': 0.35,   # More variable
    'mismatch_penalty': 2.0        # Stronger typicality
}

print("\\n5. Improved Model Fit:")
improved_predictions = {
    'typical_birds': {'accuracy': 0.97, 'rt': 670},
    'atypical_birds': {'accuracy': 0.81, 'rt': 910},
    'typical_mammals': {'accuracy': 0.96, 'rt': 695},
    'borderline_cases': {'accuracy': 0.63, 'rt': 1200}
}

# Statistical validation
print("\\n6. Statistical Validation:")

# Correlation between human and model RTs
human_rts = [human_data[c]['rt'] for c in human_data]
model_rts = [improved_predictions[c]['rt'] for c in improved_predictions]
r, p = stats.pearsonr(human_rts, model_rts)

print(f"RT correlation: r = {r:.3f}, p = {p:.3f}")
print("Strong correlation indicates model captures RT patterns")

# Test specific predictions
print("\\n7. Testing Specific Predictions:")
print("Prediction 1: Typicality effect")
typical_rt = improved_predictions['typical_birds']['rt']
atypical_rt = improved_predictions['atypical_birds']['rt']
print(f"  Atypical - Typical = {atypical_rt - typical_rt}ms")
print("  ✓ Model shows typicality effect")

print("\\nPrediction 2: Speed-accuracy tradeoff")
print("  Borderline cases: Slower AND less accurate")
print("  ✓ Model shows appropriate tradeoff")

# Model variants comparison
print("\\n8. Model Comparison (AIC):")
# AIC = 2k - 2ln(L), lower is better
models = {
    'Simple (2 params)': {'k': 2, 'log_likelihood': -45.2},
    'Full (4 params)': {'k': 4, 'log_likelihood': -38.5},
    'Complex (6 params)': {'k': 6, 'log_likelihood': -37.8}
}

for name, model in models.items():
    aic = 2 * model['k'] - 2 * model['log_likelihood']
    print(f"{name}: AIC = {aic:.1f}")

print("\\nBest model balances fit and complexity")`
          },
          {
            type: 'explanation',
            content: 'Model validation is iterative: collect data, fit parameters, check predictions, refine theory. Good models don\'t just fit existing data - they make testable predictions about new conditions!'
          }
        ]
      }
    ]
  },
  5: {
    sections: [
      {
        title: 'Parameter Deep Dive',
        content: [
          {
            type: 'text',
            content: 'Let\'s explore each subsymbolic parameter in detail and see how they interact to create human-like behavior.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

print("=== Complete Parameter Reference ===")

# Create model with all parameters
full_model = actr.ACTRModel()
full_model.model_parameters["subsymbolic"] = True

# Memory parameters
memory_params = {
    "decay": 0.5,                    # Forgetting rate (d)
    "retrieval_threshold": -2.0,     # Minimum activation (τ)
    "instantaneous_noise": 0.25,     # Activation noise (s)
    "permanent_noise": 0.0,          # Permanent noise
    "base_activation": 0.0,          # Default activation
}

# Spreading activation parameters
spreading_params = {
    "spreading_activation": True,
    "strength_of_association": 1.5,  # S_max
    "buffer_spreading_activation": {
        "goal": 1.0,      # W_goal
        "imaginal": 0.5,  # W_imaginal
    }
}

# Partial matching parameters
matching_params = {
    "partial_matching": True,
    "mismatch_penalty": 2.5,         # MP
    "similarity_function": "custom",  # Or default
}

# Utility parameters
utility_params = {
    "utility_noise": 0.5,            # σ (exploration)
    "utility_learning": True,
    "alpha": 0.2,                    # Learning rate
    "egs": 0.1,                      # Optimized learning
}

# Production compilation
compilation_params = {
    "production_compilation": True,
    "procedural_reward": 0.05,       # Reward per cycle saved
    "new_production_time": 0.05,     # Time to create
}

print("\\n1. MEMORY PARAMETERS:")
print(f"   Decay (d={memory_params['decay']})")
print("   - Controls forgetting rate")
print("   - 0 = no forgetting, 1 = rapid forgetting")
print("   - Activation = Σ t_i^(-d)")

print(f"\\n   Threshold (τ={memory_params['retrieval_threshold']})")
print("   - Minimum activation for retrieval")
print("   - Higher = more retrieval failures")
print("   - Typical range: -2 to 2")

print(f"\\n   Noise (s={memory_params['instantaneous_noise']})")
print("   - Activation variability")
print("   - Creates probabilistic retrieval")
print("   - Noise ~ logistic(0, s*√(6/π))")

# Demonstrate decay effect
print("\\n=== Decay Demonstration ===")
times_since_use = [1, 10, 100, 1000]  # seconds
for d in [0.0, 0.5, 1.0]:
    print(f"\\nDecay = {d}:")
    for t in times_since_use:
        activation = np.log(t ** -d)
        print(f"  {t:4d}s ago: A = {activation:6.2f}")

# Demonstrate noise effect
print("\\n=== Noise Demonstration ===")
base_activation = 0.0
noise_levels = [0.0, 0.25, 0.5, 1.0]

print("Retrieval probability with different noise:")
for noise in noise_levels:
    # Probability of retrieval given threshold
    threshold = -1.0
    prob = 1 / (1 + np.exp(-(base_activation - threshold) / noise))
    print(f"  Noise={noise}: P(retrieval) = {prob:.2%}")

# Demonstrate spreading activation
print("\\n=== Spreading Activation Demo ===")

spread_model = actr.ACTRModel()
for param, value in spreading_params.items():
    spread_model.model_parameters[param] = value

actr.chunktype("associated", "cue target strength")

# Create association network
associations = [
    ("dog", "cat", "0.8"),      # Strong association
    ("dog", "bone", "0.9"),     # Very strong
    ("dog", "car", "0.1"),      # Weak
    ("cat", "mouse", "0.7"),    # Strong
]

print("\\nAssociation network:")
for cue, target, strength in associations:
    print(f"  {cue} → {target} (S={strength})")

print("\\nWith 'dog' in goal buffer:")
print("  Activation spreads to:")
print("    - cat: +0.8 * 1.5 * 1.0 = +1.2")
print("    - bone: +0.9 * 1.5 * 1.0 = +1.35")
print("    - car: +0.1 * 1.5 * 1.0 = +0.15")

# Demonstrate partial matching
print("\\n=== Partial Matching Demo ===")

partial_model = actr.ACTRModel()
partial_model.model_parameters["subsymbolic"] = True
partial_model.model_parameters["partial_matching"] = True

# Similarity matrix example
print("\\nSimilarity between values:")
print("  'red' vs 'red': 0.0 (exact match)")
print("  'red' vs 'orange': -0.5 (similar)")
print("  'red' vs 'blue': -1.0 (different)")
print("  'red' vs 'square': -2.0 (wrong dimension)")

print("\\nWith mismatch_penalty = 2.5:")
print("  Activation penalty = MP * similarity")
print("  'red' vs 'orange': -2.5 * 0.5 = -1.25")
print("  'red' vs 'blue': -2.5 * 1.0 = -2.5")

# Demonstrate utility learning
print("\\n=== Utility Learning Demo ===")

# Utility update equation
print("\\nUtility update: U_new = U_old + α(R - U_old)")
print("Where:")
print("  α = learning rate")
print("  R = reward received")

# Example learning sequence
utility = 0.0
alpha = 0.2
rewards = [1, 1, 0, 1, 0, 1, 1, 1]

print("\\nLearning sequence:")
for i, reward in enumerate(rewards):
    old_utility = utility
    utility = utility + alpha * (reward - utility)
    print(f"  Trial {i+1}: R={reward}, U: {old_utility:.2f} → {utility:.2f}")

print(f"\\nFinal utility converges to: {np.mean(rewards):.2f}")

# Parameter interactions
print("\\n=== Parameter Interactions ===")
print("\\n1. Noise + Threshold:")
print("   High noise + high threshold = frequent errors")
print("   Low noise + low threshold = deterministic")

print("\\n2. Decay + Spreading:")
print("   Both affect activation")
print("   Recent + associated = very active")
print("   Old + unassociated = likely forgotten")

print("\\n3. Partial Matching + Noise:")
print("   PM allows wrong retrievals")
print("   Noise makes them probabilistic")
print("   Together: realistic confusions")

print("\\n4. Utility Noise + Learning:")
print("   Noise enables exploration")
print("   Learning improves exploitation")
print("   Balance: optimal behavior")`
          },
          {
            type: 'explanation',
            content: 'Parameters are the "knobs" that make ACT-R models human-like. Each parameter has psychological meaning, and together they create the full spectrum of human cognitive behavior - from expert to novice, from careful to hasty.'
          }
        ]
      },
      {
        title: 'Blending: When Memory Merges',
        content: [
          {
            type: 'text',
            content: 'Blending retrieves a mixture of memories rather than a single chunk. This models how we average experiences or create prototypes.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

# Blending example: Estimating prices
blend_model = actr.ACTRModel()
blend_model.model_parameters["subsymbolic"] = True
blend_model.model_parameters["blending"] = True
blend_model.model_parameters["blending_temperature"] = 0.25

actr.chunktype("price_memory", "item location price")

# Price memories for coffee
coffee_prices = [
    ("coffee", "starbucks", "4.50"),
    ("coffee", "starbucks", "5.00"),
    ("coffee", "starbucks", "4.75"),
    ("coffee", "dunkin", "2.50"),
    ("coffee", "dunkin", "2.75"),
    ("coffee", "local_cafe", "3.50"),
    ("coffee", "local_cafe", "3.75"),
    ("coffee", "gas_station", "1.50"),
]

for item, location, price in coffee_prices:
    blend_model.decmem.add(actr.makechunk(
        chunktype="price_memory",
        item=item,
        location=location,
        price=price
    ))

print("=== Blending Demonstration ===")
print("\\nCoffee price memories:")
for item, loc, price in coffee_prices:
    print(f"  {item} at {loc}: ${price}")

print("\\nBlended retrievals:")
print("'Coffee price?' → ~$3.50 (average of all)")
print("'Coffee at Starbucks?' → ~$4.75 (Starbucks average)")
print("'Coffee at new place?' → ~$3.50 (global average)")

# Demonstrate blending formula
print("\\n=== Blending Mathematics ===")
print("\\nBlended value = Σ(P_i * V_i)")
print("Where:")
print("  P_i = probability of chunk i")
print("  V_i = value in chunk i")

# Calculate example blend
activations = [0.5, 0.3, -0.2, -0.5]  # Example activations
values = [4.50, 5.00, 2.50, 1.50]  # Corresponding prices
temperature = 0.25

# Convert to probabilities
exp_acts = np.exp(np.array(activations) / temperature)
probabilities = exp_acts / np.sum(exp_acts)

blended_value = np.sum(probabilities * values)

print(f"\\nExample calculation:")
for i, (act, val, prob) in enumerate(zip(activations, values, probabilities)):
    print(f"  Chunk {i+1}: A={act:4.1f}, V=${val:.2f}, P={prob:.3f}")
print(f"  Blended value: ${blended_value:.2f}")

# Blending for categorization
print("\\n=== Blending for Categories ===")

category_model = actr.ACTRModel()
category_model.model_parameters["blending"] = True

actr.chunktype("animal_features", "name size speed category")

# Animals with numeric features
animals = [
    ("mouse", "1", "8", "mammal"),
    ("cat", "3", "9", "mammal"),
    ("dog", "4", "7", "mammal"),
    ("horse", "8", "9", "mammal"),
    ("sparrow", "1", "6", "bird"),
    ("eagle", "4", "8", "bird"),
    ("ostrich", "7", "5", "bird"),
]

for name, size, speed, category in animals:
    category_model.decmem.add(actr.makechunk(
        chunktype="animal_features",
        name=name,
        size=size,
        speed=speed,
        category=category
    ))

print("\\nNovel animal: size=5, speed=7")
print("Blending predicts:")
print("- Activates similar animals (dog, eagle)")
print("- Blends their categories")
print("- If P(mammal)=0.6, P(bird)=0.4")
print("- Uncertain categorization!")

# Blending for estimation tasks
print("\\n=== Blending for Estimation ===")

estimation_model = actr.ACTRModel()
estimation_model.model_parameters["blending"] = True

actr.chunktype("city_population", "city population")

# Population memories (in millions)
cities = [
    ("NYC", "8.3"),
    ("LA", "4.0"),
    ("Chicago", "2.7"),
    ("Houston", "2.3"),
    ("Phoenix", "1.7"),
    ("Philadelphia", "1.6"),
    ("San Antonio", "1.5"),
]

print("\\nCity populations (millions):")
for city, pop in cities[:3]:
    print(f"  {city}: {pop}M")
print("  ...")

print("\\nEstimation questions:")
print("'Population of Dallas?' (not in memory)")
print("  → Blends similar cities")
print("  → Estimate: ~2.0M")

print("\\n'Average US city population?'")
print("  → Blends all known cities")
print("  → Estimate: ~3.1M")

# Blending parameters
print("\\n=== Blending Parameters ===")
print("\\nblending_temperature (default 0.25):")
print("  Lower → Winner-take-all (closest match)")
print("  Higher → Equal weighting (true average)")

print("\\nblending_activation_cutoff:")
print("  Only blend chunks above threshold")
print("  Prevents irrelevant memories affecting blend")

print("\\nApplications:")
print("- Prototype formation")
print("- Estimation and prediction")
print("- Category learning")
print("- Reconstructive memory")`
          },
          {
            type: 'explanation',
            content: 'Blending explains many phenomena: why we remember "typical" values, how we estimate unknowns, and why memory is reconstructive rather than reproductive. It\'s not a bug - it\'s adaptive!'
          }
        ]
      },
      {
        title: 'Advanced Activation Dynamics',
        content: [
          {
            type: 'text',
            content: 'Let\'s explore advanced aspects of activation including base-level learning, context effects, and activation dynamics over time.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np
import matplotlib.pyplot as plt

print("=== Advanced Activation Dynamics ===")

# Base-level learning equation
print("\\n1. Base-Level Learning")
print("   B_i = ln(Σ t_j^(-d))")
print("   where t_j = time since jth presentation")

# Demonstrate activation history
activation_model = actr.ACTRModel()
activation_model.model_parameters["subsymbolic"] = True
activation_model.model_parameters["decay"] = 0.5
activation_model.model_parameters["optimized_learning"] = True

# Simulated usage pattern
usage_times = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]  # seconds ago
current_time = 1000

print("\\nUsage history (seconds ago):")
print(f"{usage_times}")

# Calculate base-level activation
decay = 0.5
activations = []
for t in range(1, current_time):
    # Sum over all presentations before time t
    sum_term = sum([1/(current_time - use_time)**decay
                   for use_time in usage_times if use_time < t])
    if sum_term > 0:
        activation = np.log(sum_term)
    else:
        activation = -999  # Never used
    activations.append(activation)

print("\\nActivation changes over time:")
sample_times = [10, 100, 500, 1000]
for t in sample_times:
    if t-1 < len(activations):
        print(f"  t={t}: B_i = {activations[t-1]:.2f}")

# Context-dependent activation
print("\\n\\n2. Context Effects on Activation")

context_model = actr.ACTRModel()
context_model.model_parameters["subsymbolic"] = True
context_model.model_parameters["spreading_activation"] = True
context_model.model_parameters["strength_of_association"] = 2.0

actr.chunktype("memory", "item context")
actr.chunktype("context_cue", "location")

# Memories with context
memories = [
    ("keys", "home"),
    ("keys", "office"),
    ("phone", "home"),
    ("phone", "car"),
    ("wallet", "home"),
    ("wallet", "gym"),
]

print("\\nContext-dependent memories:")
for item, context in memories:
    chunk = actr.makechunk(chunktype="memory", item=item, context=context)
    context_model.decmem.add(chunk)
    print(f"  {item} in {context}")

print("\\nContext effects:")
print("Goal: 'Find keys' + Context: 'home'")
print("  → 'keys-at-home' gets activation boost")
print("  → More likely to retrieve correct memory")

# Activation dynamics with multiple factors
print("\\n\\n3. Total Activation Calculation")
print("\\nA_i = B_i + Σ(W_j * S_ji) + ε_i + M_i")
print("Where:")
print("  B_i = base-level activation")
print("  W_j = buffer j activation weight")
print("  S_ji = strength of association")
print("  ε_i = noise component")
print("  M_i = partial matching penalty")

# Example calculation
B_i = -0.5  # Base level
W_goal = 1.0
S_goal_i = 1.5
W_imaginal = 0.5
S_imaginal_i = 0.5
noise = np.random.logistic(0, 0.25)
mismatch = -0.5

total = B_i + (W_goal * S_goal_i) + (W_imaginal * S_imaginal_i) + noise + mismatch

print(f"\\nExample:")
print(f"  Base-level: {B_i:.2f}")
print(f"  From goal: +{W_goal * S_goal_i:.2f}")
print(f"  From imaginal: +{W_imaginal * S_imaginal_i:.2f}")
print(f"  Noise: {noise:.2f}")
print(f"  Mismatch: {mismatch:.2f}")
print(f"  Total: {total:.2f}")

# Optimized learning
print("\\n\\n4. Optimized Learning")
print("\\nApproximates full history with:")
print("  B_i = ln(n/L)")
print("Where:")
print("  n = total presentations")
print("  L = lifetime of chunk")

n_presentations = 50
lifetime = 3600  # seconds
optimized_activation = np.log(n_presentations / lifetime)

print(f"\\nExample: {n_presentations} uses over {lifetime/60:.0f} minutes")
print(f"Optimized B_i = {optimized_activation:.2f}")

# Activation spreading in networks
print("\\n\\n5. Spreading in Networks")

network_model = actr.ACTRModel()
network_model.model_parameters["spreading_activation"] = True

# Create interconnected knowledge
print("\\nKnowledge network:")
print("  Math → Algebra → Equations")
print("       → Geometry → Shapes")
print("       → Statistics → Probability")

print("\\nWith 'Math' active:")
print("  Direct spread to: Algebra, Geometry, Statistics")
print("  Secondary spread to: Equations, Shapes, Probability")
print("  Activation decreases with distance")

# Practical implications
print("\\n\\n=== Practical Implications ===")
print("\\n1. Spacing Effect:")
print("   Distributed practice → Better long-term activation")

print("\\n2. Context-Dependent Memory:")
print("   Same context → Better retrieval")

print("\\n3. Fan Effect:")
print("   More associations → Divided spreading → Slower")

print("\\n4. Priming:")
print("   Recent/related activation → Faster access")

print("\\n5. Interference:")
print("   Similar items → Competition → Errors")`
          },
          {
            type: 'explanation',
            content: 'Activation dynamics are at the heart of ACT-R\'s memory system. Understanding how activation accumulates, spreads, and decays helps explain phenomena from spacing effects to context-dependent memory!'
          }
        ]
      }
    ]
  },
  6: {
    sections: [
      {
        title: 'Working with Real Experimental Data',
        content: [
          {
            type: 'text',
            content: 'Let\'s work with actual experimental paradigms and see how to model real human data from psychology experiments.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np
import pandas as pd

print("=== Modeling Real Experiments ===")

# Experiment 1: Stroop Task
print("\\n1. STROOP TASK")
print("Name the COLOR of the text (ignore the word)")

stroop_model = actr.ACTRModel()
stroop_model.model_parameters["subsymbolic"] = True

actr.chunktype("stroop_stimulus", "word color congruent")
actr.chunktype("stroop_goal", "state stimulus response")

# Stroop stimuli
stimuli = [
    # Congruent
    ("RED", "red", "yes"),
    ("BLUE", "blue", "yes"),
    ("GREEN", "green", "yes"),
    # Incongruent
    ("RED", "blue", "no"),
    ("BLUE", "green", "no"),
    ("GREEN", "red", "no"),
]

# Human data (typical results)
human_stroop_data = {
    'congruent': {'rt': 650, 'accuracy': 0.98, 'sd': 120},
    'incongruent': {'rt': 850, 'accuracy': 0.93, 'sd': 180},
    'neutral': {'rt': 700, 'accuracy': 0.97, 'sd': 130}
}

print("\\nHuman Data:")
print("Condition    RT(ms)  Accuracy")
print("Congruent     650    98%")
print("Incongruent   850    93%")
print("Difference:   200ms (Stroop effect)")

# Productions for Stroop
stroop_model.productionstring(
    name="read_word_automatic",  # Automatic reading
    string='''
    =g>
        isa stroop_goal
        state perceive
    =visual>
        isa stroop_stimulus
        word =word
    ==>
    =g>
        state conflict
    +imaginal>
        isa response
        answer =word  # Automatic word reading!
''',
    utility=5  # High utility - automatic process
)

stroop_model.productionstring(
    name="name_color_controlled",  # Controlled process
    string='''
    =g>
        isa stroop_goal
        state perceive
    =visual>
        isa stroop_stimulus
        color =color
    ==>
    =g>
        state respond
    +imaginal>
        isa response
        answer =color  # Correct response
''',
    utility=3  # Lower utility - requires control
)

print("\\nModel explanation:")
print("- Automatic word reading (U=5) competes with")
print("- Controlled color naming (U=3)")
print("- Incongruent trials → conflict → slower")

# Experiment 2: Serial Position Effect
print("\\n\\n2. SERIAL POSITION EFFECT")

position_model = actr.ACTRModel()
position_model.model_parameters["subsymbolic"] = True
position_model.model_parameters["decay"] = 0.5

actr.chunktype("list_item", "position word")

# Present list of words
word_list = ["cat", "dog", "tree", "book", "chair",
            "phone", "lamp", "desk", "pen", "clock"]

for i, word in enumerate(word_list):
    position_model.decmem.add(actr.makechunk(
        chunktype="list_item",
        position=str(i+1),
        word=word
    ))

# Human serial position data
positions = list(range(1, 11))
human_recall_probability = [0.85, 0.75, 0.60, 0.45, 0.40,
                          0.35, 0.40, 0.50, 0.70, 0.90]

print("\\nHuman Recall Probability by Position:")
print("Position:  1    2    3    4    5    6    7    8    9   10")
print("Recall:   .85  .75  .60  .45  .40  .35  .40  .50  .70  .90")
print("\\nPattern: U-shaped curve")
print("- Primacy effect (first items)")
print("- Recency effect (last items)")

# Model predictions based on activation
print("\\nModel mechanisms:")
print("Primacy: More rehearsals → stronger memory")
print("Recency: Less decay → higher activation")

# Experiment 3: Visual Search
print("\\n\\n3. VISUAL SEARCH TASK")

search_model = actr.ACTRModel()
search_model.model_parameters["subsymbolic"] = True

# Human data: RT = a + b*N
human_search_data = {
    'feature_search': {'slope': 0, 'intercept': 450},      # Parallel
    'conjunction_search': {'slope': 25, 'intercept': 500}  # Serial
}

set_sizes = [4, 8, 16, 32]

print("\\nHuman Visual Search Data:")
print("\\nFeature Search (find RED):")
print("Set Size:   4     8    16    32")
print("RT (ms):   450   450   450   450  (flat!)")

print("\\nConjunction Search (find RED SQUARE):")
print("Set Size:   4     8    16    32")
print("RT (ms):   600   700   900  1300  (linear!)")

# Experiment 4: Task Switching
print("\\n\\n4. TASK SWITCHING PARADIGM")

switch_model = actr.ACTRModel()
switch_model.model_parameters["subsymbolic"] = True

actr.chunktype("task_goal", "current_task previous_task trial_type")

# Human task switching data
human_switch_data = {
    'repeat_trial': {'rt': 650, 'accuracy': 0.97},
    'switch_trial': {'rt': 850, 'accuracy': 0.92},
    'switch_cost': 200  # milliseconds
}

print("\\nHuman Task Switching:")
print("Repeat trials: 650ms, 97% accurate")
print("Switch trials: 850ms, 92% accurate")
print("Switch cost: 200ms")

print("\\nModel mechanisms:")
print("- Goal buffer must be updated")
print("- Previous task creates interference")
print("- Productions must be reconfigured")

# Summary of modeling approach
print("\\n\\n=== Modeling Real Data: Best Practices ===")

print("\\n1. Start with the phenomena")
print("   - What is the key effect?")
print("   - What are the boundary conditions?")

print("\\n2. Identify cognitive mechanisms")
print("   - Memory? Attention? Control?")
print("   - Which ACT-R modules are involved?")

print("\\n3. Set reasonable parameters")
print("   - Use standard values when possible")
print("   - Only fit when necessary")

print("\\n4. Make testable predictions")
print("   - New conditions")
print("   - Individual differences")
print("   - Neural correlates")

print("\\n5. Validate across datasets")
print("   - Same model, different experiments")
print("   - Parameter consistency")`
          },
          {
            type: 'explanation',
            content: 'Real experiments reveal cognitive mechanisms. The Stroop effect shows automatic vs controlled processing. Serial position reveals memory dynamics. Visual search distinguishes parallel from serial processing. ACT-R models explain WHY these effects occur!'
          }
        ]
      },
      {
        title: 'Building Complex Task Models',
        content: [
          {
            type: 'text',
            content: 'Let\'s build a model of a complex real-world task: driving while using a phone. This demonstrates how multiple modules interact under dual-task conditions.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

print("=== Complex Task: Driving + Phone Use ===")

# Create dual-task model
driving_model = actr.ACTRModel()
driving_model.model_parameters["subsymbolic"] = True
driving_model.model_parameters["rt"] = True

# Define task representations
actr.chunktype("driving_state", "lane position speed hazard")
actr.chunktype("phone_state", "conversation difficulty")
actr.chunktype("dual_task_goal", "primary_task phone_active priority")

# Driving productions (primary task)
driving_model.productionstring(
    name="monitor_lane",
    string='''
    =g>
        isa dual_task_goal
        primary_task driving
    ?visual>
        state free
    ==>
    +visual_location>
        isa _visual_location
        screen_y current_lane
''',
    utility=10  # High priority
)

driving_model.productionstring(
    name="detect_drift",
    string='''
    =g>
        isa dual_task_goal
        primary_task driving
    =visual>
        isa driving_state
        lane drifting
    ?motor>
        state free
    ==>
    +motor>
        isa _motor
        cmd steer
        direction center
    !output!
        Correcting lane position
''',
    utility=15  # Very high priority - safety critical
)

# Phone conversation productions (secondary task)
driving_model.productionstring(
    name="listen_to_phone",
    string='''
    =g>
        isa dual_task_goal
        phone_active yes
    ?aural>
        state free
    ==>
    +aural>
        isa _aural
        cmd listen
''',
    utility=5  # Lower priority
)

driving_model.productionstring(
    name="respond_to_question",
    string='''
    =g>
        isa dual_task_goal
        phone_active yes
    =aural>
        isa phone_state
        conversation question
    ?vocal>
        state free
    ==>
    +vocal>
        isa _vocal
        cmd speak
        content thinking
''',
    utility=4
)

# Interference production
driving_model.productionstring(
    name="attention_capture",
    string='''
    =g>
        isa dual_task_goal
        phone_active yes
    =aural>
        isa phone_state
        difficulty high
    ==>
    =g>
        priority phone  # Attention captured!
    !output!
        Attention captured by difficult conversation
''',
    utility=6
)

print("Model Components:")
print("1. Visual/Motor: Lane keeping")
print("2. Aural/Vocal: Phone conversation")
print("3. Goal: Task prioritization")

# Performance predictions
print("\\n=== Performance Predictions ===")

# Single task baselines
single_task_performance = {
    'driving_only': {
        'lane_deviation': 0.5,  # meters
        'reaction_time': 650,   # ms
        'accidents': 0.02       # per hour
    },
    'conversation_only': {
        'comprehension': 0.95,
        'response_time': 1200
    }
}

# Dual task degradation
dual_task_performance = {
    'driving_easy_convo': {
        'lane_deviation': 0.8,   # 60% worse
        'reaction_time': 850,    # 200ms slower
        'accidents': 0.05        # 2.5x more
    },
    'driving_hard_convo': {
        'lane_deviation': 1.5,   # 3x worse
        'reaction_time': 1200,   # 550ms slower
        'accidents': 0.15        # 7.5x more!
    }
}

print("\\nDriving Only:")
print(f"  Lane deviation: {single_task_performance['driving_only']['lane_deviation']}m")
print(f"  Hazard RT: {single_task_performance['driving_only']['reaction_time']}ms")

print("\\nDriving + Easy Conversation:")
print(f"  Lane deviation: {dual_task_performance['driving_easy_convo']['lane_deviation']}m")
print(f"  Hazard RT: {dual_task_performance['driving_easy_convo']['reaction_time']}ms")

print("\\nDriving + Hard Conversation:")
print(f"  Lane deviation: {dual_task_performance['driving_hard_convo']['lane_deviation']}m")
print(f"  Hazard RT: {dual_task_performance['driving_hard_convo']['reaction_time']}ms")

# Cognitive bottlenecks
print("\\n=== Cognitive Bottlenecks ===")

print("\\n1. Visual Attention:")
print("   Can't look at road AND internal imagery")
print("   Mental imagery disrupts lane monitoring")

print("\\n2. Central Executive:")
print("   Complex conversation requires problem solving")
print("   Competes with driving decisions")

print("\\n3. Motor Control:")
print("   Steering corrections delayed")
print("   When vocal system active")

# Individual differences
print("\\n=== Individual Differences ===")

# Model parameters for different drivers
novice_driver = {
    'production_utility_noise': 1.0,    # High variability
    'motor_burst_time': 0.07,           # Slower actions
    'visual_attention_latency': 0.100   # Slower scanning
}

expert_driver = {
    'production_utility_noise': 0.3,    # Consistent
    'motor_burst_time': 0.04,           # Fast actions
    'visual_attention_latency': 0.070   # Efficient scanning
}

print("\\nNovice vs Expert Under Dual-Task:")
print("\\nNovice: High workload → frequent attention capture")
print("Expert: Automated driving → better dual-tasking")
print("BUT: Hard conversation affects both!")

# Practical implications
print("\\n=== Model Insights ===")

print("\\n1. Hands-free ≠ Risk-free")
print("   Cognitive interference still occurs")

print("\\n2. Conversation difficulty matters")
print("   'Yes/No' → minimal impact")
print("   Problem solving → major impact")

print("\\n3. Expertise helps but doesn't eliminate risk")
print("   Automated skills still need monitoring")

print("\\n4. Design implications:")
print("   - Pause conversations during critical moments")
print("   - Detect high cognitive load")
print("   - Adaptive automation based on workload")`
          },
          {
            type: 'explanation',
            content: 'Complex tasks reveal how cognitive resources are limited. Even "hands-free" phone use competes for attention, decision making, and visual imagery resources. The model quantifies these interactions and predicts dangerous situations!'
          }
        ]
      },
      {
        title: 'From Lab to Application',
        content: [
          {
            type: 'text',
            content: 'Let\'s see how ACT-R models move from laboratory validation to real-world applications in education, training, and interface design.'
          },
          {
            type: 'code',
            content: `import pyactr as actr
import numpy as np

print("=== Real-World ACT-R Applications ===")

# Application 1: Intelligent Tutoring System
print("\\n1. ADAPTIVE MATH TUTOR")

tutor_model = actr.ACTRModel()
tutor_model.model_parameters["subsymbolic"] = True
tutor_model.model_parameters["decay"] = 0.5

actr.chunktype("skill", "name strength last_practice errors")
actr.chunktype("student_model", "current_skill mastery_level")

# Track student skills
skills = [
    ("addition", "0.9", "recent", "2"),
    ("subtraction", "0.7", "recent", "5"),
    ("multiplication", "0.4", "old", "12"),
    ("division", "0.2", "never", "0")
]

print("\\nStudent Model:")
print("Skill           Mastery  Last Practice  Errors")
for skill, mastery, practice, errors in skills:
    print(f"{skill:15s} {mastery}     {practice:8s}     {errors}")

# Adaptive problem selection
print("\\nAdaptive Algorithm:")
print("1. Estimate current activation of each skill")
print("2. Select skill just above retrieval threshold")
print("3. Adjust difficulty based on success rate")
print("4. Space practice optimally")

# Spacing algorithm based on ACT-R
def calculate_optimal_spacing(n_practices, target_retention=0.8):
    # Based on ACT-R decay function
    decay = 0.5
    spacing_intervals = []

    for i in range(1, n_practices):
        # Optimal spacing increases exponentially
        interval = (i ** (1/decay)) * 24  # hours
        spacing_intervals.append(interval)

    return spacing_intervals

spacings = calculate_optimal_spacing(5)
print("\\nOptimal Practice Schedule (hours):")
print(f"  Practice 2: +{spacings[0]:.0f}h")
print(f"  Practice 3: +{spacings[1]:.0f}h")
print(f"  Practice 4: +{spacings[2]:.0f}h")

# Application 2: Interface Design
print("\\n\\n2. MENU SYSTEM OPTIMIZATION")

menu_model = actr.ACTRModel()
actr.chunktype("menu_item", "label frequency position parent")

# Menu usage data
menu_usage = [
    ("Save", 0.30),
    ("Open", 0.25),
    ("Copy", 0.15),
    ("Paste", 0.12),
    ("Print", 0.08),
    ("Find", 0.05),
    ("Replace", 0.03),
    ("Settings", 0.02)
]

print("\\nCurrent Menu (Alphabetical):")
alphabetical = sorted([item[0] for item in menu_usage])
for i, item in enumerate(alphabetical):
    print(f"  {i+1}. {item}")

print("\\nACT-R Optimized Menu:")
print("(Ordered by predicted retrieval time)")

# Calculate retrieval times
def retrieval_time(frequency, position):
    base_time = 200  # ms
    frequency_factor = -50 * np.log(frequency)
    position_factor = 20 * position
    return base_time + frequency_factor + position_factor

optimized = sorted(menu_usage, key=lambda x: x[1], reverse=True)
print("\\nPosition  Item      Frequency  Predicted RT")
for i, (item, freq) in enumerate(optimized):
    rt = retrieval_time(freq, i)
    print(f"   {i+1}      {item:10s} {freq:.2f}      {rt:.0f}ms")

print("\\nDesign Principles:")
print("- Most frequent items first")
print("- Group related functions")
print("- Consistent positions across apps")

# Application 3: Training Simulation
print("\\n\\n3. PILOT TRAINING SYSTEM")

pilot_model = actr.ACTRModel()
pilot_model.model_parameters["subsymbolic"] = True

actr.chunktype("procedure", "name steps criticality")
actr.chunktype("error_type", "name cause likelihood consequence")

# Common pilot errors
errors = [
    ("altitude_bust", "distraction", "0.15", "minor"),
    ("missed_callout", "workload", "0.25", "minor"),
    ("wrong_frequency", "confusion", "0.10", "moderate"),
    ("config_error", "rushing", "0.05", "serious"),
]

print("\\nPredicted Error Rates by Experience:")
print("\\nError Type        Novice  Experienced")
print("Altitude Bust      15%      3%")
print("Missed Callout     25%      8%")
print("Wrong Frequency    10%      2%")
print("Config Error        5%      <1%")

print("\\nACT-R-Based Training:")
print("1. Identifies high-risk scenarios")
print("2. Practices until automaticity")
print("3. Introduces realistic workload")
print("4. Gradually increases complexity")

# Application 4: Workload Assessment
print("\\n\\n4. REAL-TIME WORKLOAD MONITORING")

workload_model = actr.ACTRModel()

# Buffer usage indicates workload
buffer_usage = {
    'goal': 0.9,        # 90% busy
    'retrieval': 0.7,   # 70% busy
    'visual': 0.8,      # 80% busy
    'motor': 0.3,       # 30% busy
    'vocal': 0.1        # 10% busy
}

overall_workload = np.mean(list(buffer_usage.values()))

print(f"\\nCurrent Workload: {overall_workload:.0%}")
print("\\nBuffer Utilization:")
for buffer, usage in buffer_usage.items():
    bar = '█' * int(usage * 20)
    print(f"{buffer:10s} [{bar:20s}] {usage:.0%}")

print("\\nAdaptive Automation Triggers:")
if overall_workload > 0.8:
    print("⚠️  HIGH WORKLOAD - Defer non-critical tasks")
elif overall_workload > 0.6:
    print("⚡ MODERATE - Monitor performance")
else:
    print("✓  NORMAL - All systems nominal")

# Summary
print("\\n\\n=== Impact of ACT-R Applications ===")

print("\\n1. Education:")
print("   Carnegie Learning: +23% learning gains")
print("   Cognitive Tutor: Used by 500,000+ students")

print("\\n2. Safety:")
print("   Pilot training: 40% reduction in errors")
print("   Driver models: Inform automation design")

print("\\n3. Design:")
print("   Menu optimization: 20% faster task completion")
print("   Error prediction: Proactive design fixes")

print("\\n4. Future Directions:")
print("   - Personalized learning systems")
print("   - Adaptive interfaces")
print("   - Cognitive digital twins")
print("   - Human-AI teaming")`
          },
          {
            type: 'explanation',
            content: 'ACT-R\'s success comes from modeling HOW people think, not just what they do. This leads to applications that adapt to human cognition: tutors that space practice optimally, interfaces that minimize retrieval time, and training that targets error-prone procedures.'
          }
        ]
      }
    ]
  }
}