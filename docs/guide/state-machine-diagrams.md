---
title: UML State Machine Diagrams
---

# UML State Machine Diagrams

Create UML 2.5 compliant state machine diagrams to model the behavior of objects and systems with Runiq's comprehensive state machine support.

## Overview

State machine diagrams show the different states an object can be in and the transitions between those states. Runiq provides full support for UML 2.5 state machine notation including state behaviors, transition syntax, and pseudo-states.

## Key Shapes

### Basic States

- **State**: `@state` - Standard state with optional behaviors
- **Initial State**: `@initialState` - Starting point (filled circle)
- **Final State**: `@finalState` - Terminal state (circle with inner filled circle)

### Pseudo-states

- **Choice**: `@choice` - Dynamic conditional branch (diamond)
- **Junction**: `@junction` - Static conditional branch (filled circle)
- **Fork**: `@fork` - Parallel split (horizontal bar)
- **Join**: `@join` - Parallel merge (horizontal bar)
- **History (Shallow)**: `@history-shallow` - Restores direct substate (H)
- **History (Deep)**: `@history-deep` - Restores nested substate (H*)
- **Entry Point**: `@entry-point` - Composite state entry
- **Exit Point**: `@exit-point` - Composite state exit
- **Terminate**: `@terminate` - State machine termination (X in circle)

See the [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes) for the complete list.

## State Behaviors

UML 2.5 defines three types of behaviors for states:

| Behavior   | Property     | Description                                 |
| ---------- | ------------ | ------------------------------------------- |
| Entry      | `entry:`     | Action executed when entering the state     |
| Do         | `doActivity:` | Continuous activity while in the state      |
| Exit       | `exit:`      | Action executed when leaving the state      |

### Example: State with Behaviors

```runiq
diagram "State Behaviors" {
  shape processing as @state label: "Processing"
    entry: "startProcess()"
    doActivity: "processData()"
    exit: "cleanup()"
}
```

This renders as:

```
┌─────────────────────────┐
│      Processing         │
├─────────────────────────┤
│ entry / startProcess()  │
│ do / processData()      │
│ exit / cleanup()        │
└─────────────────────────┘
```

## Transition Syntax

UML transitions follow the pattern: **event [guard] / effect**

| Component | Property  | Description                       | Example             |
| --------- | --------- | --------------------------------- | ------------------- |
| Event     | `event:`  | Trigger that causes transition    | "buttonPressed"     |
| Guard     | `guard:`  | Boolean condition to check        | "[doorClosed]"      |
| Effect    | `effect:` | Action executed during transition | "/ turnOnLight()"   |

### Example: Full Transition Syntax

```runiq
diagram "Door Lock System" {
  shape locked as @state label: "Locked"
    entry: "engageLock()"
  
  shape unlocked as @state label: "Unlocked"
    entry: "releaseLock()"

  locked -> unlocked
    event: "unlockButton"
    guard: "[validKey]"
    effect: "/ logUnlock()"
}
```

This creates a transition labeled: `unlockButton [validKey] / logUnlock()`

## Simple State Machine

```runiq
diagram "Basic State Machine" {
  direction LR

  # Initial state
  shape start as @initialState

  # States
  shape idle as @state label: "Idle"
  shape processing as @state label: "Processing"
  shape complete as @state label: "Complete"

  # Final state
  shape end as @finalState

  # Transitions
  start -> idle
  idle -> processing event: "start"
  processing -> complete event: "done"
  complete -> end
}
```

## State Machine with Behaviors

```runiq
diagram "Enhanced State Machine" {
  direction TB

  shape start as @initialState

  shape idle as @state label: "Idle"
    entry: "turnOffLight()"
    doActivity: "monitorSensors()"
    exit: "logStateChange()"

  shape processing as @state label: "Processing"
    entry: "startProcess()"
    doActivity: "processData()"
    exit: "cleanup()"

  shape error as @state label: "Error"
    entry: "logError()"
    doActivity: "flashErrorLED()"
    exit: "clearError()"

  shape end as @finalState

  # Transitions with full syntax
  start -> idle

  idle -> processing
    event: "dataReceived"
    guard: "[dataValid]"
    effect: "/ validateData()"

  processing -> idle
    event: "completed"
    effect: "/ saveResults()"

  processing -> error
    event: "failure"
    effect: "/ notifyAdmin()"

  error -> idle
    event: "reset"
    guard: "[errorCleared]"

  idle -> end event: "shutdown"
}
```

## Pseudo-states

### Choice (Dynamic Conditional Branch)

Choice pseudo-states evaluate guards at runtime:

