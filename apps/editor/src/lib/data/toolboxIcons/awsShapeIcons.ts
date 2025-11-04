import type { ShapeCategory } from '../toolbox-data';

export const awsShapeIcons: ShapeCategory[] = [
	{
		id: 'aws',
		label: 'AWS Cloud',
		profiles: ['diagram'],
		shapes: [
			{ id: 'awsEc2', label: 'EC2 Instance', code: 'shape id as @awsEc2 label:"Web Server"' },
			{ id: 'awsS3', label: 'S3 Bucket', code: 'shape id as @awsS3 label:"assets-bucket"' },
			{
				id: 'awsLambda',
				label: 'Lambda Function',
				code: 'shape id as @awsLambda label:"ProcessOrder"'
			},
			{ id: 'awsRds', label: 'RDS Database', code: 'shape id as @awsRds label:"PostgreSQL"' },
			{
				id: 'awsVpc',
				label: 'VPC',
				code: `container vpc1 "Production VPC" as @awsVpc {
  shape ec2 as @awsEc2 label:"Web Server"
}`
			},
			{
				id: 'awsApiGateway',
				label: 'API Gateway',
				code: 'shape id as @awsApiGateway label:"Public API"'
			}
		]
	}
];
