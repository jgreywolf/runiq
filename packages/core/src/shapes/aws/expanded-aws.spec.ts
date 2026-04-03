import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  awsCloudFrontShape,
  awsDynamoDbShape,
  awsSqsShape,
  awsCognitoShape,
} from './index.js';

function createMockContext(label: string, shape: string): ShapeRenderContext {
  return {
    node: {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      shape,
      label,
    },
    style: {
      strokeWidth: 2,
      fontSize: 10,
    },
    measureText: (text: string) => ({
      width: text.length * 6,
      height: 10,
    }),
  };
}

describe('Expanded AWS Shapes', () => {
  it('should expose the new shape ids', () => {
    expect(awsCloudFrontShape.id).toBe('awsCloudFront');
    expect(awsDynamoDbShape.id).toBe('awsDynamoDb');
    expect(awsSqsShape.id).toBe('awsSqs');
    expect(awsCognitoShape.id).toBe('awsCognito');
  });

  it('should render CloudFront iconography', () => {
    const svg = awsCloudFrontShape.render(
      createMockContext('CloudFront CDN', 'awsCloudFront'),
      { x: 0, y: 0 }
    );
    expect(svg).toContain('<circle');
    expect(svg).toContain('CloudFront CDN');
  });

  it('should render DynamoDB iconography', () => {
    const svg = awsDynamoDbShape.render(
      createMockContext('Orders Table', 'awsDynamoDb'),
      { x: 0, y: 0 }
    );
    expect(svg).toContain('<ellipse');
    expect(svg).toContain('Orders Table');
  });

  it('should render SQS iconography', () => {
    const svg = awsSqsShape.render(
      createMockContext('Processing Queue', 'awsSqs'),
      { x: 0, y: 0 }
    );
    expect(svg).toContain('<rect');
    expect(svg).toContain('Processing Queue');
  });

  it('should render Cognito iconography', () => {
    const svg = awsCognitoShape.render(
      createMockContext('User Pool', 'awsCognito'),
      { x: 0, y: 0 }
    );
    expect(svg).toContain('<circle');
    expect(svg).toContain('User Pool');
  });
});
