import type { ShapeCategory } from '../toolbox-data';

export const decorativeShapeIcons: ShapeCategory[] = [
	{
		id: 'decorative',
		label: 'Decorative Elements',
		profiles: ['diagram'],
		shapes: [
			{ id: 'hRule', label: 'Horizontal Rule', code: 'shape id as @hRule data:[{ length: 240 }]' },
			{ id: 'vRule', label: 'Vertical Rule', code: 'shape id as @vRule data:[{ length: 240 }]' },
			{
				id: 'bracketLeft',
				label: 'Left Bracket',
				code: 'shape id as @bracketLeft data:[{ length: 220 }]'
			},
			{
				id: 'bracketRight',
				label: 'Right Bracket',
				code: 'shape id as @bracketRight data:[{ length: 220 }]'
			},
			{
				id: 'sectionHeader',
				label: 'Section Header',
				code: 'shape id as @sectionHeader label:"Section"'
			},
			{
				id: 'swimlaneDivider',
				label: 'Swimlane Divider',
				code: 'shape id as @swimlaneDivider label:"Lane" data:[{ length: 220 }]'
			},
			{ id: 'titleBox', label: 'Title Box', code: 'shape id as @titleBox label:"Title"' },
			{
				id: 'subtitleText',
				label: 'Subtitle Text',
				code: 'shape id as @subtitleText label:"Subtitle"'
			},
			{ id: 'captionBox', label: 'Caption Box', code: 'shape id as @captionBox label:"Caption"' },
			{ id: 'footnoteText', label: 'Footnote', code: 'shape id as @footnoteText label:"Footnote"' },
			{ id: 'legendBox', label: 'Legend Box', code: 'shape id as @legendBox label:"Legend"' },
			{
				id: 'watermarkText',
				label: 'Watermark',
				code: 'shape id as @watermarkText label:"CONFIDENTIAL"'
			},
			{ id: 'badgeNumber', label: 'Badge Number', code: 'shape id as @badgeNumber label:"1"' },
			{ id: 'badgeLabel', label: 'Badge Label', code: 'shape id as @badgeLabel label:"NEW"' }
		]
	}
];
