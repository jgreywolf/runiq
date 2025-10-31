---
title: AWS Diagrams
---

# AWS Architecture Diagrams

Create Amazon Web Services infrastructure diagrams with Runiq's diagram profile.

## Overview

AWS diagrams visualize cloud infrastructure using AWS service icons. Runiq provides shapes for common AWS services to document architectures, deployments, and data flows.

## Key Shapes

- **AWS EC2**: `@awsEc2` - Elastic Compute Cloud instances
- **AWS S3**: `@awsS3` - Simple Storage Service buckets
- **AWS Lambda**: `@awsLambda` - Serverless functions
- **AWS RDS**: `@awsRds` - Relational Database Service
- **AWS VPC**: `@awsVpc` - Virtual Private Cloud
- **AWS API Gateway**: `@awsApiGateway` - API management

See the [Shape Reference - AWS Shapes](/reference/shapes#_14-aws-shapes-6-shapes) for the complete list.

## Basic AWS Architecture

```runiq
diagram "Simple Web App" {
  direction TB

  shape user as @actor label: "User"
  shape vpc as @awsVpc label: "VPC" {
    shape ec2 as @awsEc2 label: "EC2\nWeb Server"
    shape rds as @awsRds label: "RDS\nPostgreSQL"
  }
  shape s3 as @awsS3 label: "S3\nStatic Assets"

  user -> ec2 label: "HTTPS"
  ec2 -> rds label: "SQL"
  ec2 -> s3 label: "CDN"
}
```

## Serverless Architecture

```runiq
diagram "Serverless API" {
  direction TB

  shape client as @actor label: "Mobile App"
  shape api as @awsApiGateway label: "API Gateway"
  shape lambda as @awsLambda label: "Lambda\nFunction"
  shape dynamodb as @awsRds label: "DynamoDB"
  shape s3 as @awsS3 label: "S3\nStorage"
  shape cognito as @cloud label: "Cognito\nAuth"

  client -> api label: "HTTPS"
  api -> cognito label: "Authenticate"
  api -> lambda label: "Invoke"
  lambda -> dynamodb label: "Query"
  lambda -> s3 label: "Store Files"
}
```

## Multi-Tier Application

```runiq
diagram "Three-Tier AWS" {
  direction TB

  shape users as @cloud label: "Internet Users"
  shape route53 as @cloud label: "Route 53\nDNS"

  container vpc as @awsVpc label: "VPC (10.0.0.0/16)" {
    container public as @systemBoundary label: "Public Subnet" {
      shape alb as @loadBalancer label: "Application\nLoad Balancer"
      shape nat as @router label: "NAT Gateway"
    }

    container private1 as @systemBoundary label: "Private Subnet (App)" {
      shape ec2_1 as @awsEc2 label: "EC2\nApp Server 1"
      shape ec2_2 as @awsEc2 label: "EC2\nApp Server 2"
    }

    container private2 as @systemBoundary label: "Private Subnet (Data)" {
      shape rds as @awsRds label: "RDS\nPrimary"
      shape rds_replica as @awsRds label: "RDS\nRead Replica"
    }
  }

  shape s3 as @awsS3 label: "S3\nBackups"

  users -> route53
  route53 -> alb
  alb -> ec2_1
  alb -> ec2_2
  ec2_1 -> rds
  ec2_2 -> rds
  rds -> rds_replica label: "Replication"
  rds -> s3 label: "Backup"
}
```

## Microservices on AWS

```runiq
diagram "ECS Microservices" {
  direction TB

  shape users as @cloud label: "Users"
  shape cloudfront as @cloud label: "CloudFront\nCDN"

  container vpc as @awsVpc label: "VPC" {
    shape alb as @loadBalancer label: "ALB"

    container ecs as @systemBoundary label: "ECS Cluster" {
      shape auth as @awsEc2 label: "Auth Service"
      shape api as @awsEc2 label: "API Service"
      shape worker as @awsEc2 label: "Worker Service"
    }

    shape rds as @awsRds label: "RDS"
    shape elasticache as @storage label: "ElastiCache\nRedis"
    shape sqs as @storage label: "SQS Queue"
  }

  shape s3 as @awsS3 label: "S3\nAssets"

  users -> cloudfront
  cloudfront -> s3
  cloudfront -> alb
  alb -> auth
  alb -> api
  api -> rds
  api -> elasticache
  api -> sqs
  sqs -> worker
  worker -> rds
}
```

## Data Pipeline

```runiq
diagram "AWS Data Pipeline" {
  direction LR

  shape sources as @cloud label: "Data Sources"
  shape kinesis as @storage label: "Kinesis\nData Stream"
  shape lambda as @awsLambda label: "Lambda\nProcessor"
  shape s3Raw as @awsS3 label: "S3\nRaw Data"
  shape glue as @storage label: "AWS Glue\nETL"
  shape s3Processed as @awsS3 label: "S3\nProcessed"
  shape athena as @storage label: "Athena\nQuery"
  shape quicksight as @cloud label: "QuickSight\nBI"

  sources -> kinesis
  kinesis -> lambda
  lambda -> s3Raw
  s3Raw -> glue
  glue -> s3Processed
  s3Processed -> athena
  athena -> quicksight
}
```

## Multi-Region Deployment

```runiq
diagram "Multi-Region AWS" {
  direction TB

  shape users as @cloud label: "Global Users"
  shape route53 as @cloud label: "Route 53\nGeoDNS"

  container usEast as @awsVpc label: "us-east-1 (Primary)" {
    shape ec2East as @awsEc2 label: "EC2"
    shape rdsEast as @awsRds label: "RDS Primary"
    shape s3East as @awsS3 label: "S3"
  }

  container usWest as @awsVpc label: "us-west-2 (DR)" {
    shape ec2West as @awsEc2 label: "EC2"
    shape rdsWest as @awsRds label: "RDS Standby"
    shape s3West as @awsS3 label: "S3"
  }

  users -> route53
  route53 -> ec2East label: "Primary"
  route53 -> ec2West label: "Failover"
  rdsEast -> rdsWest label: "Cross-Region\nReplication"
  s3East -> s3West label: "Cross-Region\nReplication"
}
```

## Event-Driven Architecture

```runiq
diagram "Event-Driven AWS" {
  direction TB

  shape api as @awsApiGateway label: "API Gateway"
  shape lambda1 as @awsLambda label: "Order Lambda"
  shape eventbridge as @storage label: "EventBridge"
  shape lambda2 as @awsLambda label: "Inventory Lambda"
  shape lambda3 as @awsLambda label: "Email Lambda"
  shape lambda4 as @awsLambda label: "Analytics Lambda"
  shape rds as @awsRds label: "RDS"
  shape s3 as @awsS3 label: "S3"
  shape ses as @cloud label: "SES\nEmail"

  api -> lambda1 label: "POST /order"
  lambda1 -> rds label: "Save Order"
  lambda1 -> eventbridge label: "OrderCreated Event"
  eventbridge -> lambda2 label: "Update Inventory"
  eventbridge -> lambda3 label: "Send Confirmation"
  eventbridge -> lambda4 label: "Track Analytics"
  lambda2 -> rds
  lambda3 -> ses
  lambda4 -> s3
}
```

## Styling

Apply AWS standard colors:

```runiq
diagram "Styled AWS" {
  direction LR

  shape compute as @awsEc2 label: "EC2" fill: "#ff9900" color: "#ffffff"
  shape storage as @awsS3 label: "S3" fill: "#569a31" color: "#ffffff"
  shape database as @awsRds label: "RDS" fill: "#3b48cc" color: "#ffffff"
  shape lambda as @awsLambda label: "Lambda" fill: "#ff9900" color: "#ffffff"

  compute -> database style: { stroke: "#232f3e", strokeWidth: 2 }
  compute -> storage style: { stroke: "#232f3e", strokeWidth: 2 }
}
```

**AWS Service Colors:**

- Compute (EC2, Lambda): Orange `#ff9900`
- Storage (S3, EBS): Green `#569a31`
- Database (RDS, DynamoDB): Blue `#3b48cc`
- Networking (VPC, CloudFront): Purple `#8c4fff`

## Best Practices

1. **Use VPC containers** - Group resources by Virtual Private Cloud
2. **Show subnets** - Indicate public vs private subnets
3. **Label connections** - Include protocols and ports
4. **Security groups** - Document firewall rules in notes
5. **Availability zones** - Show multi-AZ deployments
6. **Cost optimization** - Highlight reserved instances, spot instances
7. **Monitoring** - Include CloudWatch, X-Ray integrations
8. **IAM roles** - Document service permissions

## AWS Well-Architected Framework

Consider these pillars when designing:

1. **Operational Excellence** - Automation, monitoring
2. **Security** - IAM, encryption, network isolation
3. **Reliability** - Multi-AZ, auto-scaling, backups
4. **Performance Efficiency** - Right-sized instances, caching
5. **Cost Optimization** - Reserved capacity, S3 lifecycle policies
6. **Sustainability** - Efficient resource usage

## Common Patterns

### High Availability

- Multi-AZ RDS deployments
- Auto Scaling Groups
- Application Load Balancers
- Route 53 health checks

### Security

- VPC with public/private subnets
- NAT Gateways for outbound traffic
- Security Groups (firewall rules)
- AWS WAF for web protection

### Scalability

- Elastic Load Balancing
- Auto Scaling
- CloudFront CDN
- DynamoDB on-demand

## Examples

See the examples directory for AWS architecture samples:

- `aws-vpc-example.runiq` - VPC networking
- `multi-region.runiq` - Multi-region deployment
- `microservices.runiq` - ECS microservices

## Related

- [Shape Reference - AWS Shapes](/reference/shapes#_14-aws-shapes-6-shapes)
- [Network Diagrams](/guide/network-diagrams)
- [C4 Architecture](/guide/c4-architecture)
- [Containers](/guide/containers)

## Resources

- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/)
- [AWS Reference Architectures](https://aws.amazon.com/architecture/reference-architecture-diagrams/)
