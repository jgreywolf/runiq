import type { ShapeCategory } from '../toolbox-data';

export const networkShapeIcons: ShapeCategory[] = [
	{
		id: 'network',
		label: 'Network',
		profiles: ['diagram'],
		shapes: [
			{ id: 'server', label: 'Server', code: 'shape id as @server label:"Server"' },
			{ id: 'router', label: 'Router', code: 'shape id as @router label:"Router"' },
			{ id: 'switch', label: 'Switch', code: 'shape id as @switch label:"Switch"' },
			{ id: 'firewall', label: 'Firewall', code: 'shape id as @firewall label:"Firewall"' },
			{
				id: 'loadBalancer',
				label: 'Load Balancer',
				code: 'shape id as @loadBalancer label:"Load Balancer"'
			},
			{ id: 'workstation', label: 'Workstation', code: 'shape id as @workstation label:"Client PC"' },
			{ id: 'accessPoint', label: 'Access Point', code: 'shape id as @accessPoint label:"Wi-Fi AP"' },
			{ id: 'vpnGateway', label: 'VPN Gateway', code: 'shape id as @vpnGateway label:"VPN Gateway"' },
			{ id: 'modem', label: 'Modem', code: 'shape id as @modem label:"Cable Modem"' },
			{ id: 'cloud', label: 'Cloud', code: 'shape id as @cloud label:"Cloud"' },
			{ id: 'storage', label: 'Storage', code: 'shape id as @storage label:"Storage"' }
		]
	}
];
