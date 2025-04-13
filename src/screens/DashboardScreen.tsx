import { DashboardList, DashboardSidebar, DashboardViewing } from '@modules'
import { DashboardPaper } from '@ui'

import type { FC } from 'react'
import { useLocation, useParams } from 'react-router'

import { Stack } from '@mui/material'

import { useWindowResize } from '@hooks'

import { PATHS } from '@configs'

export const DashboardScreen: FC = () => {
	const { match } = useWindowResize({
		matches: ({ width, height }) => width !== null && width >= 900,
	})

	const { match: minWidth } = useWindowResize({
		matches: ({ width, height }) => width !== null && width <= 650,
	})

	const { pathname } = useLocation()

	const { id } = useParams()

	const isViewing = pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT) && Boolean(id)
	const isAdding = pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD)
	const showWithMinWidth = minWidth && (isAdding || isViewing)
	const isDashboard = pathname === `/${PATHS.DASHBOARD.ROOT}`

	console.log(showWithMinWidth)

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
			{(!showWithMinWidth || isDashboard) && (
				<DashboardPaper sx={{ maxWidth: match ? '40%' : !minWidth ? '50%' : '100%' }}>
					<DashboardList sidebarFixed={match !== null && match} />
				</DashboardPaper>
			)}
			{(showWithMinWidth || !minWidth) && (
				<DashboardPaper sx={{ width: match ? '35%' : '100%' }}>
					<DashboardViewing />
				</DashboardPaper>
			)}
		</Stack>
	)
}
