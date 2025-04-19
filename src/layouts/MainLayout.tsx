import { AppBar } from '@modules'

import { type FC } from 'react'
import { Outlet } from 'react-router'

import { Box } from '@mui/material'

export const MainLayout: FC = () => {
	return (
		<Box
			component='main'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyItems: 'center',
				alignItems: 'center',
				gap: 0,
				height: '100vh',
				width: '100vw',
			}}
		>
			<AppBar />
			<Wrapper>
				<Outlet />
			</Wrapper>
		</Box>
	)
}

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<Box
			sx={(_) => ({
				display: 'flex',
				flexDirection: 'column',
				height: 'calc(100vh - 30px)',
				width: '100%',
				margin: 'auto',
				// position: 'relative',
				padding: 0.5,
				overflow: 'hidden',
				// maxHeight: '600px',
				// maxWidth: isDashboard ? '1070px' : '800px',
				// border: isDashboard ? (dashboardMatch ? 1 : undefined) : match ? 1 : undefined,
				// borderColor: theme.palette.divider,
				borderRadius: 1,
			})}
		>
			{children}
		</Box>
	)
}
