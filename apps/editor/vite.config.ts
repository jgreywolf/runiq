import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			'@runiq/editor-core': path.resolve(__dirname, '../../packages/editor-core/src/index.ts')
		}
	},
	// Force Vite dev server to bind on IPv4 localhost to avoid Windows ::1 EACCES issues
	server: {
		host: 'localhost'
	},
	test: {
		expect: { requireAssertions: true },
		coverage: {
			provider: 'v8',
			enabled: !process.env.CI
		},
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
