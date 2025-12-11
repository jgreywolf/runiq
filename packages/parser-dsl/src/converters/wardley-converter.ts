import type { WardleyProfile } from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';
import type { WardleyComponent, WardleyDependency, WardleyAnchor, WardleyEvolution } from '@runiq/core';

/**
 * Convert WardleyProfile from Langium AST to core format
 */
export function convertWardleyProfile(
  profile: Langium.WardleyProfile
): WardleyProfile {
  const wardleyProfile: WardleyProfile = {
    type: ProfileType.WARDLEY,
    astVersion: '1.0',
    name: profile.name.replace(/^"|"$/g, ''),
    components: [],
    dependencies: [],
  };

  // Process Wardley statements
  for (const statement of profile.statements) {
    if (Langium.isWardleyComponentStatement(statement)) {
      // component "Customer" evolution:0.8 value:0.9
      const component: WardleyComponent = {
        name: statement.name.replace(/^"|"$/g, ''),
        evolution: 0.5, // Default
        value: 0.5, // Default
      };

      for (const prop of statement.properties) {
        if (Langium.isWardleyEvolutionProperty(prop)) {
          component.evolution = parseFloat(prop.value);
        } else if (Langium.isWardleyValueProperty(prop)) {
          component.value = parseFloat(prop.value);
        } else if (Langium.isWardleyLabelProperty(prop)) {
          component.label = unescapeString(prop.value);
        } else if (Langium.isWardleyInertiaProperty(prop)) {
          component.inertia = prop.value === 'true';
        }
      }

      wardleyProfile.components.push(component);
    } else if (Langium.isWardleyDependencyStatement(statement)) {
      // dependency from:"Customer" to:"Cup of Tea"
      const dependency: WardleyDependency = {
        from: statement.from.replace(/^"|"$/g, ''),
        to: statement.to.replace(/^"|"$/g, ''),
      };
      wardleyProfile.dependencies.push(dependency);
    } else if (Langium.isWardleyAnchorStatement(statement)) {
      // anchor "User Need" value:0.95
      if (!wardleyProfile.anchors) wardleyProfile.anchors = [];
      const anchor: WardleyAnchor = {
        name: statement.name.replace(/^"|"$/g, ''),
        value: 0.9, // Default
      };

      for (const prop of statement.properties) {
        if (Langium.isWardleyValueProperty(prop)) {
          anchor.value = parseFloat(prop.value);
        } else if (Langium.isWardleyEvolutionProperty(prop)) {
          anchor.evolution = parseFloat(prop.value);
        }
      }

      wardleyProfile.anchors.push(anchor);
    } else if (Langium.isWardleyEvolutionStatement(statement)) {
      // evolve "Legacy System" to evolution:0.7
      if (!wardleyProfile.evolutions) wardleyProfile.evolutions = [];
      const evolution: WardleyEvolution = {
        component: statement.component.replace(/^"|"$/g, ''),
        toEvolution: 0.5, // Default
      };

      for (const prop of statement.properties) {
        if (Langium.isWardleyEvolutionProperty(prop)) {
          evolution.toEvolution = parseFloat(prop.value);
        }
      }

      wardleyProfile.evolutions.push(evolution);
    }
  }

  return wardleyProfile;
}
