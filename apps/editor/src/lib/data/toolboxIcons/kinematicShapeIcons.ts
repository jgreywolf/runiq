import type { ShapeCategory } from '../toolbox-data';

export const kinematicShapeIcons: ShapeCategory[] = [
	{
		id: 'kinematic',
		label: 'Kinematic',
		shapes: [
			{ id: 'revoluteJoint', label: 'Revolute Joint', code: 'shape id as @revoluteJoint label:"Revolute"' },
			{ id: 'fixedJoint', label: 'Fixed Joint', code: 'shape id as @fixedJoint label:"Fixed"' },
			{ id: 'prismaticJoint', label: 'Prismatic Joint', code: 'shape id as @prismaticJoint label:"Prismatic"' },
			{ id: 'sphericalJoint', label: 'Spherical Joint', code: 'shape id as @sphericalJoint label:"Spherical"' },
			{ id: 'universalJoint', label: 'Universal Joint', code: 'shape id as @universalJoint label:"Universal"' },
			{ id: 'cylindricalJoint', label: 'Cylindrical Joint', code: 'shape id as @cylindricalJoint label:"Cylindrical"' },
			{ id: 'planarJoint', label: 'Planar Joint', code: 'shape id as @planarJoint label:"Planar"' },
			{ id: 'binaryLink', label: 'Binary Link', code: 'shape id as @binaryLink label:"Binary Link"' },
			{ id: 'ternaryLink', label: 'Ternary Link', code: 'shape id as @ternaryLink label:"Ternary Link"' },
			{ id: 'quaternaryLink', label: 'Quaternary Link', code: 'shape id as @quaternaryLink label:"Quaternary Link"' },
			{ id: 'groundLink', label: 'Ground Link', code: 'shape id as @groundLink label:"Ground"' },
			{ id: 'rotaryMotor', label: 'Rotary Motor', code: 'shape id as @rotaryMotor label:"Rotary Motor"' },
			{ id: 'linearActuator', label: 'Linear Actuator', code: 'shape id as @linearActuator label:"Linear Actuator"' },
			{ id: 'spring', label: 'Spring', code: 'shape id as @spring label:"Spring"' },
			{ id: 'damper', label: 'Damper', code: 'shape id as @damper label:"Damper"' },
			{ id: 'gear', label: 'Gear', code: 'shape id as @gear label:"Gear"' }
		]
	}
];
