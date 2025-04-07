import { createContext, useContext, useState } from 'react'

import { CssBaseline, GlobalStyles, ThemeProvider as MuiThemeProvider } from '@mui/material'

import { darkTheme, lightTheme } from '@configs'

type ThemeContextType = {
	theme: 'light' | 'dark'
	setTheme: (theme: 'light' | 'dark') => void
}

export const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
	setTheme: () => {},
})

// const globalStyles = (
//   <GlobalStyles
//     styles={{
//       '*::-webkit-scrollbar': {
//         width: '8px',
//       },
//       '*::-webkit-scrollbar-track': {
//         background: '#1e1e1e',
//         borderRadius: '4px',
//       },
//       '*::-webkit-scrollbar-thumb': {
//         background: '#555',
//         borderRadius: '4px',
//       },
//       '*::-webkit-scrollbar-thumb:hover': {
//         background: '#777',
//       },
//     }}
//   />
// )

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const localTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
	const [theme, setThemeState] = useState<'light' | 'dark'>(localTheme || 'light')

	const setTheme = (theme: 'light' | 'dark') => {
		setThemeState(theme)
		localStorage.setItem('theme', theme)
	}

	const contextValue = {
		theme,
		setTheme,
	}

	return (
		<ThemeContext.Provider value={contextValue}>
			<MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
				<CssBaseline />
				{/* {globalStyles} */}
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}
