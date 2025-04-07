import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [react()],

	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@configs': resolve(__dirname, 'src/configs'),
			'@screens': resolve(__dirname, 'src/screens'),
			'@hooks': resolve(__dirname, 'src/hooks'),
			'@components': resolve(__dirname, 'src/components'),
			'@layouts': resolve(__dirname, 'src/layouts'),
			'@ui': resolve(__dirname, 'src/ui'),
			'@modules': resolve(__dirname, 'src/modules'),
			'@zod-schemas': resolve(__dirname, 'src/zod-schemas'),
			'@api': resolve(__dirname, 'src/api'),
			'@states': resolve(__dirname, 'src/states'),
			'@providers': resolve(__dirname, 'src/providers'),
			'@assets': resolve(__dirname, 'src/assets'),
			'@utils': resolve(__dirname, 'src/utils'),
			'@ts': resolve(__dirname, 'src/types'),
		},
	},

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**'],
		},
	},
}))
