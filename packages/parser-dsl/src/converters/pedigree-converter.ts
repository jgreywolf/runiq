import type {
  PedigreeParentage,
  PedigreePerson,
  PedigreeProfile,
  PedigreeSpouse,
} from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

/**
 * Convert PedigreeProfile from Langium AST to core format
 */
export function convertPedigreeProfile(
  profile: Langium.PedigreeProfile
): PedigreeProfile {
  const pedigreeProfile: PedigreeProfile = {
    type: ProfileType.PEDIGREE,
    name: profile.name.replace(/^"|"$/g, ''),
    people: [],
    spouses: [],
    parentages: [],
  };

  const people = profile.peopleBlock?.people ?? [];
  for (const personDecl of people) {
    const person: PedigreePerson = {
      id: unescapeString(personDecl.id),
      name: unescapeString(personDecl.name),
    };

    for (const prop of personDecl.properties) {
      if (Langium.isPedigreePersonDobProperty(prop)) {
        person.dob = prop.dob.replace(/^"|"$/g, '');
      } else if (Langium.isPedigreePersonDodProperty(prop)) {
        person.dod = prop.dod.replace(/^"|"$/g, '');
      } else if (Langium.isPedigreePersonSexProperty(prop)) {
        person.sex = prop.sex as PedigreePerson['sex'];
      }
    }

    pedigreeProfile.people.push(person);
  }

  const families = profile.familiesBlock?.families ?? [];
  for (const family of families) {
    const parents = family.parents.map((parent) => unescapeString(parent));
    if (parents.length === 2) {
      const spouse: PedigreeSpouse = {
        left: parents[0],
        right: parents[1],
      };
      if (family.date) {
        spouse.date = family.date.replace(/^"|"$/g, '');
      }
      pedigreeProfile.spouses.push(spouse);
    }

    for (const childRef of family.children) {
      const modifier = childRef.modifier;
      const parentage: PedigreeParentage = {
        parents,
        child: unescapeString(childRef.id),
        type:
          modifier === 'adopt'
            ? 'adopted'
            : modifier === 'step'
              ? 'step'
              : 'biological',
      };
      pedigreeProfile.parentages.push(parentage);
    }
  }

  return pedigreeProfile;
}
