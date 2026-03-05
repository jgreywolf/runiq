---
title: State Machine Diagrams
description: Model state-dependent behavior with UML state machines including states, transitions, guards, actions, composite states, and history.
lastUpdated: 2025-01-09
---

# State Machine Diagrams

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
- **History (Shallow)**: `@historyShallow` - Restores direct substate (H)
- **History (Deep)**: `@historyDeep` - Restores nested substate (H\*)
- **Entry Point**: `@entryPoint` - Composite state entry
- **Exit Point**: `@exitPoint` - Composite state exit
- **Terminate**: `@terminate` - State machine termination (X in circle)

See the [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes) for the complete list.

## State Behaviors

UML 2.5 defines three types of behaviors for states:

| Behavior | Property      | Description                             |
| -------- | ------------- | --------------------------------------- |
| Entry    | `entry:`      | Action executed when entering the state |
| Do       | `doActivity:` | Continuous activity while in the state  |
| Exit     | `exit:`       | Action executed when leaving the state  |

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

| Component | Property  | Description                       | Example           |
| --------- | --------- | --------------------------------- | ----------------- |
| Event     | `event:`  | Trigger that causes transition    | "buttonPressed"   |
| Guard     | `guard:`  | Boolean condition to check        | "[doorClosed]"    |
| Effect    | `effect:` | Action executed during transition | "/ turnOnLight()" |

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
  shape histShallow as @historyShallow
  shape histDeep as @historyDeep
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

- **Shallow History** (`@historyShallow`): Returns to the most recently active **direct** substate
- **Deep History** (`@historyDeep`): Returns to the most recently active **nested** substate at any depth

### Entry and Exit Points

Used with composite states (states containing substates):

```runiq
diagram "Composite State Boundaries" {
  shape start as @initialState
  shape entryPt as @entryPoint
  shape exitPt as @exitPoint
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
  shape hist as @historyShallow
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

| Feature                | Support    | Notes                                   |
| ---------------------- | ---------- | --------------------------------------- |
| States                 | ✅ Full    | With entry/exit/doActivity              |
| Initial/Final States   | ✅ Full    | Standard UML notation                   |
| Transitions            | ✅ Full    | event [guard] / effect syntax           |
| Choice Pseudo-state    | ✅ Full    | Dynamic branching                       |
| Junction Pseudo-state  | ✅ Full    | Static branching                        |
| Fork/Join              | ✅ Full    | Parallel regions                        |
| History (Shallow/Deep) | ✅ Full    | State restoration                       |
| Entry/Exit Points      | ✅ Full    | Composite state boundaries              |
| Terminate              | ✅ Full    | State machine termination               |
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
shape hist as @historyShallow

normal -> error event: "error"
error -> hist event: "recovered"
hist -> normal  # Default if no history
```

## Complete Real-World Examples

### Door Lock System

A comprehensive example showing entry/exit actions with alarm integration:

```runiq
diagram "Door Lock State Machine" {

  shape initial as @initialState

  shape unlocked as @state
    label:"Unlocked"
    entry:"releaseLockBolt()"
    doActivity:"monitorDoor()"
    exit:"stopMonitoring()"

  shape locked as @state
    label:"Locked"
    entry:"engageLockBolt() ; enableAlarm()"
    exit:"disableAlarm()"

  shape alarmed as @state
    label:"Alarmed"
    entry:"soundAlarm() ; notifySecurity()"
    doActivity:"flashLights()"
    exit:"silenceAlarm()"

  shape final as @finalState

  initial -> unlocked
  unlocked -> locked label:"lock"
  locked -> unlocked label:"unlock"
  unlocked -> alarmed label:"tamper"
  locked -> alarmed label:"forceDetected"
  alarmed -> locked label:"reset"
  locked -> final label:"deactivate"
}
```

**Key Features:**

- Entry actions initialize state-specific behavior
- DoActivity performs continuous monitoring
- Exit actions clean up when leaving state
- Multiple actions separated by semicolons

### Traffic Light Controller

Complex timing and safety behaviors:

```runiq
diagram "Traffic Light State Machine" {

  shape initial as @initialState

  shape red as @state
    label:"Red"
    entry:"turnOnRed() ; startTimer(30)"
    doActivity:"enforceStop()"
    exit:"turnOffRed() ; clearTimer()"

  shape yellow as @state
    label:"Yellow"
    entry:"turnOnYellow() ; startTimer(5)"
    doActivity:"warnDrivers()"
    exit:"turnOffYellow()"

  shape green as @state
    label:"Green"
    entry:"turnOnGreen() ; startTimer(45)"
    doActivity:"allowTraffic()"
    exit:"turnOffGreen()"

  shape pedestrianCrossing as @state
    label:"Pedestrian Crossing"
    entry:"activateCrosswalk() ; startTimer(15)"
    doActivity:"displayWalkSign()"
    exit:"deactivateCrosswalk()"

  shape emergency as @state
    label:"Emergency Mode"
    entry:"flashAllRed() ; soundAlarm()"
    doActivity:"prioritizeEmergencyVehicle()"
    exit:"resumeNormalOperation()"

  initial -> red
  red -> green label:"timerExpired"
  green -> yellow label:"timerExpired"
  yellow -> red label:"timerExpired"
  red -> pedestrianCrossing label:"pedestrianButton"
  pedestrianCrossing -> green label:"timerExpired"
  red -> emergency label:"emergencySignal"
  green -> emergency label:"emergencySignal"
  emergency -> red label:"emergencyCleared"
}
```

