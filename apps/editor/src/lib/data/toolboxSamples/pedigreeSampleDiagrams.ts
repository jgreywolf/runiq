import type { SampleCategory } from '../sample-data';

export const pedigreeSampleDiagrams: SampleCategory[] = [
	{
		id: 'pedigree',
		label: 'Pedigree',
		samples: [
			{
				name: 'Family Tree Basics',
				description: 'Parents, spouse, and children',
				code: `pedigree "Family Tree" {
  people {
    p1 "Alex Rivera" dob:"1970-01-10" sex:male
    p2 "Jordan Lee" dob:"1972-05-22" sex:female
    c1 "Casey Rivera" dob:"1998-03-11" sex:female
    c2 "Morgan Rivera" dob:"2001-09-04" sex:male
  }

  families {
    p1 + p2 date:"1995-06-12" -> c1, c2
  }
}`
			}
		]
	}
];
