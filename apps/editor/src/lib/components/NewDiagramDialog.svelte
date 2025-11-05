<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		open: boolean;
		onOpenChange: (open: boolean) => void;
		onCreateDiagram: (
			type: 'diagram' | 'electrical' | 'pneumatic' | 'hydraulic' | 'wardley' | 'sequence' | 'pid'
		) => void;
	}

	let { open = $bindable(), onOpenChange, onCreateDiagram }: Props = $props();

	function createDiagram(
		type: 'diagram' | 'electrical' | 'pneumatic' | 'hydraulic' | 'wardley' | 'sequence' | 'pid'
	) {
		open = false;
		onCreateDiagram(type);
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
				onclick={() => createDiagram('diagram')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-runiq-400 hover:bg-runiq-50 cursor-pointer"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-runiq-100 text-runiq-600 transition-colors group-hover:bg-runiq-200"
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
								d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Diagram</h3>
						<p class="text-sm text-neutral-600">Flowcharts, UML, network diagrams</p>
					</div>
				</div>
			</button>

			<!-- Sequence Diagram Option -->
			<button
				onclick={() => createDiagram('sequence')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-200"
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
								d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Sequence Diagram</h3>
						<p class="text-sm text-neutral-600">Interactions, messages, lifelines</p>
					</div>
				</div>
			</button>

			<!-- Electrical Circuit Option -->
			<button
				onclick={() => createDiagram('electrical')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-amber-400 hover:bg-amber-50 cursor-pointer"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-200"
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
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Electrical Schematic</h3>
						<p class="text-sm text-neutral-600">Circuit diagrams, logic gates, components</p>
					</div>
				</div>
			</button>

			<!-- Pneumatic Circuit Option -->
			<button
				onclick={() => createDiagram('pneumatic')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-sky-400 hover:bg-sky-50 cursor-pointer"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-200"
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
								d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Pneumatic Circuit</h3>
						<p class="text-sm text-neutral-600">Compressed air systems (ISO 1219-1)</p>
					</div>
				</div>
			</button>

			<!-- Hydraulic Circuit Option -->
			<button
				onclick={() => createDiagram('hydraulic')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-teal-400 hover:bg-teal-50 cursor-pointer"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 transition-colors group-hover:bg-teal-200"
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
						<h3 class="font-semibold text-neutral-900">Hydraulic Circuit</h3>
						<p class="text-sm text-neutral-600">Fluid power systems (ISO 1219-1)</p>
					</div>
				</div>
			</button>

			<!-- Wardley Map Option -->
			<button
				onclick={() => createDiagram('wardley')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-purple-400 hover:bg-purple-50 cursor-pointer"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200"
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
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-neutral-900">Wardley Map</h3>
						<p class="text-sm text-neutral-600">Strategic mapping, evolution, value chain</p>
					</div>
				</div>
			</button>

			<!-- P&ID Diagram Option -->
			<button
				onclick={() => createDiagram('pid')}
				class="group flex flex-col items-start gap-2 rounded-lg border-2 border-neutral-300 bg-white p-4 text-left transition-all hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer"
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
