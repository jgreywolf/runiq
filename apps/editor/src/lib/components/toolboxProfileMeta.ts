import { ProfileName } from '$lib/types';

export interface ToolboxProfileMeta {
	label: string;
	bannerClass: string;
	contentMode: 'shapes' | 'samples-only';
	footerHint: string;
}

const defaultMeta: ToolboxProfileMeta = {
	label: 'No diagram detected',
	bannerClass: 'border-b border-purple-200 bg-purple-50 text-purple-900',
	contentMode: 'shapes',
	footerHint: 'Click a shape to insert it'
};

const metaByProfile: Record<ProfileName, ToolboxProfileMeta> = {
	[ProfileName.diagram]: {
		label: 'Diagram Mode',
		bannerClass: 'border-b border-runiq-200 bg-runiq-50 text-runiq-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.glyphset]: {
		label: 'Glyphset Mode',
		bannerClass: 'border-b border-runiq-200 bg-runiq-50 text-runiq-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.sequence]: {
		label: 'Sequence Diagram Mode',
		bannerClass: 'border-b border-blue-200 bg-blue-50 text-blue-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.timeline]: {
		label: 'Timeline Mode',
		bannerClass: 'border-b border-indigo-200 bg-indigo-50 text-indigo-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.railroad]: {
		label: 'Railroad Diagram Mode',
		bannerClass: 'border-b border-slate-200 bg-slate-50 text-slate-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.electrical]: {
		label: 'Electrical Circuit Mode',
		bannerClass: 'border-b border-amber-200 bg-amber-50 text-amber-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.control]: {
		label: 'Control Logic Mode',
		bannerClass: 'border-b border-orange-200 bg-orange-50 text-orange-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.digital]: {
		label: 'Digital Circuit Mode',
		bannerClass: 'border-b border-lime-200 bg-lime-50 text-lime-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.pneumatic]: {
		label: 'Pneumatic Circuit Mode',
		bannerClass: 'border-b border-sky-200 bg-sky-50 text-sky-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.hydraulic]: {
		label: 'Hydraulic Circuit Mode',
		bannerClass: 'border-b border-teal-200 bg-teal-50 text-teal-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.hvac]: {
		label: 'HVAC System Mode',
		bannerClass: 'border-b border-cyan-200 bg-cyan-50 text-cyan-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.wardley]: {
		label: 'Wardley Map Mode',
		bannerClass: 'border-b border-purple-200 bg-purple-50 text-purple-900',
		contentMode: 'samples-only',
		footerHint: 'Use Sample Diagrams for templates'
	},
	[ProfileName.kanban]: {
		label: 'Kanban Mode',
		bannerClass: 'border-b border-violet-200 bg-violet-50 text-violet-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.gitgraph]: {
		label: 'GitGraph Mode',
		bannerClass: 'border-b border-zinc-200 bg-zinc-50 text-zinc-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.treemap]: {
		label: 'Treemap Mode',
		bannerClass: 'border-b border-emerald-200 bg-emerald-50 text-emerald-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.pid]: {
		label: 'PID Mode',
		bannerClass: 'border-b border-rose-200 bg-rose-50 text-rose-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	},
	[ProfileName.pedigree]: {
		label: 'Pedigree Mode',
		bannerClass: 'border-b border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900',
		contentMode: 'shapes',
		footerHint: 'Click a shape to insert it'
	}
};

export function getToolboxProfileMeta(profileName: ProfileName | null): ToolboxProfileMeta {
	if (!profileName) return defaultMeta;
	return metaByProfile[profileName] ?? defaultMeta;
}
