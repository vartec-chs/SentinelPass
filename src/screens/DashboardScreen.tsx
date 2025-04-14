import { DashboardList, DashboardSidebar, DashboardViewing } from '@modules'
import { DashboardPaper } from '@ui'

import type { FC } from 'react'
import { useLocation, useParams } from 'react-router'

import { Stack } from '@mui/material'

import { useWindowResize } from '@hooks'

import { MATCHES, PATHS } from '@configs'

export const DashboardScreen: FC = () => {
	const { matchMap } = useWindowResize({
		debounce: 300,
		leading: true,
		matches: MATCHES,
	})
	const { pathname } = useLocation()
	const { id } = useParams()

	const isViewing = pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT) && Boolean(id)
	const isAdding = pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD)
	const showWithMinWidth = matchMap.mobile && (isAdding || isViewing)
	const isDashboard = pathname === `/${PATHS.DASHBOARD.ROOT}`

	console.log(showWithMinWidth, id)

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
					marginLeft: matchMap.tablet ? undefined : 0,
				},
				'& > :nth-of-type(2)': {
					gap: 0,
					marginLeft: matchMap.tablet ? undefined : 0,
				},
			}}
		>
			<DashboardSidebar fixed={matchMap.tablet} />
			{(!showWithMinWidth || isDashboard) && (
				<DashboardPaper
					sx={{ maxWidth: matchMap.tablet ? '40%' : !matchMap.mobile ? '50%' : '100%' }}
				>
					<DashboardList sidebarFixed={matchMap.tablet} />
				</DashboardPaper>
			)}
			{(showWithMinWidth || !matchMap.mobile) && (
				<DashboardPaper sx={{ width: matchMap.tablet ? '35%' : '100%' }}>
					<DashboardViewing />
				</DashboardPaper>
			)}
		</Stack>
	)
}
