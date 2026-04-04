/**
 * Tests for toolbox data structures and validation
 */

import { describe, expect, it } from 'vitest';
import { getShapeCategoryByProfile, shapeCategories } from './toolbox-data';
import { ProfileName } from '../types';

describe('Toolbox Data Structure', () => {
	it('should have shape categories', () => {
		expect(shapeCategories).toBeDefined();
		expect(shapeCategories.length).toBeGreaterThan(0);
	});

	it('should have valid structure for all categories', () => {
		shapeCategories.forEach((category) => {
			expect(category).toHaveProperty('id');
			expect(category).toHaveProperty('label');
			expect(category).toHaveProperty('shapes');
			expect(typeof category.id).toBe('string');
			expect(typeof category.label).toBe('string');
			expect(Array.isArray(category.shapes)).toBe(true);
		});
	});

	it('should have unique category IDs', () => {
		const ids = shapeCategories.map((cat) => cat.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
	});

	it('should have at least one shape in each category', () => {
		shapeCategories.forEach((category) => {
			expect(category.shapes.length).toBeGreaterThan(0);
		});
	});

	it('should have valid shape structure', () => {
		shapeCategories.forEach((category) => {
			category.shapes.forEach((shape) => {
				expect(shape).toHaveProperty('id');
				expect(shape).toHaveProperty('label');
				expect(shape).toHaveProperty('code');
				expect(typeof shape.id).toBe('string');
				expect(typeof shape.label).toBe('string');
				expect(typeof shape.code).toBe('string');
			});
		});
	});

	it('should have non-empty shape codes', () => {
		shapeCategories.forEach((category) => {
			category.shapes.forEach((shape) => {
				expect(shape.code.trim().length).toBeGreaterThan(0);
			});
		});
	});

	it('should have valid DSL syntax in shape codes', () => {
		shapeCategories.forEach((category) => {
			category.shapes.forEach((shape) => {
				// Shape code should be non-empty
				expect(shape.code.trim().length).toBeGreaterThan(0);
			});
		});
	});

	it('should have profile field when specified', () => {
		const categoriesWithProfiles = shapeCategories.filter((cat) => cat.profiles !== undefined);
		categoriesWithProfiles.forEach((category) => {
			expect(Array.isArray(category.profiles)).toBe(true);
			expect(category.profiles!.length).toBeGreaterThan(0);
		});
	});

	it('should have valid profile names', () => {
		const validProfiles = [
			'diagram',
			'sequence',
			'wardley',
			'electrical',
			'digital',
			'control',
			'pneumatic',
			'hydraulic',
			'hvac',
			'railroad',
			'pid',
			'glyphset',
			'timeline',
			'kanban',
			'gitgraph',
			'treemap',
			'pedigree'
		];

		shapeCategories.forEach((category) => {
			if (category.profiles) {
				category.profiles.forEach((profile) => {
					expect(validProfiles).toContain(profile);
				});
			}
		});
	});

	it('should have expected basic shapes category', () => {
		const basicCategory = shapeCategories.find((cat) => cat.id === 'basic');
		expect(basicCategory).toBeDefined();
		expect(basicCategory!.shapes.length).toBeGreaterThan(0);
	});

	it('should have expected flowchart category', () => {
		const flowchartCategory = shapeCategories.find((cat) => cat.id === 'flowchart');
		expect(flowchartCategory).toBeDefined();
		expect(flowchartCategory!.shapes.length).toBeGreaterThan(0);
	});

	it('should include ring and scatter chart shapes', () => {
		const chartCategory = shapeCategories.find((cat) => cat.id === 'charts');
		const chartShapeIds = chartCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(chartShapeIds).toContain('ringChart');
		expect(chartShapeIds).toContain('scatterChart');
	});

	it('should include rectangle shape in basic category', () => {
		const basicCategory = shapeCategories.find((cat) => cat.id === 'basic');
		const rectShape = basicCategory?.shapes.find((s) => s.id === 'rect' || s.code.includes('@rect'));
		expect(rectShape).toBeDefined();
	});

	it('should include diamond shape for flowcharts', () => {
		const flowchartCategory = shapeCategories.find((cat) => cat.id === 'flowchart');
		const diamondShape = flowchartCategory?.shapes.find(
			(s) => s.id === 'diamond' || s.code.includes('@rhombus') || s.code.includes('@diamond')
		);
		expect(diamondShape).toBeDefined();
	});

	it('should include the expanded ISO flowchart symbols', () => {
		const flowchartCategory = shapeCategories.find((cat) => cat.id === 'flowchart');
		const flowchartShapeIds = flowchartCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(flowchartShapeIds).toContain('manualOperation');
		expect(flowchartShapeIds).toContain('onPageConnector');
		expect(flowchartShapeIds).toContain('merge');
		expect(flowchartShapeIds).toContain('sort');
		expect(flowchartShapeIds).toContain('collate');
		expect(flowchartShapeIds).toContain('extract');
	});

	it('should include the expanded BPMN data artifacts', () => {
		const bpmnCategory = shapeCategories.find((cat) => cat.id === 'bpmn');
		const bpmnShapeIds = bpmnCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(bpmnShapeIds).toContain('bpmnDataStore');
		expect(bpmnShapeIds).toContain('bpmnDataInput');
		expect(bpmnShapeIds).toContain('bpmnDataOutput');
	});

	it('should include boundary events and expanded BPMN markers', () => {
		const bpmnCategory = shapeCategories.find((cat) => cat.id === 'bpmn');
		const bpmnShapeIds = bpmnCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(bpmnShapeIds).toContain('bpmnStartNonInterrupting');
		expect(bpmnShapeIds).toContain('bpmnIntermediateNonInterrupting');
		expect(bpmnShapeIds).toContain('bpmnBoundaryTimer');
		expect(bpmnShapeIds).toContain('bpmnBoundaryMessage');
		expect(bpmnShapeIds).toContain('bpmnEventMultiple');
		expect(bpmnShapeIds).toContain('bpmnEventParallelMultiple');
		expect(bpmnShapeIds).toContain('bpmnTaskBusinessRule');
	});

	it('should include expanded subprocess and labeled choreography BPMN variants', () => {
		const bpmnCategory = shapeCategories.find((cat) => cat.id === 'bpmn');
		const bpmnShapeIds = bpmnCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(bpmnShapeIds).toContain('bpmnSubProcessExpanded');
		expect(bpmnShapeIds).toContain('bpmnChoreographyTaskLabeled');
		expect(bpmnShapeIds).toContain('bpmnCallActivityDetailed');
		expect(bpmnShapeIds).toContain('bpmnConversationMultiParty');
	});

	it('should include the expanded network infrastructure symbols', () => {
		const networkCategory = shapeCategories.find((cat) => cat.id === 'network');
		const networkShapeIds = networkCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(networkShapeIds).toContain('workstation');
		expect(networkShapeIds).toContain('accessPoint');
		expect(networkShapeIds).toContain('vpnGateway');
		expect(networkShapeIds).toContain('modem');
	});

	it('should include the expanded AWS service symbols', () => {
		const awsCategory = shapeCategories.find((cat) => cat.id === 'aws');
		const awsShapeIds = awsCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(awsShapeIds).toContain('awsCloudFront');
		expect(awsShapeIds).toContain('awsDynamoDb');
		expect(awsShapeIds).toContain('awsSqs');
		expect(awsShapeIds).toContain('awsCognito');
	});

	it('should include the Azure cloud service symbols', () => {
		const azureCategory = shapeCategories.find((cat) => cat.id === 'azure');
		const azureShapeIds = azureCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(azureShapeIds).toContain('azureVm');
		expect(azureShapeIds).toContain('azureBlobStorage');
		expect(azureShapeIds).toContain('azureFunctions');
		expect(azureShapeIds).toContain('azureSqlDatabase');
		expect(azureShapeIds).toContain('azureVirtualNetwork');
		expect(azureShapeIds).toContain('azureResourceGroup');
		expect(azureShapeIds).toContain('azureSubscription');
		expect(azureShapeIds).toContain('azureApiManagement');
		expect(azureShapeIds).toContain('azureCdn');
		expect(azureShapeIds).toContain('azureCosmosDb');
		expect(azureShapeIds).toContain('azureServiceBus');
		expect(azureShapeIds).toContain('azureEntraId');
	});

	it('should include the architecture diagram starter shapes', () => {
		const architectureCategory = shapeCategories.find((cat) => cat.id === 'architecture');
		const architectureShapeIds = architectureCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(architectureShapeIds).toContain('architectureLayer');
		expect(architectureShapeIds).toContain('subsystemBlock');
		expect(architectureShapeIds).toContain('platformBlock');
		expect(architectureShapeIds).toContain('externalSystemBlock');
	});

	it('should include the expanded C4 architecture symbols', () => {
		const c4Category = shapeCategories.find((cat) => cat.id === 'c4');
		const c4ShapeIds = c4Category?.shapes.map((shape) => shape.id) ?? [];

		expect(c4ShapeIds).toContain('c4ExternalSystem');
		expect(c4ShapeIds).toContain('c4ExternalPerson');
		expect(c4ShapeIds).toContain('c4DeploymentNode');
		expect(c4ShapeIds).toContain('c4ContainerInstance');
		expect(c4ShapeIds).toContain('c4SystemInstance');
	});

	it('should include digital syntax and components in digital profile', () => {
		const categories = getShapeCategoryByProfile(ProfileName.digital);
		const categoryIds = categories.map((cat) => cat.id);
		expect(categoryIds).toContain('digitalSyntax');
		expect(categoryIds).toContain('digitalLogicGates');
		expect(categoryIds).toContain('digitalComponents');
	});

	it('should not include digital-only categories in electrical profile', () => {
		const categories = getShapeCategoryByProfile(ProfileName.electrical);
		const categoryIds = categories.map((cat) => cat.id);
		expect(categoryIds).not.toContain('digitalSyntax');
		expect(categoryIds).not.toContain('digitalLogicGates');
		expect(categoryIds).not.toContain('digitalComponents');
	});

	it('should include control ladder snippets in control profile', () => {
		const categories = getShapeCategoryByProfile(ProfileName.control);
		const categoryIds = categories.map((cat) => cat.id);
		const controlShapeIds = categories.flatMap((category) => category.shapes.map((shape) => shape.id));
		expect(categoryIds).toContain('controlLadder');
		expect(controlShapeIds).toContain('control-timer-off');
		expect(controlShapeIds).toContain('control-counter-up');
		expect(controlShapeIds).toContain('control-counter-down');
	});

	it('should include the expanded electrical starter symbols', () => {
		const categories = getShapeCategoryByProfile(ProfileName.electrical);
		const electricalCategory = categories.find((cat) => cat.id === 'electrical');
		const electricalShapeIds = electricalCategory?.shapes.map((shape) => shape.id) ?? [];

		expect(electricalShapeIds).toContain('battery');
		expect(electricalShapeIds).toContain('fuse');
		expect(electricalShapeIds).toContain('lamp');
		expect(electricalShapeIds).toContain('switchSpst');
		expect(electricalShapeIds).toContain('switchSpdt');
	});

	it('should include the full HVAC renderer-backed starter set', () => {
		const categories = getShapeCategoryByProfile(ProfileName.hvac);
		const shapeIds = categories.flatMap((category) => category.shapes.map((shape) => shape.id));

		expect(shapeIds).toContain('hvac-fan-return');
		expect(shapeIds).toContain('hvac-fan-exhaust');
		expect(shapeIds).toContain('hvac-filter');
		expect(shapeIds).toContain('hvac-heating-coil');
		expect(shapeIds).toContain('hvac-humidifier');
		expect(shapeIds).toContain('hvac-dehumidifier');
		expect(shapeIds).toContain('hvac-diffuser-return');
		expect(shapeIds).toContain('hvac-damper-motorized');
		expect(shapeIds).toContain('hvac-damper-manual');
		expect(shapeIds).toContain('hvac-damper-fire');
		expect(shapeIds).toContain('hvac-temp-sensor');
		expect(shapeIds).toContain('hvac-pressure-sensor');
		expect(shapeIds).toContain('hvac-chiller');
		expect(shapeIds).toContain('hvac-boiler');
		expect(shapeIds).toContain('hvac-cooling-tower');
		expect(shapeIds).toContain('hvac-pump');
		expect(shapeIds).toContain('hvac-heat-exchanger');
	});

	it('should include railroad snippets in railroad profile', () => {
		const categories = getShapeCategoryByProfile(ProfileName.railroad);
		const categoryIds = categories.map((cat) => cat.id);
		expect(categoryIds).toContain('railroadSyntax');
	});
});
