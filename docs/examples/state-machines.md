# State Machine Examples

UML State Machine Diagrams (also called statecharts) model the behavior of objects through states, transitions, and events.

For comprehensive documentation on state machine syntax and features, see the [State Machine Diagrams Guide](/guide/state-machine-diagrams).

## Traffic Light Controller

Classic traffic light with normal cycle, pedestrian crossing, and emergency modes.

### DSL Code

```runiq
diagram "Traffic Light State Machine" {
  
  // Traffic light states with timing actions
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
  
  // Pedestrian crossing state
  shape pedestrianCrossing as @state 
    label:"Pedestrian Crossing" 
    entry:"turnOnRedLight() ; activateCrosswalk() ; startTimer(15)" 
    doActivity:"displayWalkSign() ; monitorCrossing()" 
    exit:"deactivateCrosswalk() ; displayDontWalk()"
  
  // Emergency mode
  shape emergency as @state 
    label:"Emergency Mode" 
    entry:"flashAllRed() ; soundAlarm()" 
    doActivity:"prioritizeEmergencyVehicle()" 
    exit:"resumeNormalOperation()"
  
  // Malfunction
  shape malfunction as @state 
    label:"Malfunction" 
    entry:"flashYellow() ; notifyControl()" 
    doActivity:"logIssue()" 
    exit:"resetSystem()"
  
  shape final as @finalState
  
  // Normal cycle
  initial -> red
  red -> green label:"timerExpired"
  green -> yellow label:"timerExpired"
  yellow -> red label:"timerExpired"
  
  // Pedestrian button
  red -> pedestrianCrossing label:"pedestrianButton"
  pedestrianCrossing -> green label:"timerExpired"
  
  // Emergency override
  red -> emergency label:"emergencySignal"
  green -> emergency label:"emergencySignal"
  yellow -> emergency label:"emergencySignal"
  emergency -> red label:"emergencyCleared"
  
  // Malfunction handling
  red -> malfunction label:"sensorFailure"
  green -> malfunction label:"sensorFailure"
  malfunction -> red label:"systemReset"
  
  // Shutdown
  red -> final label:"shutdown"
}
```

### Key Features

- **Entry Actions**: Execute when entering state (e.g., `turnOnRed()`, `startTimer(30)`)
- **Do Activity**: Continuous activity while in state (e.g., `enforceStop()`)
- **Exit Actions**: Execute when leaving state (e.g., `turnOffRed()`, `clearTimer()`)
- **Event-Driven Transitions**: Timer events, button presses, signals
- **Multiple States**: Normal operation (Red/Yellow/Green), special modes (Pedestrian, Emergency, Malfunction)

### State Behavior

Each state has three types of actions:

1. **Entry**: Run once when entering state
2. **Do Activity**: Run continuously while in state
3. **Exit**: Run once when leaving state

Example:
```
Red State:
  Entry: turnOnRed() ; startTimer(30)
  Do: enforceStop()
  Exit: turnOffRed() ; clearTimer()
```

### Transition Events

| Event | Source State | Target State | Purpose |
|-------|--------------|--------------|---------|
| `timerExpired` | Red → Green | Green | Normal cycle progression |
| `pedestrianButton` | Red → Crossing | Pedestrian Crossing | Pedestrian request |
| `emergencySignal` | Any → Emergency | Emergency Mode | Emergency vehicle priority |
| `sensorFailure` | Any → Malfunction | Malfunction | Fault detection |

---

## Door Lock Security System

Electronic door lock with alarm and tamper detection.

### DSL Code

```runiq
diagram "Door Lock State Machine" {
  
  // States with entry/exit actions
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
  
  // Transitions with events
  initial -> unlocked
  unlocked -> locked label:"lock"
  locked -> unlocked label:"unlock"
  unlocked -> alarmed label:"tamper"
  locked -> alarmed label:"forceDetected"
  alarmed -> locked label:"reset"
  locked -> final label:"deactivate"
}
```

### Key Features

- **Simple State Model**: Three primary states (Unlocked, Locked, Alarmed)
- **Security Actions**: Alarm enabling/disabling, security notifications
- **Tamper Detection**: Transitions to alarmed state on tamper or force
- **Reset Capability**: Return from alarmed state to locked after reset

