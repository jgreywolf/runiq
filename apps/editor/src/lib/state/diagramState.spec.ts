import { describe, it, expect, beforeEach } from 'vitest';
import { DiagramState } from './diagramState.svelte';
import type { DiagramProfile } from '@runiq/parser-dsl';

describe('DiagramState', () => {
	let diagramState: DiagramState;

	beforeEach(() => {
		diagramState = new DiagramState();
	});

	describe('Initialization', () => {
		it('should initialize with null profile', () => {
			expect(diagramState.profile).toBeNull();
		});

		it('should initialize with empty elements map', () => {
			expect(diagramState.elements.size).toBe(0);
		});

		it('should initialize with empty code', () => {
			expect(diagramState.code).toBe('');
		});

		it('should initialize with empty data content', () => {
			expect(diagramState.dataContent).toBe('');
		});

		it('should initialize with no errors', () => {
			expect(diagramState.errors).toEqual([]);
		});

		it('should initialize with no warnings', () => {
			expect(diagramState.warnings).toEqual([]);
		});
	});

	describe('Profile Management', () => {
		it('should set diagram profile', () => {
			const mockProfile = { name: 'test-profile' } as DiagramProfile;
			diagramState.setProfile(mockProfile);
			expect(diagramState.profile).toBe(mockProfile);
		});

		it('should update profile', () => {
			const profile1 = { name: 'profile-1' } as DiagramProfile;
			const profile2 = { name: 'profile-2' } as DiagramProfile;
			diagramState.setProfile(profile1);
			diagramState.setProfile(profile2);
			expect(diagramState.profile).toBe(profile2);
		});

		it('should clear profile', () => {
			const mockProfile = { name: 'test-profile' } as DiagramProfile;
			diagramState.setProfile(mockProfile);
			diagramState.clearProfile();
			expect(diagramState.profile).toBeNull();
		});

		it('should report hasProfile as false when null', () => {
			expect(diagramState.hasProfile).toBe(false);
		});

		it('should report hasProfile as true when set', () => {
			const mockProfile = { name: 'test-profile' } as DiagramProfile;
			diagramState.setProfile(mockProfile);
			expect(diagramState.hasProfile).toBe(true);
		});
	});

	describe('Element Management', () => {
		it('should add element', () => {
			const element = {
				id: 'node1',
				type: 'node' as const,
				label: 'Test Node'
			};
			diagramState.addElement(element);
			expect(diagramState.elements.has('node1')).toBe(true);
			expect(diagramState.elements.get('node1')).toEqual(element);
		});

		it('should add multiple elements', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.addElement({ id: 'node2', type: 'node' as const });
			expect(diagramState.elements.size).toBe(2);
		});

		it('should replace element with same ID', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const, label: 'Old' });
			diagramState.addElement({ id: 'node1', type: 'node' as const, label: 'New' });
			expect(diagramState.elements.size).toBe(1);
			expect(diagramState.elements.get('node1')?.label).toBe('New');
		});

		it('should update element properties', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const, label: 'Old' });
			diagramState.updateElement('node1', { label: 'Updated' });
			expect(diagramState.elements.get('node1')?.label).toBe('Updated');
		});

		it('should not throw when updating non-existent element', () => {
			expect(() => {
				diagramState.updateElement('nonexistent', { label: 'Test' });
			}).not.toThrow();
		});

		it('should delete element', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.addElement({ id: 'node2', type: 'node' as const });
			diagramState.deleteElement('node1');
			expect(diagramState.elements.has('node1')).toBe(false);
			expect(diagramState.elements.has('node2')).toBe(true);
		});

		it('should delete multiple elements', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.addElement({ id: 'node2', type: 'node' as const });
			diagramState.addElement({ id: 'node3', type: 'node' as const });
			diagramState.deleteElements(['node1', 'node3']);
			expect(diagramState.elements.has('node1')).toBe(false);
			expect(diagramState.elements.has('node2')).toBe(true);
			expect(diagramState.elements.has('node3')).toBe(false);
		});

		it('should get element by ID', () => {
			const element = { id: 'node1', type: 'node' as const, label: 'Test' };
			diagramState.addElement(element);
			expect(diagramState.getElement('node1')).toEqual(element);
		});

		it('should return undefined for non-existent element', () => {
			expect(diagramState.getElement('nonexistent')).toBeUndefined();
		});

		it('should check if element exists', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			expect(diagramState.hasElement('node1')).toBe(true);
			expect(diagramState.hasElement('node2')).toBe(false);
		});

		it('should clear all elements', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.addElement({ id: 'node2', type: 'node' as const });
			diagramState.clearElements();
			expect(diagramState.elements.size).toBe(0);
		});
	});

	describe('Derived State', () => {
		it('should derive element array from map', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.addElement({ id: 'node2', type: 'node' as const });
			const array = diagramState.elementArray;
			expect(array.length).toBe(2);
			expect(array.some((e) => e.id === 'node1')).toBe(true);
			expect(array.some((e) => e.id === 'node2')).toBe(true);
		});

		it('should report hasElements as false when empty', () => {
			expect(diagramState.hasElements).toBe(false);
		});

		it('should report hasElements as true when not empty', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			expect(diagramState.hasElements).toBe(true);
		});

		it('should count elements', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.addElement({ id: 'node2', type: 'node' as const });
			expect(diagramState.elementCount).toBe(2);
		});

		it('should filter nodes', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.addElement({ id: 'edge1', type: 'edge' as const });
			diagramState.addElement({ id: 'node2', type: 'node' as const });
			const nodes = diagramState.nodes;
			expect(nodes.length).toBe(2);
			expect(nodes.every((n) => n.type === 'node')).toBe(true);
		});

		it('should filter edges', () => {
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.addElement({ id: 'edge1', type: 'edge' as const });
			diagramState.addElement({ id: 'edge2', type: 'edge' as const });
			const edges = diagramState.edges;
			expect(edges.length).toBe(2);
			expect(edges.every((e) => e.type === 'edge')).toBe(true);
		});
	});

	describe('Code Management', () => {
		it('should set code', () => {
			const code = 'shape box1 as @rect';
			diagramState.setCode(code);
			expect(diagramState.code).toBe(code);
		});

		it('should update code', () => {
			diagramState.setCode('old code');
			diagramState.setCode('new code');
			expect(diagramState.code).toBe('new code');
		});

		it('should clear code', () => {
			diagramState.setCode('some code');
			diagramState.clearCode();
			expect(diagramState.code).toBe('');
		});
	});

	describe('Data Content Management', () => {
		it('should set data content', () => {
			const data = '{"key": "value"}';
			diagramState.setDataContent(data);
			expect(diagramState.dataContent).toBe(data);
		});

		it('should clear data content', () => {
			diagramState.setDataContent('some data');
			diagramState.clearDataContent();
			expect(diagramState.dataContent).toBe('');
		});
	});

	describe('Error Management', () => {
		it('should set errors', () => {
			const errors = ['Error 1', 'Error 2'];
			diagramState.setErrors(errors);
			expect(diagramState.errors).toEqual(errors);
		});

		it('should add single error', () => {
			diagramState.addError('Error 1');
			expect(diagramState.errors).toEqual(['Error 1']);
		});

		it('should add multiple errors', () => {
			diagramState.addError('Error 1');
			diagramState.addError('Error 2');
			expect(diagramState.errors).toEqual(['Error 1', 'Error 2']);
		});

		it('should clear errors', () => {
			diagramState.setErrors(['Error 1', 'Error 2']);
			diagramState.clearErrors();
			expect(diagramState.errors).toEqual([]);
		});

		it('should report hasErrors as false when empty', () => {
			expect(diagramState.hasErrors).toBe(false);
		});

		it('should report hasErrors as true when not empty', () => {
			diagramState.addError('Error');
			expect(diagramState.hasErrors).toBe(true);
		});
	});

	describe('Warning Management', () => {
		it('should set warnings', () => {
			const warnings = ['Warning 1', 'Warning 2'];
			diagramState.setWarnings(warnings);
			expect(diagramState.warnings).toEqual(warnings);
		});

		it('should add single warning', () => {
			diagramState.addWarning('Warning 1');
			expect(diagramState.warnings).toEqual(['Warning 1']);
		});

		it('should clear warnings', () => {
			diagramState.setWarnings(['Warning 1', 'Warning 2']);
			diagramState.clearWarnings();
			expect(diagramState.warnings).toEqual([]);
		});

		it('should report hasWarnings as false when empty', () => {
			expect(diagramState.hasWarnings).toBe(false);
		});

		it('should report hasWarnings as true when not empty', () => {
			diagramState.addWarning('Warning');
			expect(diagramState.hasWarnings).toBe(true);
		});
	});

	describe('Clear All', () => {
		it('should clear all diagram state', () => {
			const mockProfile = { name: 'test' } as DiagramProfile;
			diagramState.setProfile(mockProfile);
			diagramState.addElement({ id: 'node1', type: 'node' as const });
			diagramState.setCode('some code');
			diagramState.setDataContent('some data');
			diagramState.setErrors(['error']);
			diagramState.setWarnings(['warning']);

			diagramState.clearAll();

			expect(diagramState.profile).toBeNull();
			expect(diagramState.elements.size).toBe(0);
			expect(diagramState.code).toBe('');
			expect(diagramState.dataContent).toBe('');
			expect(diagramState.errors).toEqual([]);
			expect(diagramState.warnings).toEqual([]);
		});
	});
});
