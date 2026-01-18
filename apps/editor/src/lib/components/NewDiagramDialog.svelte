<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { ProfileName } from '$lib/types';
	import Icon from '@iconify/svelte';
	import { handleNewDiagram } from '$lib/state/editorState.svelte';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	function createDiagramClick(type: ProfileName) {
		open = false;
		handleNewDiagram(type);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="bg-white sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-neutral-900">Create New Diagram</Dialog.Title>
			<Dialog.Description class="text-neutral-600"
				>Choose the type of diagram you want to create.</Dialog.Description
			>
		</Dialog.Header>

		<div class="grid grid-cols-2 gap-4 py-4">
			<!-- Regular Diagram Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.diagram)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-runiq-400 hover:bg-runiq-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-runiq-100 text-runiq-600 transition-colors group-hover:bg-runiq-200"
					>
						<Icon icon="material-symbols:flowchart-outline-sharp" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Diagram</h3>
						<p class="text-sm text-neutral-600">Flowcharts, UML, network diagrams</p>
					</div>
				</div>
			</button>

			<!-- Glyphset "smart art" Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.glyphset)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-runiq-400 hover:bg-runiq-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-runiq-100 text-runiq-600 transition-colors group-hover:bg-runiq-200"
					>
						<Icon icon="tabler:chart-pie-4-filled" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Glyphsets</h3>
						<p class="text-sm text-neutral-600">Pre-built diagrams, smart art, templates</p>
					</div>
				</div>
			</button>

			<!-- Sequence Diagram Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.sequence)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-200"
					>
						<Icon icon="tabler:arrows-left-right" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Sequence Diagram</h3>
						<p class="text-sm text-neutral-600">Interactions, messages, lifelines</p>
					</div>
				</div>
			</button>

			<!-- Timeline Diagram Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.timeline)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-indigo-400 hover:bg-indigo-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-200"
					>
						<Icon icon="tabler:timeline" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Timeline</h3>
						<p class="text-sm text-neutral-600">Chronological events, milestones, periods</p>
					</div>
				</div>
			</button>

			<!-- Kanban Board Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.kanban)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-rose-400 hover:bg-rose-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100 text-rose-600 transition-colors group-hover:bg-rose-200"
					>
						<Icon icon="tabler:layout-board" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Kanban</h3>
						<p class="text-sm text-neutral-600">Columns, cards, swimlanes</p>
					</div>
				</div>
			</button>

			<!-- GitGraph Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.gitgraph)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-slate-400 hover:bg-slate-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-200"
					>
						<Icon icon="tabler:git-branch" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">GitGraph</h3>
						<p class="text-sm text-neutral-600">Branches, commits, merges</p>
					</div>
				</div>
			</button>

			<!-- Treemap Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.treemap)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-amber-400 hover:bg-amber-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-200"
					>
						<Icon icon="tabler:layout-grid" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Treemap</h3>
						<p class="text-sm text-neutral-600">Hierarchical area layouts</p>
					</div>
				</div>
			</button>

			<!-- Electrical Circuit Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.electrical)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-amber-400 hover:bg-amber-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-200"
					>
						<Icon icon="tabler:bolt" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Electrical Schematic</h3>
						<p class="text-sm text-neutral-600">Circuit diagrams, logic gates, components</p>
					</div>
				</div>
			</button>

			<!-- Digital Circuit Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.digital)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-lime-400 hover:bg-lime-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-lime-100 text-lime-600 transition-colors group-hover:bg-lime-200"
					>
						<Icon icon="tabler:logic-xor" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Digital Circuit</h3>
						<p class="text-sm text-neutral-600">Modules, buses, hierarchical design</p>
					</div>
				</div>
			</button>

			<!-- Pneumatic Circuit Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.pneumatic)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-sky-400 hover:bg-sky-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-200"
					>
						<Icon icon="tabler:arrows-down-up" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Pneumatic Circuit</h3>
						<p class="text-sm text-neutral-600">Compressed air systems (ISO 1219-1)</p>
					</div>
				</div>
			</button>

			<!-- Hydraulic Circuit Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.hydraulic)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-teal-400 hover:bg-teal-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 transition-colors group-hover:bg-teal-200"
					>
						<Icon icon="tabler:flask-filled" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Hydraulic Circuit</h3>
						<p class="text-sm text-neutral-600">Fluid power systems (ISO 1219-1)</p>
					</div>
				</div>
			</button>

			<!-- Wardley Map Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.wardley)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-purple-400 hover:bg-purple-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200"
					>
						<Icon icon="tabler:chart-scatter" width="24" height="24" />
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Wardley Map</h3>
						<p class="text-sm text-neutral-600">Strategic mapping, evolution, value chain</p>
					</div>
				</div>
			</button>

			<!-- P&ID Diagram Option -->
			<button
				onclick={() => createDiagramClick(ProfileName.pid)}
				class="group flex cursor-pointer flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-emerald-400 hover:bg-emerald-50"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">P&ID Diagram</h3>
						<p class="text-sm text-neutral-600">Process diagrams (ISA-5.1 standard)</p>
					</div>
				</div>
			</button>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
