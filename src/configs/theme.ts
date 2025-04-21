import {
	Components,
	createTheme,
	CssVarsTheme,
	Theme,
	TypographyVariantsOptions,
} from '@mui/material'
import { colors as muiColors } from '@mui/material'

const components: Components<CssVarsTheme> = {
	// MuiSwitch: {
	// 	styleOverrides: {
	// 		root: {
	// 			width: 42,
	// 			height: 26,
	// 			padding: 0,
	// 			margin: 8,
	// 		},
	// 		switchBase: {
	// 			padding: 1,
	// 			'&$checked, &$colorPrimary$checked, &$colorSecondary$checked': {
	// 				transform: 'translateX(16px)',
	// 				color: '#fff',
	// 				'& + $track': {
	// 					opacity: 1,
	// 					border: 'none',
	// 				},
	// 			},
	// 		},
	// 		thumb: {
	// 			width: 24,
	// 			height: 24,
	// 		},
	// 		track: {
	// 			borderRadius: 13,
	// 			border: '1px solid #bdbdbd',
	// 			backgroundColor: '#fafafa',
	// 			opacity: 1,
	// 			transition:
	// 				'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	// 		},
	// 	},
	// },

	MuiCssBaseline: {
		styleOverrides: (theme: CssVarsTheme) => ({
			body: {
				overflow: 'hidden',
				backgroundColor: theme.palette.mode === 'dark' ? muiColors.grey[900] : muiColors.grey[100],
			},
		}),
	},
}
const colors = {
	primary: '#005BFF',
	secondary: '#f1117e',
	warning: '#ffa800',
	info: '#00a2ff',
	success: '#00be6c',
}
const typography: TypographyVariantsOptions = {
	fontFamily: '"Rubik","Roboto", "Helvetica", "Arial", sans-serif',
}
const shape: Theme['shape'] = {
	borderRadius: 10,
}
const spacing: number = 8
const direction: Theme['direction'] = 'ltr'

export const darkTheme: Theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: colors.primary,
		},
		secondary: {
			main: colors.secondary,
		},
		warning: {
			main: colors.warning,
		},
		info: {
			main: colors.info,
		},
		success: {
			main: colors.success,
		},
	},
	typography,
	spacing,
	direction,
	shape,
	components,
})

export const lightTheme: Theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: colors.primary,
		},
		secondary: {
			main: colors.secondary,
		},
		warning: {
			main: colors.warning,
		},
		info: {
			main: colors.info,
		},
		success: {
			main: colors.success,
		},
	},
	typography,
	spacing,
	direction,
	shape,
	components,
})
