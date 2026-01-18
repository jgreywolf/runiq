import type { SampleCategory } from '../sample-data';

export const railroadSampleDiagrams: SampleCategory[] = [
	{
		id: 'railroad',
		label: 'Railroad Diagrams',
		samples: [
			{
				name: 'Expression Grammar',
				description: 'Basic arithmetic grammar with precedence and grouping.',
				code: `railroad "Expression Grammar" {
  diagram Expr = Term (("+" | "-") Term)*
  diagram Term = Factor (("*" | "/") Factor)*
  diagram Factor = Number | "(" Expr ")"
  diagram Number = digit+
}`
			},
			{
				name: 'URL Subset',
				description: 'A small URL grammar example.',
				code: `railroad "URL Subset" {
  diagram Url = Scheme "://" Host Path?
  diagram Scheme = "http" | "https"
  diagram Host = domain ("." domain)*
  diagram Path = "/" segment ("/" segment)*
}`
			}
		]
	}
];
