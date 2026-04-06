import type { ShapeCategory } from '../toolbox-data';

export const fileTreeShapeIcons: ShapeCategory[] = [
	{
		id: 'fileTree',
		label: 'File Trees',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'fileTree',
				label: 'File Tree Root',
				code: `container repo "runiq" as @fileTree {
  container apps "apps" as @folder {
    shape editor as @folder label:"editor"
    shape studio as @folder label:"studio"
  }

  container packages "packages" as @folder {
    shape core as @folder label:"core"
    shape parser as @folder label:"parser-dsl"
  }

  shape readme as @file label:"README.md"
}`
			},
			{
				id: 'folder',
				label: 'Folder',
				code: 'shape folder1 as @folder label:"packages"'
			},
			{
				id: 'folderCollapsed',
				label: 'Collapsed Folder',
				code: `container src "src" as @folder collapsed:true {
  shape routes as @folder label:"routes"
  shape lib as @folder label:"lib"
}`
			},
			{
				id: 'file',
				label: 'File',
				code: 'shape file1 as @file label:"README.md"'
			}
		]
	}
];
