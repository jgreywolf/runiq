import type { ShapeCategory } from '../toolbox-data';

export const azureShapeIcons: ShapeCategory[] = [
	{
		id: 'azure',
		label: 'Azure Cloud',
		profiles: ['diagram'],
		shapes: [
			{ id: 'azureVm', label: 'Virtual Machine', code: 'shape id as @azureVm label:"Web VM"' },
			{
				id: 'azureBlobStorage',
				label: 'Blob Storage',
				code: 'shape id as @azureBlobStorage label:"Static Assets"'
			},
			{
				id: 'azureFunctions',
				label: 'Azure Functions',
				code: 'shape id as @azureFunctions label:"ProcessOrder"'
			},
			{
				id: 'azureSqlDatabase',
				label: 'SQL Database',
				code: 'shape id as @azureSqlDatabase label:"App Database"'
			},
			{
				id: 'azureVirtualNetwork',
				label: 'Virtual Network',
				code: `container vnet1 "Production VNet" as @azureVirtualNetwork {
  shape vm as @azureVm label:"Web VM"
}`
			},
			{
				id: 'azureResourceGroup',
				label: 'Resource Group',
				code: `container rg1 "App Resource Group" as @azureResourceGroup {
  shape api as @azureApiManagement label:"Public API"
  shape db as @azureSqlDatabase label:"Primary DB"
}`
			},
			{
				id: 'azureSubscription',
				label: 'Subscription',
				code: `container sub1 "Production Subscription" as @azureSubscription {
  container rg1 "Platform Resource Group" as @azureResourceGroup {
    shape vnet as @azureVirtualNetwork label:"Core VNet"
  }
}`
			},
			{
				id: 'azureApiManagement',
				label: 'API Management',
				code: 'shape id as @azureApiManagement label:"Public API"'
			},
			{ id: 'azureCdn', label: 'Azure CDN', code: 'shape id as @azureCdn label:"Edge CDN"' },
			{
				id: 'azureCosmosDb',
				label: 'Cosmos DB',
				code: 'shape id as @azureCosmosDb label:"Customer Data"'
			},
			{
				id: 'azureServiceBus',
				label: 'Service Bus',
				code: 'shape id as @azureServiceBus label:"Event Queue"'
			},
			{
				id: 'azureEntraId',
				label: 'Entra ID',
				code: 'shape id as @azureEntraId label:"Identity"'
			}
		]
	}
];
