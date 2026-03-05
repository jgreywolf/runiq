---
title: Icon Libraries (Draft)
description: Draft icon list and provider coverage for Runiq icon libraries.
lastUpdated: 2026-01-26
---

# Icon Libraries (Draft)

This page tracks the draft icon list and provider coverage. Icons are currently rendered as monochrome SVGs; the **brand** provider uses placeholder badges until official SVG assets are sourced. When an icon exists in **iconify**, prefer it over placeholders.

## Naming Rules

- Use underscores in DSL identifiers: `icon:iconify/cloud_aws`, `icon:iconify/mdi_cloud_sync`
- Providers normalize `_` to `-` internally for convenience.

## Providers

- **brand**: curated cloud/DevOps/database/service badges (falls back to iconify when available; otherwise placeholder SVGs)
- **iconify**: small starter set following Iconify-style naming
- **fa**: FontAwesome (legacy/general set)

## Draft Icon List

### Cloud Platform Icons (available)

**iconify**
- `cloud_aws`, `cloud_azure`, `cloud_gcp`
- `cloud_aws_ec2`, `cloud_aws_s3`, `cloud_aws_lambda`, `cloud_aws_rds`
- `cloud_aws_apigateway`, `cloud_aws_cloudwatch`, `cloud_aws_dynamodb`
- `cloud_aws_ecs`, `cloud_aws_eks`, `cloud_aws_elasticache`
- `cloud_aws_iam`, `cloud_aws_route53`, `cloud_aws_sqs`
- `cloud_azure_vm`, `cloud_azure_storage`, `cloud_azure_functions`
- `cloud_gcp_compute`, `cloud_gcp_storage`, `cloud_gcp_functions`, `cloud_gcp_spanner`
- `cloud_compute`, `cloud_storage`, `cloud_functions`
- `cloud_docker`, `cloud_kubernetes`
- `mdi_cloud`, `mdi_cloud_sync`, `mdi_cloud_outline`, `mdi_cloud_queue`, `mdi_container`

### Database Icons (available)

**brand**
- `mongodb`, `postgres`, `mysql`, `cassandra`, `redis`, `snowflake`
- `db_sql`, `db_nosql`, `db_cache`, `db_warehouse`, `db_graph`, `db_timeseries`

**iconify**
- `mdi_database`, `mdi_database_outline`, `mdi_database_search`, `mdi_database_lock`

## Smoke Test Snippets

Use these snippets to validate icon resolution in the editor.

### Cloud Providers

```runiq
diagram "Cloud Iconify Smoke Test" {
  direction LR
  shape aws label:"AWS" icon:iconify/cloud_aws
  shape ec2 label:"EC2" icon:iconify/cloud_aws_ec2
  shape s3 label:"S3" icon:iconify/cloud_aws_s3
  shape lambda label:"Lambda" icon:iconify/cloud_aws_lambda
  shape rds label:"RDS" icon:iconify/cloud_aws_rds
  shape azure label:"Azure" icon:iconify/cloud_azure
  shape azure_vm label:"VM" icon:iconify/cloud_azure_vm
  shape azure_storage label:"Storage" icon:iconify/cloud_azure_storage
  shape azure_fn label:"Functions" icon:iconify/cloud_azure_functions
  shape gcp label:"GCP" icon:iconify/cloud_gcp
  shape gcp_compute label:"Compute" icon:iconify/cloud_gcp_compute
  shape gcp_storage label:"Storage" icon:iconify/cloud_gcp_storage
  shape gcp_fn label:"Functions" icon:iconify/cloud_gcp_functions
  shape docker label:"Docker" icon:iconify/cloud_docker
  shape k8s label:"K8s" icon:iconify/cloud_kubernetes
}
```

## Iconify Extraction Workflow

To keep bundle size small, Runiq extracts only the icons listed in `packages/icons-iconify/iconify-icons.json`:

1) `pnpm -C packages/icons-iconify install`
2) `pnpm -C packages/icons-iconify extract:iconify`
3) `pnpm -C packages/icons-iconify build`

Edit `iconify-icons.json` to add or change icons. The script writes to `packages/icons-iconify/src/generated-iconify.ts`.

### DevOps Icons (planned)

**brand**
- `jenkins`, `gitlab`, `github_actions`, `terraform`, `nginx`, `kafka`, `vault`
- `ci_cd`, `artifact_repo`, `deploy_target`, `pipeline`

**iconify**
- `mdi_pipeline`, `mdi_server`, `mdi_git`, `mdi_package_variant`, `mdi_hammer_wrench`, `mdi_rocket_launch`

### Business Icons (planned)

**brand**
- `user`, `team`, `department`, `partner`, `vendor`, `product`, `service`, `revenue`, `metrics`

**iconify**
- `mdi_user`, `mdi_users`, `mdi_account_group`, `mdi_briefcase`, `mdi_chart_line`, `mdi_cash`

### Security Icons (planned)

**brand**
- `firewall`, `vpn`, `certificate`, `key_icon`, `shield`, `threat`, `vulnerability`, `audit_log`

**iconify**
- `mdi_shield`, `mdi_key`, `mdi_lock`, `mdi_shield_outline`, `mdi_key_variant`, `mdi_alert_outline`, `mdi_file_document_alert`