### State Transitions

```
Unlocked ←→ Locked    (normal lock/unlock operations)
Unlocked → Alarmed    (tamper detected)
Locked → Alarmed      (force detected)
Alarmed → Locked      (reset after alarm)
```

### Security Features

1. **Alarm Integration**: Enabled when locked, triggered on tampering
2. **Monitoring**: Door monitoring active when unlocked
3. **Notifications**: Security notified when alarm triggered
4. **Visual Indicators**: Flashing lights during alarm state

---

## Vending Machine

Product vending machine with payment processing and error handling.

### DSL Code

```runiq
diagram "Vending Machine State Machine" {
  
  // Initial and idle states
  shape initial as @initialState
  
  shape idle as @state 
    label:"Idle" 
    entry:"displayWelcome()" 
    doActivity:"showAdvertisement()"
  
  // Selection and payment
  shape selecting as @state 
    label:"Selecting Product" 
    entry:"enableSelection()" 
    doActivity:"highlightAvailable()" 
    exit:"disableSelection()"
  
  shape processing as @state 
    label:"Processing Payment" 
    entry:"validateCard()" 
    doActivity:"contactPaymentGateway()" 
    exit:"finalizeTransaction()"
  
  // Dispensing with complex actions
  shape dispensing as @state 
    label:"Dispensing" 
    entry:"openDispenser() ; releaseProduct()" 
    doActivity:"checkDispenseComplete()" 
    exit:"closeDispenser() ; updateInventory()"
  
  // Error handling states
  shape outOfStock as @state 
    label:"Out of Stock" 
    entry:"displayOutOfStock() ; suggestAlternatives()" 
    exit:"clearDisplay()"
  
  shape paymentFailed as @state 
    label:"Payment Failed" 
    entry:"displayError() ; returnCard()" 
    doActivity:"waitForCustomerAction()" 
    exit:"resetPayment()"
  
  shape dispenseFailed as @state 
    label:"Dispense Failed" 
    entry:"displayApology() ; initiateRefund()" 
    exit:"notifyMaintenance()"
  
  // Maintenance
  shape maintenance as @state 
    label:"Maintenance Mode" 
    entry:"lockAllControls() ; displayMaintenance()" 
    exit:"unlockControls()"
  
  // Transitions
  initial -> idle
  
  idle -> selecting label:"selectButton"
  selecting -> processing label:"confirmSelection"
  selecting -> outOfStock label:"[productUnavailable]"
  selecting -> idle label:"cancel"
  
  processing -> dispensing label:"[paymentSuccess]"
  processing -> paymentFailed label:"[paymentFailed]"
  
  dispensing -> idle label:"[success]"
  dispensing -> dispenseFailed label:"[mechanicalError]"
  
  outOfStock -> idle label:"timeout"
  paymentFailed -> idle label:"timeout"
  dispenseFailed -> idle label:"acknowledged"
}
```

### Key Features

- **Multi-State Workflow**: Idle → Selecting → Processing → Dispensing
- **Guard Conditions**: `[paymentSuccess]`, `[productUnavailable]`, `[mechanicalError]`
- **Error Recovery**: Dedicated error states with timeout returns to idle
- **Inventory Management**: Automatic inventory update on successful dispense
- **Refund Logic**: Automatic refund initiated on dispense failure

### Happy Path Flow

```
Idle → Selecting → Processing → Dispensing → Idle
```

1. Customer presses select button
2. Customer confirms selection
3. Payment processed successfully
4. Product dispensed
5. Return to idle state

### Error Handling Paths

| Error Condition | State | Recovery |
|----------------|-------|----------|
| Product unavailable | Out of Stock | Timeout → Idle |
| Payment declined | Payment Failed | Timeout → Idle |
| Dispense jam | Dispense Failed | Acknowledged → Idle |

### State Actions Detail

**Dispensing State**:
- Entry: `openDispenser()`, `releaseProduct()`
- Do: `checkDispenseComplete()` (continuous monitoring)
- Exit: `closeDispenser()`, `updateInventory()`

This ensures product release, verification, and inventory tracking happen in correct sequence.

---

## Composite States Example

Hierarchical states with substates (order processing).

### DSL Code

