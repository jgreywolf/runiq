import type {
  SequenceDurationConstraint,
  SequenceFragment,
  SequenceFragmentAlternative,
  SequenceMessage,
  SequenceNote,
  SequenceParticipant,
  SequenceProfile,
} from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

/**
 * Convert SequenceProfile from Langium AST to core format
 */
export function convertSequenceProfile(
  profile: Langium.SequenceProfile
): SequenceProfile {
  const sequenceProfile: SequenceProfile = {
    type: ProfileType.SEQUENCE,
    astVersion: '1.0',
    title: profile.name.replace(/^"|"$/g, ''),
    participants: [],
    messages: [],
  };

  // Process sequence statements
  for (const statement of profile.statements) {
    if (Langium.isSequenceParticipantStatement(statement)) {
      // participant "Actor" as actor
      const name = unescapeString(statement.name);
      const participant: SequenceParticipant = {
        id: name.toLowerCase().replace(/\s+/g, '_'), // Generate ID from name
        name: name,
        type: statement.type || 'entity', // Default to entity
      };
      sequenceProfile.participants.push(participant);
    } else if (Langium.isSequenceMessageStatement(statement)) {
      // message from:"Actor" to:"Web Server" label:"HTTP Request" type:sync activate:true
      const message: SequenceMessage = {
        from: '',
        to: '',
        label: '',
        type: 'sync', // Default
      };

      for (const prop of statement.properties) {
        if (Langium.isSequenceFromProperty(prop)) {
          const from = unescapeString(prop.from);
          // Preserve 'lost' and 'found' as-is for special message types
          message.from =
            from === 'lost' || from === 'found'
              ? from
              : from.toLowerCase().replace(/\s+/g, '_');
        } else if (Langium.isSequenceToProperty(prop)) {
          const to = unescapeString(prop.to);
          // Preserve 'lost' and 'found' as-is for special message types
          message.to =
            to === 'lost' || to === 'found'
              ? to
              : to.toLowerCase().replace(/\s+/g, '_');
        } else if (Langium.isSequenceLabelProperty(prop)) {
          message.label = unescapeString(prop.label);
        } else if (Langium.isSequenceTypeProperty(prop)) {
          message.type = prop.type as SequenceMessage['type'];
        } else if (Langium.isSequenceActivateProperty(prop)) {
          message.activate = prop.value === 'true';
        } else if (Langium.isSequenceGuardProperty(prop)) {
          message.guard = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isSequenceTimingProperty(prop)) {
          message.timing = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isSequenceStateInvariantProperty(prop)) {
          message.stateInvariant = prop.value.replace(/^"|"$/g, '');
        }
      }

      sequenceProfile.messages.push(message);
    } else if (Langium.isSequenceNoteStatement(statement)) {
      // note "This is a note" position:left participants:("Actor")
      if (!sequenceProfile.notes) sequenceProfile.notes = [];

      const note: SequenceNote = {
        text: statement.text.replace(/^"|"$/g, ''),
        position: 'left', // Default
        participants: [],
      };

      for (const prop of statement.properties) {
        if (Langium.isSequenceNotePositionProperty(prop)) {
          note.position = prop.position as SequenceNote['position'];
        } else if (Langium.isSequenceNoteParticipantsProperty(prop)) {
          note.participants = prop.participants.map((p) => {
            const name = unescapeString(p);
            return name.toLowerCase().replace(/\s+/g, '_');
          });
        }
      }

      sequenceProfile.notes.push(note);
    } else if (Langium.isSequenceFragmentStatement(statement)) {
      // fragment loop "Retry Logic" from:5 to:7
      if (!sequenceProfile.fragments) sequenceProfile.fragments = [];

      const fragment: SequenceFragment = {
        type: statement.type as SequenceFragment['type'],
        label: statement.label.replace(/^"|"$/g, ''),
        startAfterMessage: 0,
        endAfterMessage: 0,
      };

      for (const prop of statement.properties) {
        if (Langium.isSequenceFragmentFromProperty(prop)) {
          fragment.startAfterMessage = parseFloat(prop.from);
        } else if (Langium.isSequenceFragmentToProperty(prop)) {
          fragment.endAfterMessage = parseFloat(prop.to);
        } else if (Langium.isSequenceFragmentAlternativesProperty(prop)) {
          if (!fragment.alternatives) fragment.alternatives = [];
          for (const alt of prop.alternatives) {
            const alternative: SequenceFragmentAlternative = {
              label: alt.label.replace(/^"|"$/g, ''),
              startAfterMessage: parseFloat(alt.fromMsg),
              endAfterMessage: parseFloat(alt.toMsg),
            };
            fragment.alternatives.push(alternative);
          }
        } else if (Langium.isSequenceFragmentGatesProperty(prop)) {
          // UML 2.5 gates - connection points at fragment boundaries
          if (prop.gates) {
            fragment.gates = prop.gates.map((gate) =>
              gate.replace(/^"|"$/g, '')
            );
          }
        } else if (Langium.isSequenceFragmentReferenceProperty(prop)) {
          // UML 2.5 interaction use - reference to another sequence diagram
          fragment.reference = prop.ref.replace(/^"|"$/g, '');
        }
      }

      sequenceProfile.fragments.push(fragment);
    } else if (Langium.isSequenceDurationConstraintStatement(statement)) {
      // durationConstraint from:1 to:5 constraint:"< 100ms"
      if (!sequenceProfile.durationConstraints) {
        sequenceProfile.durationConstraints = [];
      }

      const durationConstraint: SequenceDurationConstraint = {
        fromMessage: 0,
        toMessage: 0,
        constraint: '',
      };

      for (const prop of statement.properties) {
        if (Langium.isSequenceDurationFromProperty(prop)) {
          durationConstraint.fromMessage = parseFloat(prop.from);
        } else if (Langium.isSequenceDurationToProperty(prop)) {
          durationConstraint.toMessage = parseFloat(prop.to);
        } else if (Langium.isSequenceDurationConstraintValueProperty(prop)) {
          durationConstraint.constraint = prop.constraint.replace(/^"|"$/g, '');
        }
      }

      sequenceProfile.durationConstraints.push(durationConstraint);
    }
  }

  return sequenceProfile;
}
