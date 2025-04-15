import { ConfirmProvider } from 'material-ui-confirm'

import { ThemeProvider } from './theme-providers'
import { ToastsProvider } from './toasts-provider'
import { useWindowResizeContext, WindowResizeProvider } from './WindowResizeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<WindowResizeProvider>
				<ToastsProvider />
				<ConfirmProvider>{children}</ConfirmProvider>
			</WindowResizeProvider>
		</ThemeProvider>
	)
}

export { useTheme } from './theme-providers'

export { useWindowResizeContext }
