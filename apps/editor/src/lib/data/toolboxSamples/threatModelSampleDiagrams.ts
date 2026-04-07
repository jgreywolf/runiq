import type { SampleCategory } from '../sample-data';

export const threatModelSampleDiagrams: SampleCategory[] = [
	{
		id: 'threatModel',
		label: 'Threat Models',
		samples: [
			{
				name: 'Login Threat Model',
				description: 'Trust boundaries, flows, threats, and mitigations for a web login flow.',
				code: `diagram "Login Threat Model" {
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
}`
			}
		]
	}
];
