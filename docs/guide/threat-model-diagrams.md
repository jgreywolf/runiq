# Threat Model Diagrams

Create security-focused system diagrams with trust boundaries, threats, mitigations, and controls using Runiq's `diagram` profile.

Threat models help teams reason about attack surfaces, data flows, and the controls that reduce risk. Runiq's first-pass support builds on the existing `diagram` profile so you can mix security semantics with servers, databases, cloud icons, and network infrastructure.

## Core Shapes

| Shape | Syntax | Purpose |
| --- | --- | --- |
| Trust Boundary | `@trustBoundary` | Security boundary or network zone |
| Threat | `@threat` | Risk or attack scenario |
| Mitigation | `@mitigation` | Countermeasure or response |
| Security Control | `@securityControl` | Technical safeguard |

You can combine these with existing shapes like:

- `@actor`
- `@server`
- `@cylinder`
- `@cloud`
- `@aws*`
- `@azure*`
- `@firewall`
- `@loadBalancer`

## Example

```runiq
diagram "Login Threat Model" {
  direction LR

  container internet "Internet" as @trustBoundary {
    shape user as @actor label:"User"
  }

  container appNet "Private Network" as @trustBoundary {
    shape web as @server label:"Web App"
    shape db as @cylinder label:"User DB"
    shape waf as @securityControl label:"WAF"
  }

  shape spoofing as @threat label:"Credential spoofing"
  shape mfa as @mitigation label:"Require MFA"

  user -> waf label:"login"
  waf -> web
  web -> db label:"query"

  spoofing -> web strokeColor:"#b91c1c"
  mfa -> spoofing strokeColor:"#15803d"
}
```

## When To Use It

Use threat-model diagrams when you want to show:

- trust boundaries between public and private zones
- critical assets and data stores
- high-risk attack paths
- security controls that mitigate those paths

## Current Scope

This first pass focuses on:

- trust boundaries
- threat nodes
- mitigation nodes
- security control nodes
- mixing security semantics with the existing diagram/cloud/network catalog

Future expansion can add:

- STRIDE-style threat typing
- richer flow annotations
- data classifications
- risk/severity badges
- threat-model-specific snippets or a dedicated profile