**Key Features:**

- Timer management in entry/exit actions
- Continuous activities (doActivity) for monitoring
- Emergency override transitions
- Pedestrian crossing integration

### Best Practices for State Behaviors

1. **Entry Actions** - Use for:
   - Resource initialization
   - Starting timers
   - Setting up monitoring
   - Logging state entry

2. **DoActivity** - Use for:
   - Continuous operations (playing audio, monitoring sensors)
   - Long-running tasks
   - Background processing
   - Activities that can be interrupted

3. **Exit Actions** - Use for:
   - Resource cleanup
   - Stopping timers
   - Releasing locks
   - Logging state exit

4. **Multiple Actions** - Separate with semicolons:

   ```runiq
   entry:"action1() ; action2() ; action3()"
   ```

5. **Action Syntax** - Keep actions as method calls:
   - Good: `"startTimer(30)"`, `"count++"`
   - Avoid: Complex multi-line code

## Advanced Transition Syntax

UML 2.5 defines comprehensive transition syntax: **event [guard] / effect**

All three components are optional, allowing flexible transition modeling.

### Event-Only Transitions

Simple trigger-based transitions:

```runiq
diagram "Event Example" {
  idle -> active event:"buttonPressed"
  active -> complete event:"taskFinished"
}
```

### Guard-Only Transitions

Conditional transitions without explicit events (evaluated continuously):

```runiq
diagram "Guard Example" {
  processing -> complete guard:"[progress >= 100]"
  waiting -> timeout guard:"[elapsedTime > maxWait]"
}
```

### Effect-Only Transitions

Actions without events or guards:

```runiq
diagram "Effect Example" {
  start -> initialized effect:"loadConfig(); setupLogger()"
}
```

### Combining Event, Guard, and Effect

Full UML transition syntax:

```runiq
diagram "ATM Withdrawal" {
  shape idle as @state label:"Idle"
  shape verifying as @state label:"Verifying"
  shape dispensing as @state label:"Dispensing"
  shape error as @state label:"Error"

  idle -> verifying
    event:"cardInserted"
    effect:"readCard(); startSession()"

  verifying -> dispensing
    event:"pinEntered"
    guard:"[pinValid && balance >= amount]"
    effect:"deductAmount(); logTransaction()"

  verifying -> error
    event:"pinEntered"
    guard:"[!pinValid || attempts >= 3]"
    effect:"incrementAttempts(); showError()"
}
```

### Complex Guard Conditions

Guards support logical operators and comparisons:

```runiq
diagram "Complex Guards" {
  idle -> ready
    guard:"[temperature > 20 && temperature < 80 && pressure == nominal]"

  ready -> running
    guard:"[fuel >= minFuel || batteryLevel > 0.5]"

  running -> emergency
    event:"alert"
    guard:"[errorCount >= threshold && !maintenanceMode]"
}
```

### Multiple Effect Actions

Use semicolons to separate multiple actions:

```runiq
diagram "Multiple Effects" {
  processing -> complete
    event:"finished"
    effect:"saveResults(); notifyUser(); cleanup(); logCompletion()"
}
```

### Self-Transitions

Transitions can return to the same state (executes exit then entry):

```runiq
diagram "Self-Transition" {
  shape active as @state
    label:"Active"
    entry:"resetCounter()"
    exit:"saveState()"

  active -> active
    event:"refresh"
    effect:"reloadData()"
}
```

### Transition Best Practices

1. **Events** - Name clearly what triggers the transition:
   - Good: `"paymentReceived"`, `"timeout"`, `"userCancelled"`
   - Avoid: Generic names like `"event1"`, `"trigger"`

2. **Guards** - Always enclose in square brackets `[...]`:
   - Include the brackets in the string: `guard:"[balance > 0]"`
   - Use clear boolean expressions
   - Keep conditions simple and testable

3. **Effects** - Use imperative action names:
   - Good: `"startTimer()"`, `"logError()"`, `"sendNotification()"`
   - Show method calls with parentheses
   - Separate multiple actions with semicolons

