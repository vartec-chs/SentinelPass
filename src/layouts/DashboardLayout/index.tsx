import { type FC } from 'react'
import { Outlet } from 'react-router'

import { Box } from '@mui/material'

export const DashboardLayout: FC = () => {
	return (
		<Box sx={{ width: '100%', height: '100%' }}>
			<Outlet />
		</Box>
	)
}
