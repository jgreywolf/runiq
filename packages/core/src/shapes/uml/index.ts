// UML Shapes
export { classShape } from './class.js';
export { actorShape } from './actor.js';
export { systemBoundaryShape } from './systemBoundary.js';
export { interfaceShape } from './interface.js';
export { abstractShape } from './abstract.js';
export { enumShape } from './enum.js';
export { packageShape } from './package.js';
export { noteShape } from './note.js';
export { lifelineShape } from './lifeline.js';
export { activationShape } from './activation.js';
export { fragmentShape } from './fragment.js';
export { deletionShape } from './deletion.js';
export { continuationShape } from './sequence-continuation.js';
export { stateShape } from './state.js';
export { initialStateShape } from './initialState.js';
export { finalStateShape } from './finalState.js';
export { choiceShape } from './choice.js';
export { forkShape } from './fork.js';
export { joinShape } from './join.js';
export { activityShape } from './activity.js';
export {
  objectNodeShape,
  centralBufferShape,
  dataStoreShape,
} from './activity-object-nodes.js';
export { activityFinalShape, flowFinalShape } from './activity-final-nodes.js';
export { swimlaneShape } from './swimlane.js';
export { historyShallowShape, historyDeepShape } from './history-states.js';
export {
  junctionShape,
  entryPointShape,
  exitPointShape,
  terminateShape,
} from './state-pseudostates.js';
export { componentShape } from './component.js';
export { artifactShape } from './artifact.js';
export { nodeShape } from './node.js';
export {
  sendSignalShape,
  receiveSignalShape,
  acceptEventShape,
} from './activity-signal-shapes.js';

// UML Component Additions
export {
  portShape,
  moduleShape,
  templateShape,
  historyShape,
  pinShape,
  assemblyShape,
  providedInterfaceShape,
  requiredInterfaceShape,
  frameShape,
  collaborationShape,
  submachineShape,
  loopShape,
  verticalForkShape,
} from './component-additions.js';