```runiq
diagram "Order State Machine with Composite States" {
  
  shape initial as @initialState
  
  // Composite state (represented as a state with internal sequence)
  shape processing as @compositeState
    label:"Processing Order"
    entry:"startOrderProcessing()"
    exit:"completeProcessing()"

  // Internal processing sequence (flat representation)
  shape validating as @state label:"Validating" entry:"checkInventory()" exit:"saveValidation()"
  shape charging as @state label:"Charging Payment" entry:"authorizeCard()" exit:"savePayment()"
  shape preparing as @state label:"Preparing Shipment" entry:"generateLabel()" exit:"notifyWarehouse()"
  
  // Top-level states
  shape pending as @state 
    label:"Pending" 
    entry:"createOrderRecord()"
  
  shape shipped as @state 
    label:"Shipped" 
    entry:"updateTrackingInfo()" 
    doActivity:"monitorDelivery()"
  
  shape delivered as @state 
    label:"Delivered" 
    entry:"confirmDelivery() ; emailReceipt()"
  
  shape cancelled as @state 
    label:"Cancelled" 
    entry:"processRefund() ; notifyCustomer()"
  
  shape final as @finalState
  
  // Top-level transitions
  initial -> pending
  pending -> processing label:"paymentStarted"
  processing -> validating label:"startProcessing"
  validating -> charging label:"[valid]"
  charging -> preparing label:"[charged]"
  preparing -> shipped label:"processingComplete"
  processing -> cancelled label:"paymentFailed"
  
  shipped -> delivered label:"delivered"
  delivered -> final label:"acknowledged"
  
  // Cancellation from any state
  pending -> cancelled label:"customerCancel"
  shipped -> cancelled label:"returnRequested"
  
  cancelled -> final label:"refundCompleted"
}
```

### Key Features

- **Composite State**: `Processing Order` contains three substates
- **Hierarchical Structure**: Substates have their own initial state and transitions
- **Entry/Exit Actions**: Composite state entry runs before substate entry
- **Abstraction**: External states don't need to know internal processing details

### State Hierarchy

```
Processing Order (Composite)
  ├── Entry: startOrderProcessing()
  ├── Substates:
  │   ├── Validating
  │   ├── Charging Payment
  │   └── Preparing Shipment
  └── Exit: completeProcessing()
```

### Composite State Benefits

1. **Encapsulation**: Hide complex internal workflow
2. **Reusability**: Composite state can be reused in other diagrams
3. **Abstraction**: External transitions only to/from composite boundary
4. **Organization**: Group related substates logically

---

## History States Example

State machine that remembers previous state (media player).

### DSL Code

```runiq
diagram "Media Player with History" {
  
  shape initial as @initialState
  
  shape stopped as @state 
    label:"Stopped" 
    entry:"resetPlayhead()" 
    exit:"savePosition()"
  
  shape playing as @state 
    label:"Playing" 
    entry:"resumePlayback()" 
    doActivity:"streamAudio()" 
    exit:"pauseStream()"
  
  shape paused as @state 
    label:"Paused" 
    entry:"displayPauseIcon()" 
    exit:"hidePauseIcon()"
  
  // History state - remembers last active state
  shape hist as @historyShallow label:"H"
  
  // Volume adjustment composite state
  shape adjustingVolume as @compositeState 
    label:"Adjusting Volume"
  
  // Transitions
  initial -> stopped
  stopped -> playing label:"play"
  playing -> paused label:"pause"
  paused -> playing label:"resume"
  playing -> stopped label:"stop"
  paused -> stopped label:"stop"
  
  // History transition
  stopped -> hist label:"restoreLast"
  
  // Volume adjustment from any state
  playing -> adjustingVolume label:"volumeButton"
  paused -> adjustingVolume label:"volumeButton"
  adjustingVolume -> hist label:"volumeAdjusted"
}
```

### Key Features

- **History State** (`@historyState`): Represented by circle with "H"
- **State Memory**: Remembers which state (Playing or Paused) was active
- **Resume Capability**: Return to previous state after interruption
- **Interruption Handling**: Volume adjustment doesn't lose playback state

### History State Usage

When transitioning to history state:
1. System recalls last active state in that region
2. Transitions back to that state automatically
3. Useful for "restore last session" functionality

