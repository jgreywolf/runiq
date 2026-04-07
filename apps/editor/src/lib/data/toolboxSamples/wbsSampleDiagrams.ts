import type { SampleCategory } from '../sample-data';

export const wbsSampleDiagrams: SampleCategory[] = [
	{
		id: 'wbs',
		label: 'Work Breakdown Structures',
		samples: [
			{
				name: 'Website Launch WBS',
				description: 'Deliverables and work packages for a website launch plan.',
				code: `diagram "Website Launch WBS" {
  direction TB

  container launch "Website Launch" as @wbs {
    container discovery "Discovery" as @wbsDeliverable {
      shape audit as @wbsWorkPackage label:"Content audit"
      shape sitemap as @wbsWorkPackage label:"Sitemap"
    }

    container design "Design" as @wbsDeliverable {
      shape wireframes as @wbsWorkPackage label:"Wireframes"
      shape ui as @wbsWorkPackage label:"UI kit"
    }

    container build "Build" as @wbsDeliverable {
      shape cms as @wbsWorkPackage label:"CMS setup"
      shape qa as @wbsWorkPackage label:"QA pass"
    }
  }
}`
			}
		]
	}
];