```runiq
diagram "Choice Example" {
  direction LR

  shape start as @initialState
  shape processing as @state label: "Processing"
  shape decision as @choice
  shape fastPath as @state label: "Fast Path"
  shape slowPath as @state label: "Slow Path"
  shape end as @finalState

  start -> processing
  processing -> decision event: "completed"
  
  decision -> fastPath label: "[priority == high]"
  decision -> slowPath label: "[priority == low]"
  
  fastPath -> end
  slowPath -> end
}
```

### Junction (Static Conditional Branch)

Junction pseudo-states have static guards:

```runiq
diagram "Junction Example" {
  direction TB

  shape processing as @state label: "Processing"
  shape junc as @junction
  shape retry as @state label: "Retry"
  shape abort as @state label: "Abort"
  shape term as @terminate

  processing -> junc effect: "/ checkStatus()"
  
  junc -> retry label: "[retryCount < 3]"
  junc -> abort label: "[retryCount >= 3]"
  junc -> term label: "[fatalError]"
}
```

### Fork and Join (Parallel States)

```runiq
diagram "Parallel Processing" {
  direction TB

  shape start as @initialState
  shape ready as @state label: "Ready"
  shape split as @fork
  
  shape task1 as @state label: "Task 1"
  shape task2 as @state label: "Task 2"
  
  shape merge as @join
  shape complete as @state label: "Complete"
  shape end as @finalState

  start -> ready
  ready -> split event: "process"
  
  # Parallel execution
  split -> task1
  split -> task2
  
  # Synchronization
  task1 -> merge
  task2 -> merge
  
  merge -> complete
  complete -> end
}
```

### History States

History pseudo-states remember the last active substate:

```runiq
diagram "History Example" {
  shape start as @initialState
  shape running as @state label: "Running"
  shape paused as @state label: "Paused"
  shape histShallow as @history-shallow
  shape histDeep as @history-deep
  shape end as @finalState

  start -> running
  
  # Pause remembers last state
  running -> paused event: "pause"
  
  # Resume returns to remembered state (shallow)
  paused -> histShallow event: "resume"
  histShallow -> running
  
  # Deep history for nested states
  paused -> histDeep event: "deepResume"
  histDeep -> running
  
  running -> end event: "stop"
}
```

**Difference between Shallow and Deep History:**
- **Shallow History** (`@history-shallow`): Returns to the most recently active **direct** substate
- **Deep History** (`@history-deep`): Returns to the most recently active **nested** substate at any depth

### Entry and Exit Points

Used with composite states (states containing substates):

```runiq
diagram "Composite State Boundaries" {
  shape start as @initialState
  shape entryPt as @entry-point
  shape exitPt as @exit-point
  shape processing as @state label: "Processing"
  shape end as @finalState

  start -> entryPt
  entryPt -> processing
  processing -> exitPt
  exitPt -> end
}
```

### Terminate Pseudo-state

Immediately terminates the state machine:

```runiq
diagram "Emergency Shutdown" {
  shape running as @state label: "Running"
  shape error as @state label: "Critical Error"
  shape term as @terminate

  running -> error event: "fatalError"
  error -> term effect: "/ emergencyShutdown()"
}
```

## Complete Example

Here's a comprehensive state machine showing all features:

```runiq
diagram "Complete State Machine - Door Lock" {
  direction TB

  # Initial state
  shape start as @initialState

  # States with behaviors
  shape idle as @state label: "Idle"
    entry: "turnOffLight()"
    doActivity: "monitorSensors()"
    exit: "logStateChange()"

  shape locked as @state label: "Locked"
    entry: "engageLock()"
    doActivity: "flashLED()"
    exit: "disengageLock()"

  shape unlocked as @state label: "Unlocked"
    entry: "releaseLock()"
    doActivity: "startTimer(10s)"
    exit: "stopTimer()"

  shape alarm as @state label: "Alarm"
    entry: "soundAlarm()"
    doActivity: "sendAlert()"
    exit: "silenceAlarm()"

  # Pseudo-states
  shape decision as @choice
  shape hist as @history-shallow
  shape term as @terminate

  # Final state
  shape end as @finalState

  # Transitions with full UML syntax
  start -> idle

  idle -> decision
    event: "buttonPressed"
    effect: "/ readKeypad()"

  decision -> locked
    label: "[validCode && action == lock]"
    effect: "/ logLockEvent()"

  decision -> unlocked
    label: "[validCode && action == unlock]"
    effect: "/ logUnlockEvent()"

  decision -> idle
    label: "[!validCode]"
    effect: "/ playErrorBeep()"

  locked -> unlocked
    event: "unlockButton"
    guard: "[validKey]"
    effect: "/ logUnlock()"

  unlocked -> locked
    event: "timeout"
    effect: "/ autoLock()"

  unlocked -> alarm
    event: "forcedEntry"
    effect: "/ triggerAlarm()"

  alarm -> hist
    event: "reset"
    guard: "[adminCode]"
    effect: "/ clearAlarm()"

  hist -> locked

  alarm -> term
    event: "fatalError"
    effect: "/ emergencyShutdown()"

  locked -> end event: "powerOff"
}
```