### Use Cases

- Media players (restore playing/paused state)
- Games (restore to gameplay after menu)
- Multi-step forms (return to last completed step)
- Interrupted workflows (resume where left off)

---

## Related Resources

- [State Machine Diagrams Guide](/guide/state-machine-diagrams) - Complete syntax reference with all features
- [UML State Machine Specification](https://www.omg.org/spec/UML/) - Official UML 2.5 statechart semantics
- [Diagram Profile](/guide/profiles#diagram-profile) - Overview of diagram capabilities

## State Machine Elements

### States

| Element | Shape | Description |
|---------|-------|-------------|
| Initial State | ● (filled circle) | Starting point of state machine |
| State | Rounded rectangle | Normal state with entry/do/exit |
| Final State | ⊙ (bull's-eye) | Terminal state, ends state machine |
| Composite State | Rounded rectangle with substates | Contains nested state machine |
| History State | ⊙H | Remembers last active substate |

### State Actions

States can have three types of actions:

```runiq
shape myState as @state 
  label:"State Name"
  entry:"executeOnEntry()"
  doActivity:"executeContinuously()"
  exit:"executeOnExit()"
```

1. **Entry**: Executed once when entering state
2. **Do Activity**: Runs continuously while in state
3. **Exit**: Executed once when leaving state

### Transitions

Transitions connect states and can have:

- **Event**: Trigger that causes transition (e.g., `buttonPressed`)
- **Guard**: Condition that must be true (e.g., `[balance > 0]`)
- **Action**: Behavior executed during transition (e.g., `/ deductAmount()`)

```runiq
stateA -> stateB label:"event [guard] / action"
```

### Guard Conditions

Use square brackets for conditions:

```runiq
processing -> success label:"[paymentApproved]"
processing -> failed label:"[paymentDeclined]"
```

## Best Practices

### State Design

1. **Single Responsibility**: Each state represents one distinct mode or condition
2. **Clear Names**: Use descriptive state names (Unlocked, Processing, Alarmed)
3. **Entry/Exit Actions**: Place initialization in entry, cleanup in exit
4. **Do Activities**: Use for continuous monitoring or streaming activities

### Transition Design

1. **Explicit Events**: Name events clearly (`lock`, `unlock`, `timeout`)
2. **Mutually Exclusive Guards**: Ensure only one transition can fire
3. **Complete Coverage**: All possible events should have transitions
4. **Self-Transitions**: Use for events that don't change state

### Composite States

Use composite states when:
- Multiple substates share common behavior
- Need to abstract internal complexity
- Want to group related states logically
- Implementing hierarchical state machines

### History States

Use history states for:
- Restoring user context after interruptions
- Multi-step wizards or forms
- Media playback applications
- Session restoration

### Common Patterns

#### 1. Timeout Pattern
```runiq
state1 -> state2 label:"timeout(30s)"
```

#### 2. Error Recovery Pattern
```runiq
normalState -> errorState label:"error"
errorState -> normalState label:"retry"
errorState -> failed label:"maxRetriesExceeded"
```

#### 3. Modal Behavior Pattern
```runiq
anyState -> modalState label:"openModal"
modalState -> historyState label:"closeModal"
```

#### 4. Initialization Pattern
```runiq
initial -> loadingState
loadingState -> readyState label:"[loadComplete]"
loadingState -> errorState label:"[loadFailed]"
```

## State Machine vs. Activity Diagram

| Feature | State Machine | Activity Diagram |
|---------|--------------|------------------|
| **Focus** | Object states over time | Workflow steps and processes |
| **Nodes** | States (modes of being) | Activities (things to do) |
| **Transitions** | Event-driven | Control flow, data flow |
| **Use Case** | Reactive systems, protocols | Business processes, algorithms |
| **Examples** | UI states, device modes | Order processing, CI/CD pipeline |

**When to use State Machine**:
- Modeling object lifecycle (Order: Pending → Processing → Shipped)
- Device controllers (Traffic light, thermostat)
- Protocol implementations (TCP state machine)
- UI component states (Button: enabled, disabled, focused)

**When to use Activity Diagram**:
- Business process workflows
- Algorithm flowcharts
- Multi-step procedures
- Parallel task execution
