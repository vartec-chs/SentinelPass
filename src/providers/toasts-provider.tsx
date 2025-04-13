import { FC } from 'react'
import { Toaster } from 'react-hot-toast'

import { colors, useTheme } from '@mui/material'

export const ToastsProvider: FC = () => {
	const {
		palette: { mode },
		typography,
	} = useTheme()
	return (
		<Toaster
			position={'bottom-right'}
			gutter={8}
			containerStyle={{
				inset: 10,
			}}
			toastOptions={{
				duration: 5000,
				style: {
					maxWidth: 400,
					borderRadius: 8,
					width: 'auto',
					backgroundColor: mode === 'light' ? colors.grey[100] : colors.grey[900],
					color: mode === 'light' ? '#333' : '#fff',
					fontFamily: typography.fontFamily,
				},
			}}
		/>
	)
}
