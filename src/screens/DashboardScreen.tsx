import { DashboardPaper } from '@/ui'
import { DashboardList, DashboardSidebar } from '@modules'

import type { FC } from 'react'

import { colors, Paper, Stack } from '@mui/material'

import { useWindowResize } from '@hooks'

export const DashboardScreen: FC = () => {
	const { match } = useWindowResize({
		matches: ({ width, height }) => width !== null && width >= 900,
	})

	const { match: minWidth } = useWindowResize({
		matches: ({ width, height }) => width !== null && width >= 650,
	})

	return (
		<Stack
			spacing={0.5}
			direction='row'
			height='100%'
			width='100%'
			alignItems='center'
			justifyContent='center'
			position='relative'
			sx={{
				'& > :first-of-type': {
					gap: 0,
					marginLeft: match ? undefined : 0,
				},
				'& > :nth-of-type(2)': {
					gap: 0,
					marginLeft: match ? undefined : 0,
				},
			}}
		>
			<DashboardSidebar fixed={match !== null && match} />
			<DashboardPaper sx={{ maxWidth: match ? '40%' : minWidth ? '50%' : '100%' }}>
				<DashboardList sidebarFixed={match !== null && match} />
			</DashboardPaper>
			{minWidth && <DashboardPaper sx={{ width: match ? '35%' : '50%' }}>2</DashboardPaper>}
		</Stack>
	)
}
