import { getMappedValue, normalizeDataRows, resolveDataSources } from './shared';

export function applyDataSourcesToTimeline(profile: any, warnings: string[]): void {
	const dataSources = resolveDataSources(profile, warnings);
	if (dataSources.size === 0 || !Array.isArray(profile.dataMaps)) return;

	const events: any[] = Array.isArray(profile.events) ? [...profile.events] : [];
	const tasks: any[] = Array.isArray(profile.tasks) ? [...profile.tasks] : [];
	const milestones: any[] = Array.isArray(profile.milestones) ? [...profile.milestones] : [];

	for (const map of profile.dataMaps) {
		const target = map.target;
		if (!['timeline', 'events', 'tasks', 'milestones'].includes(target)) continue;

		const fields: Record<string, string> = map.fields ?? {};
		const hasLabel = !!(fields.label || fields.name);
		const missingFields: string[] = [];
		if (!fields.date && (target === 'timeline' || target === 'events' || target === 'milestones')) missingFields.push('date');
		if (target === 'tasks') {
			if (!fields.startDate) missingFields.push('startDate');
			if (!fields.endDate) missingFields.push('endDate');
		}
		if (!hasLabel) missingFields.push('label/name');
		if (missingFields.length > 0) {
			warnings.push(`Datasource "${map.source}" is missing ${missingFields.join(', ')} mapping for ${target}.`);
			continue;
		}

		const source = dataSources.get(map.source);
		if (!source) {
			warnings.push(`Datasource "${map.source}" not found for ${target} mapping.`);
			continue;
		}

		const rows = normalizeDataRows(source.data, target, warnings, map.source);
		if (!rows) continue;
		let skipped = 0;

		if (target === 'tasks') {
			rows.forEach((row, index) => {
				const label = getMappedValue(row, fields, 'label') ?? getMappedValue(row, fields, 'name');
				const startDate = getMappedValue(row, fields, 'startDate');
				const endDate = getMappedValue(row, fields, 'endDate');
				if (!label || !startDate || !endDate) {
					skipped += 1;
					return;
				}

				const task: any = {
					id: String(getMappedValue(row, fields, 'id') ?? `task-${index + 1}`),
					label: String(label),
					startDate: String(startDate),
					endDate: String(endDate)
				};
				const description = getMappedValue(row, fields, 'description');
				const color = getMappedValue(row, fields, 'fillColor') ?? getMappedValue(row, fields, 'color');
				const lane = getMappedValue(row, fields, 'lane') ?? getMappedValue(row, fields, 'laneId');
				if (description) task.description = String(description);
				if (color) task.fillColor = String(color);
				if (lane) task.lane = String(lane);
				tasks.push(task);
			});
			if (skipped > 0) warnings.push(`Datasource "${map.source}" skipped ${skipped} task row(s) missing required fields.`);
			continue;
		}

		if (target === 'milestones') {
			rows.forEach((row, index) => {
				const label = getMappedValue(row, fields, 'label') ?? getMappedValue(row, fields, 'name');
				const date = getMappedValue(row, fields, 'date');
				if (!label || !date) {
					skipped += 1;
					return;
				}

				const milestone: any = {
					id: String(getMappedValue(row, fields, 'id') ?? `milestone-${index + 1}`),
					label: String(label),
					date: String(date)
				};
				const description = getMappedValue(row, fields, 'description');
				const color = getMappedValue(row, fields, 'fillColor') ?? getMappedValue(row, fields, 'color');
				const lane = getMappedValue(row, fields, 'lane') ?? getMappedValue(row, fields, 'laneId');
				if (description) milestone.description = String(description);
				if (color) milestone.fillColor = String(color);
				if (lane) milestone.lane = String(lane);
				milestones.push(milestone);
			});
			if (skipped > 0) warnings.push(`Datasource "${map.source}" skipped ${skipped} milestone row(s) missing required fields.`);
			continue;
		}

		rows.forEach((row, index) => {
			const label = getMappedValue(row, fields, 'label') ?? getMappedValue(row, fields, 'name');
			const date = getMappedValue(row, fields, 'date');
			if (!label || !date) {
				skipped += 1;
				return;
			}

			const event: any = {
				id: String(getMappedValue(row, fields, 'id') ?? `event-${index + 1}`),
				label: String(label),
				date: String(date)
			};
			const description = getMappedValue(row, fields, 'description');
			const icon = getMappedValue(row, fields, 'icon');
			const color = getMappedValue(row, fields, 'fillColor') ?? getMappedValue(row, fields, 'color');
			if (description) event.description = String(description);
			if (icon) event.icon = String(icon);
			if (color) event.fillColor = String(color);
			events.push(event);
		});

		if (skipped > 0) warnings.push(`Datasource "${map.source}" skipped ${skipped} event row(s) missing required fields.`);
	}

	if (events.length > 0) profile.events = events;
	if (tasks.length > 0) profile.tasks = tasks;
	if (milestones.length > 0) profile.milestones = milestones;
}