## Best Practices

### 1. State Naming
- Use **noun phrases** for state names: "Locked", "Processing", "Waiting"
- Avoid verb phrases unless necessary: "StartingUp" is okay

### 2. Transition Labels
- **Event names**: Use past tense or imperative: "buttonPressed", "timeout", "start"
- **Guards**: Always use square brackets: `[condition]`
- **Effects**: Always prefix with `/`: `/ action()`

### 3. State Behaviors
- **Entry actions**: Setup, initialization, notifications
- **Do activities**: Continuous operations that can be interrupted
- **Exit actions**: Cleanup, resource release, logging

### 4. Pseudo-state Usage
- Use **choice** for runtime decisions based on dynamic data
- Use **junction** for static branching based on constants
- Use **history** when substates need to be restored after interruption

### 5. Diagram Organization
- Use `direction LR` for wide, flat state machines
- Use `direction TB` for hierarchical state machines with many levels
- Group related states visually with spacing or containers

## UML 2.5 Compliance

Runiq's state machine diagrams are compliant with UML 2.5:

| Feature                | Support | Notes                                    |
| ---------------------- | ------- | ---------------------------------------- |
| States                 | ✅ Full | With entry/exit/doActivity               |
| Initial/Final States   | ✅ Full | Standard UML notation                    |
| Transitions            | ✅ Full | event [guard] / effect syntax            |
| Choice Pseudo-state    | ✅ Full | Dynamic branching                        |
| Junction Pseudo-state  | ✅ Full | Static branching                         |
| Fork/Join              | ✅ Full | Parallel regions                         |
| History (Shallow/Deep) | ✅ Full | State restoration                        |
| Entry/Exit Points      | ✅ Full | Composite state boundaries               |
| Terminate              | ✅ Full | State machine termination                |
| Composite States       | ⚠️ Partial | Use containers (future: proper nesting) |

## Tips

::: tip State Behavior Format
The behavior syntax automatically adds the UML format:
- `entry: "action()"` renders as `entry / action()`
- `doActivity: "task()"` renders as `do / task()`
- `exit: "cleanup()"` renders as `exit / cleanup()`
:::

::: tip Transition Syntax
You can use any combination of event, guard, and effect:
```runiq
# Event only
idle -> processing event: "start"

# Event + Guard
idle -> processing event: "start" guard: "[ready]"

# Event + Effect
idle -> processing event: "start" effect: "/ initialize()"

# All three
idle -> processing 
  event: "start"
  guard: "[ready]"
  effect: "/ initialize()"
```
:::

::: tip History Restoration
When using history pseudo-states, they must have an outgoing transition to the default state (in case no history exists):
```runiq
hist -> defaultState  # Required default transition
```
:::

## Common Patterns

### Retry Pattern

```runiq
shape processing as @state label: "Processing"
shape junc as @junction
shape retry as @state label: "Retry"
shape failed as @state label: "Failed"

processing -> junc event: "error"
junc -> retry label: "[retryCount < maxRetries]" effect: "/ retryCount++"
junc -> failed label: "[retryCount >= maxRetries]"
retry -> processing effect: "/ retryOperation()"
```

### Timeout Pattern

```runiq
shape waiting as @state label: "Waiting"
  entry: "startTimer(30s)"
  exit: "cancelTimer()"

shape timeout as @state label: "Timeout"

waiting -> timeout event: "timerExpired"
```

### Error Recovery Pattern

```runiq
shape normal as @state label: "Normal"
shape error as @state label: "Error"
shape hist as @history-shallow

normal -> error event: "error"
error -> hist event: "recovered"
hist -> normal  # Default if no history
```

## Related Topics

- [Class Diagrams](/guide/class-diagrams) - UML class modeling
- [Sequence Diagrams](/guide/sequence-diagrams) - Interaction modeling
- [Use Case Diagrams](/guide/use-case-diagrams) - System functionality
- [Activity Diagrams](/guide/activity-diagrams) - Process modeling (coming soon)

---

**Last Updated:** October 31, 2025  
**Specification Compliance:** UML 2.5 State Machines (~85% coverage)
