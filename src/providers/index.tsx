import { ThemeProvider } from './theme-providers'
import { ToastsProvider } from './toasts-provider'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<ToastsProvider />
			{children}
		</ThemeProvider>
	)
}

export { useTheme } from './theme-providers'
