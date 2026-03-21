# pyactr API notes

Things I ran into while writing these tutorials. Documenting here so I don't forget.

## Visual module setup

The model needs an `Environment` if you want to use the visual module. Create it first and pass it in:

```python
env = actr.Environment(focus_position=(0, 0))
model = actr.ACTRModel(environment=env)
visual_buffer = model.visualBuffer("visual", "visual_location")
```

Without this you'll get `AttributeError` when trying to access `model.environment`.

## Parameters

Everything goes through `model.model_parameters`:

```python
model.model_parameters['subsymbolic'] = True
model.model_parameters['retrieval_threshold'] = -2
model.model_parameters['mismatch_penalty'] = 1.5
```

Older examples online use `model.decmemparams` or `dm.mismatch_penalty` -- those don't work anymore.

## Buffer access

Buffers are iterable. Don't try to access `.chunk` directly:

```python
# works
for chunk in model.goal:
    print(chunk.state)

# doesn't work
model.goal.chunk  # AttributeError
```

## Motor module

Created automatically, don't instantiate it yourself. Use productions to trigger motor actions:

```python
model.productionstring(
    name="press_key",
    string='''
    =g>
        isa goal
        state ready
    ==>
    =g>
        state done
    +manual>
        isa _manual
        cmd press_key
        key "a"
    '''
)
```

## Production syntax

No `!output!` or `!eval!` directives -- pyactr doesn't support them. If you see these in Lisp ACT-R examples, just remove them.

## Full visual-motor example

```python
env = actr.Environment(focus_position=(0, 0), size=(640, 480))
model = actr.ACTRModel(environment=env)
model.visualBuffer("visual", "visual_location")

env.stimulus = {
    1: {'text': 'A', 'position': (100, 100)},
    2: {'text': 'B', 'position': (200, 100)}
}

sim = model.simulation(
    environment_process=env.environment_process,
    gui=False
)
```

## Quick reference

```python
import pyactr as actr

model = actr.ACTRModel()

# chunk types and chunks
actr.chunktype("goal", "state")
chunk = actr.makechunk(typename="goal", state="start")

# memory and buffers
model.decmem.add(chunk)
model.goal.add(chunk)

# productions
model.productionstring(name="rule", string="...")

# run
sim = model.simulation(gui=False)
sim.run()
```
