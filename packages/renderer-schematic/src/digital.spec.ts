import { describe, expect, it } from 'vitest';
import { renderDigital } from './index.js';
import type { DigitalProfile } from '@runiq/core';

describe('Digital Renderer', () => {
	it('should render digital instances using gate symbols', () => {
		const profile: DigitalProfile = {
			type: 'digital',
			name: 'Digital Gates',
			modules: [],
			nets: [{ name: 'A' }, { name: 'B' }, { name: 'Y' }],
			instances: [
				{
					ref: 'U1',
					of: 'AND',
					portMap: { A: 'A', B: 'B', Y: 'Y' }
				}
			]
		};

		const result = renderDigital(profile);
		expect(result.svg).toContain('<svg');
		expect(result.svg).toContain('data-ref="U1"');
		expect(result.warnings).toHaveLength(0);
	});

	it('should honor symbol override params for custom modules', () => {
		const profile: DigitalProfile = {
			type: 'digital',
			name: 'Symbol Override',
			modules: [],
			nets: [{ name: 'A' }, { name: 'B' }, { name: 'Y' }],
			instances: [
				{
					ref: 'U_CUSTOM',
					of: 'CustomBlock',
					portMap: { A: 'A', B: 'B', Y: 'Y' },
					paramMap: { symbol: 'AND' }
				}
			]
		};

		const result = renderDigital(profile);
		expect(result.svg).toContain('data-ref="U_CUSTOM"');
		expect(result.warnings).toHaveLength(0);
	});

	it('should return a placeholder when no instances exist', () => {
		const profile: DigitalProfile = {
			type: 'digital',
			name: 'Empty Digital',
			modules: [
				{
					name: 'ModuleOnly',
					ports: [{ name: 'clk', dir: 'input' }]
				}
			],
			nets: [],
			instances: []
		};

		const result = renderDigital(profile);
		expect(result.svg).toContain('No instances to render.');
		expect(result.warnings).toHaveLength(0);
	});
});
