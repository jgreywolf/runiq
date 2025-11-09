<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { BookOpen, Github, Keyboard, FileText, HelpCircle } from 'lucide-svelte';

	function openDocs() {
		window.open('https://www.runiq.org/', '_blank');
	}

	function openExamples() {
		window.open('https://www.runiq.org/examples/', '_blank');
	}

	function openGitHub() {
		window.open('https://github.com/jgreywolf/runiq', '_blank');
	}

	function showKeyboardShortcuts() {
		// TODO: Implement keyboard shortcuts modal
		alert('Keyboard shortcuts:\n\nCtrl+S: Save\nCtrl+N: New diagram\nCtrl+E: Export');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 cursor-pointer"
		title="Help & Documentation"
	>
		<HelpCircle class="h-4 w-4" />
		<span>Help</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-56">
		<DropdownMenu.Label>Help & Resources</DropdownMenu.Label>
		<DropdownMenu.Separator />
		
		<DropdownMenu.Item onclick={openDocs} class="cursor-pointer">
			<BookOpen class="mr-2 h-4 w-4" />
			<span>Documentation</span>
			<DropdownMenu.Shortcut>F1</DropdownMenu.Shortcut>
		</DropdownMenu.Item>

		<DropdownMenu.Item onclick={openExamples} class="cursor-pointer">
			<FileText class="mr-2 h-4 w-4" />
			<span>View Examples</span>
		</DropdownMenu.Item>

		<DropdownMenu.Item onclick={showKeyboardShortcuts} class="cursor-pointer">
			<Keyboard class="mr-2 h-4 w-4" />
			<span>Keyboard Shortcuts</span>
		</DropdownMenu.Item>

		<DropdownMenu.Separator />

		<DropdownMenu.Item onclick={openGitHub} class="cursor-pointer">
			<Github class="mr-2 h-4 w-4" />
			<span>View on GitHub</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
