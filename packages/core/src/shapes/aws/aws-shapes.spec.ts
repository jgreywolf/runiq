import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types.js';
import { awsEc2Shape } from './ec2.js';
import { awsS3Shape } from './s3.js';
import { awsLambdaShape } from './lambda.js';
import { awsRdsShape } from './rds.js';
import { awsVpcShape } from './vpc.js';
import { awsApiGatewayShape } from './apiGateway.js';

function createMockContext(
	label: string = '',
	data: Record<string, unknown> = {}
): ShapeRenderContext {
	return {
		node: {
			id: 'test-node',
			shape: '@test',
			label,
			data
		},
		style: {
			padding: 12,
			fontSize: 14,
			fontFamily: 'Arial'
		},
		measureText: (text: string) => ({
			width: text.length * 8,
			height: 16
		})
	};
}

describe('AWS Cloud Shapes', () => {
	describe('awsEc2', () => {
		it('should have correct shape id', () => {
			expect(awsEc2Shape.id).toBe('awsEc2');
		});

		it('should calculate bounds with label', () => {
			const ctx = createMockContext('Web Server');
			const bounds = awsEc2Shape.bounds(ctx);

			expect(bounds.width).toBeGreaterThan(0);
			expect(bounds.height).toBeGreaterThan(0);
		});

		it('should have 4 anchor points', () => {
			const ctx = createMockContext('Instance');
			const anchors = awsEc2Shape.anchors(ctx);

			expect(anchors).toHaveLength(4);
		});

		it('should render EC2 cube icon', () => {
			const ctx = createMockContext('t3.micro');
			const svg = awsEc2Shape.render(ctx, { x: 0, y: 0 });

			expect(svg).toContain('t3.micro');
			// Should have cube/box representation
		});
	});

	describe('awsS3', () => {
		it('should have correct shape id', () => {
			expect(awsS3Shape.id).toBe('awsS3');
		});

		it('should calculate bounds with label', () => {
			const ctx = createMockContext('my-bucket');
			const bounds = awsS3Shape.bounds(ctx);

			expect(bounds.width).toBeGreaterThan(0);
			expect(bounds.height).toBeGreaterThan(0);
		});

		it('should have 4 anchor points', () => {
			const ctx = createMockContext('Bucket');
			const anchors = awsS3Shape.anchors(ctx);

			expect(anchors).toHaveLength(4);
		});

		it('should render S3 bucket icon', () => {
			const ctx = createMockContext('assets-bucket');
			const svg = awsS3Shape.render(ctx, { x: 0, y: 0 });

			expect(svg).toContain('assets-bucket');
			// Should have bucket/cylinder representation
		});
	});

	describe('awsLambda', () => {
		it('should have correct shape id', () => {
			expect(awsLambdaShape.id).toBe('awsLambda');
		});

		it('should calculate bounds with label', () => {
			const ctx = createMockContext('ProcessOrder');
			const bounds = awsLambdaShape.bounds(ctx);

			expect(bounds.width).toBeGreaterThan(0);
			expect(bounds.height).toBeGreaterThan(0);
		});

		it('should have 4 anchor points', () => {
			const ctx = createMockContext('Function');
			const anchors = awsLambdaShape.anchors(ctx);

			expect(anchors).toHaveLength(4);
		});

		it('should render Lambda λ symbol', () => {
			const ctx = createMockContext('Handler');
			const svg = awsLambdaShape.render(ctx, { x: 0, y: 0 });

			expect(svg).toContain('Handler');
			expect(svg).toContain('λ'); // Lambda symbol
		});
	});

	describe('awsRds', () => {
		it('should have correct shape id', () => {
			expect(awsRdsShape.id).toBe('awsRds');
		});

		it('should calculate bounds with label', () => {
			const ctx = createMockContext('PostgreSQL');
			const bounds = awsRdsShape.bounds(ctx);

			expect(bounds.width).toBeGreaterThan(0);
			expect(bounds.height).toBeGreaterThan(0);
		});

		it('should have 4 anchor points', () => {
			const ctx = createMockContext('Database');
			const anchors = awsRdsShape.anchors(ctx);

			expect(anchors).toHaveLength(4);
		});

		it('should render RDS database icon', () => {
			const ctx = createMockContext('prod-db');
			const svg = awsRdsShape.render(ctx, { x: 0, y: 0 });

			expect(svg).toContain('prod-db');
			// Should have cylinder/database representation
		});
	});

	describe('awsVpc', () => {
		it('should have correct shape id', () => {
			expect(awsVpcShape.id).toBe('awsVpc');
		});

		it('should calculate bounds for container', () => {
			const ctx = createMockContext('Production VPC', { width: 600, height: 400 });
			const bounds = awsVpcShape.bounds(ctx);

			expect(bounds.width).toBe(600);
			expect(bounds.height).toBe(400);
		});

		it('should have 4 anchor points', () => {
			const ctx = createMockContext('VPC');
			const anchors = awsVpcShape.anchors(ctx);

			expect(anchors).toHaveLength(4);
		});

		it('should render VPC boundary with cloud icon', () => {
			const ctx = createMockContext('VPC-1', { width: 500, height: 300 });
			const svg = awsVpcShape.render(ctx, { x: 0, y: 0 });

			expect(svg).toContain('VPC-1');
			expect(svg).toContain('rect'); // Boundary
		});
	});

	describe('awsApiGateway', () => {
		it('should have correct shape id', () => {
			expect(awsApiGatewayShape.id).toBe('awsApiGateway');
		});

		it('should calculate bounds with label', () => {
			const ctx = createMockContext('REST API');
			const bounds = awsApiGatewayShape.bounds(ctx);

			expect(bounds.width).toBeGreaterThan(0);
			expect(bounds.height).toBeGreaterThan(0);
		});

		it('should have 4 anchor points', () => {
			const ctx = createMockContext('API');
			const anchors = awsApiGatewayShape.anchors(ctx);

			expect(anchors).toHaveLength(4);
		});

		it('should render API Gateway icon', () => {
			const ctx = createMockContext('Public API');
			const svg = awsApiGatewayShape.render(ctx, { x: 0, y: 0 });

			expect(svg).toContain('Public API');
			// Should have gateway/router representation
		});
	});
});
