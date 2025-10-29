# Sequence Diagram Examples

This directory contains example sequence diagrams demonstrating various UML sequence diagram patterns and Runiq syntax.

## Examples

### 1. Basic Authentication (`auth-flow.runiq`)
Demonstrates:
- Participant types (actor, entity, control, database)
- Synchronous messages
- Return messages
- Activation boxes
- Simple notes

### 2. API Error Handling (`api-error-handling.runiq`)
Demonstrates:
- Alt fragments (alternative paths)
- Multiple alternatives (success/failure)
- Notes spanning multiple participants

### 3. Retry Loop (`retry-loop.runiq`)
Demonstrates:
- Loop fragments
- Transaction patterns
- Database interactions
- Side notes

### 4. Async Messaging (`async-messaging.runiq`)
Demonstrates:
- Asynchronous messages (dashed arrows)
- Event-driven architecture
- Independent message processing
- Self-messages

### 5. Object Lifecycle (`object-lifecycle.runiq`)
Demonstrates:
- Create messages (object instantiation)
- Destroy messages (object deletion)
- Resource management patterns
- Lifecycle documentation

## Syntax Reference

### Participant Declaration

```runiq
participant "Display Name" as type
```

**Participant Types:**
- `actor` - Human user or external system
- `entity` - Business entity or data object
- `boundary` - System boundary (UI, API Gateway)
- `control` - Controller or service logic
- `database` - Database or data store

### Message Syntax

```runiq
message from:"Source" to:"Target" label:"Message text" type:sync activate:true
```

**Message Properties:**
- `from:"name"` - Source participant (required)
- `to:"name"` - Target participant (required)
- `label:"text"` - Message label (required)
- `type:value` - Message type (optional, default: `sync`)
  - `sync` - Synchronous call (solid arrow)
  - `async` - Asynchronous message (dashed arrow)
  - `return` - Return value (dashed arrow, open head)
  - `create` - Object creation
  - `destroy` - Object destruction
- `activate:true` - Show activation box on target (optional)

### Note Syntax

```runiq
note "Note text" position:left participants:("Participant1")
note "Spanning note" position:over participants:("Participant1","Participant2")
```

**Note Properties:**
- Text content (required)
- `position:value` - Position relative to participants
  - `left` - Left of participant
  - `right` - Right of participant
  - `over` - Over participant(s)
- `participants:("P1","P2")` - Participant references (required)

### Fragment Syntax

```runiq
// Loop fragment
fragment loop "Condition" from:2 to:5

// Alt fragment with alternatives
fragment alt "Decision" from:10 to:15 alternatives:("Success":10..12,"Failure":13..15)
```

**Fragment Types:**
- `loop` - Repeated execution
- `alt` - Alternative paths (if/else)
- `opt` - Optional execution
- `par` - Parallel execution
- `critical` - Critical section
- `break` - Break from loop

**Fragment Properties:**
- `from:N` - Starting message index
- `to:N` - Ending message index
- `alternatives:()` - For alt fragments only, defines alternative paths

## Best Practices

1. **Participant Naming**: Use descriptive names that clearly identify the role
2. **Message Labels**: Use action verbs ("Validate login", "Query user")
3. **Activation Boxes**: Use sparingly to show important execution contexts
4. **Notes**: Add clarifying information about complex logic
5. **Fragments**: Use to group related messages and show control flow
6. **Alt Fragments**: Always provide clear condition labels for each alternative
7. **Loop Fragments**: Include iteration condition in the label

## Rendering

To render these examples to SVG:

```bash
# Using CLI
pnpm cli parse examples/sequence/auth-flow.runiq > output/auth-flow.svg

# Using programmatic API
import { parse } from '@runiq/parser-dsl';
import { renderSequenceDiagram } from '@runiq/renderer-svg';

const result = parse(sourceCode);
const profile = result.document.profiles[0];
const rendered = renderSequenceDiagram(profile);
```

## Tips

- **Message Order**: Messages are processed in the order they appear in the file
- **Participant IDs**: Generated automatically from display names (lowercase, underscores)
- **Message Indices**: Start from 0 for fragment references
- **Fragment Nesting**: Currently not supported (coming soon)
- **Self-Messages**: Use same participant for `from` and `to`

## Future Enhancements

- Nested fragments
- Participant destruction visualization
- Time constraints
- State invariants
- Interaction use (sub-sequences)
- Continuation markers