4. **Completeness** - Use appropriate combinations:
   - Simple trigger: event only
   - Conditional: guard (with or without event)
   - Action-required: always include effect
   - Full syntax: all three for complex business logic

5. **Documentation** - Comment complex transitions:
   ```runiq
   // Validate payment and authorize transaction
   pending -> authorized
     event:"paymentProcessed"
     guard:"[amount <= creditLimit && !fraudDetected]"
     effect:"reserveFunds(); sendConfirmation()"
   ```

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML       | Lucidchart  | Enterprise Architect | Visual Paradigm | Yakindu        | MATLAB Stateflow |
| ---------------------------- | -------------- | -------------- | -------------- | ----------- | -------------------- | --------------- | -------------- | ---------------- |
| **Basic Support**            | ✅             | ✅             | ✅             | ⚠️ Basic    | ✅                   | ✅              | ✅             | ✅               |
| **UML 2.5 compliance**       | ✅             | ⚠️ Basic       | ✅             | ⚠️ Basic    | ✅                   | ✅              | ✅             | ⚠️ Stateflow     |
| **State behaviors**          | ✅             | ❌             | ✅             | ⚠️ Limited  | ✅                   | ✅              | ✅             | ✅               |
| **Composite states**         | ✅             | ❌             | ✅             | ✅          | ✅                   | ✅              | ✅             | ✅               |
| **Pseudo-states**            | ✅ 9 types     | ⚠️ 2 types     | ✅             | ⚠️ Limited  | ✅                   | ✅              | ✅             | ✅               |
| **History states**           | ✅             | ❌             | ✅             | ⚠️ Manual   | ✅                   | ✅              | ✅             | ✅               |
| **Fork/Join**                | ✅             | ❌             | ✅             | ⚠️ Manual   | ✅                   | ✅              | ✅             | ✅               |
| **Guards**                   | ✅             | ❌             | ✅             | ⚠️ Labels   | ✅                   | ✅              | ✅             | ✅               |
| **Effects/Actions**          | ✅             | ❌             | ✅             | ⚠️ Labels   | ✅                   | ✅              | ✅             | ✅               |
| **Code generation**          | ❌             | ❌             | ❌             | ❌          | ✅                   | ✅              | ✅             | ✅               |
| **Simulation**               | ❌             | ❌             | ❌             | ❌          | ⚠️ Limited           | ⚠️ Limited      | ✅             | ✅               |
| **Text-based DSL**           | ✅             | ✅             | ✅             | ❌          | ⚠️ Partial           | ⚠️ Partial      | ✅             | ❌               |
| **Version control friendly** | ✅             | ✅             | ✅             | ⚠️ Partial  | ⚠️ Partial           | ⚠️ Partial      | ✅             | ⚠️ Partial       |
| **Automatic layout**         | ✅             | ✅             | ✅             | ❌          | ⚠️ Partial           | ⚠️ Partial      | ⚠️ Partial     | ❌               |
| **Documentation generation** | ✅             | ✅             | ✅             | ⚠️ Partial  | ✅                   | ✅              | ✅             | ⚠️ Partial       |
| **Export formats**           | SVG, PNG       | SVG, PNG       | SVG, PNG       | Multiple    | Multiple             | Multiple        | Multiple       | Multiple         |
| **Learning curve**           | Low            | Low            | Medium         | Low         | High                 | High            | Medium         | High             |
| **Cost**                     | Free           | Free           | Free           | Paid        | Paid                 | Paid            | Free/Paid      | Paid             |
| **Platform**                 | Cross-platform | Cross-platform | Cross-platform | Web/Desktop | Windows/Mac          | Cross-platform  | Cross-platform | Windows/Mac      |

**Key Advantages of Runiq:**

- **Full UML 2.5**: Complete pseudo-state support (choice, junction, fork, join, history, terminate)
- **Version Control**: Track state machine evolution in Git with system code
- **Unified Language**: Consistent syntax with other UML diagrams
- **Clear Syntax**: Readable state behaviors and transition guards

**When to Use Alternatives:**

- **Yakindu/MATLAB Stateflow**: Code generation and simulation for embedded systems
- **Enterprise Architect/Visual Paradigm**: Full UML modeling with round-trip engineering
- **PlantUML**: Established tool with extensive UML and documentation support
- **Lucidchart**: Real-time collaboration for requirements and design sessions

## Related Topics

- [Class Diagrams](/guide/class-diagrams) - UML class modeling
- [Sequence Diagrams](/guide/sequence-diagrams) - Interaction modeling
- [Use Case Diagrams](/guide/use-case-diagrams) - System functionality
- [Activity Diagrams](/guide/activity-diagrams) - Process modeling (coming soon)

---

**Last Updated:** October 31, 2025  
**Specification Compliance:** UML 2.5 State Machines (~85% coverage)
