<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Runiq Editor - Visual Diagram DSL</title>
	<meta name="description" content="Interactive editor for Runiq - a markdown-friendly visual diagram DSL" />
</svelte:head>

<main class="h-screen overflow-hidden">
	{@render children?.()}
</main>
