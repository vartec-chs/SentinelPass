// screens/DashboardLayout.tsx
import { DashboardList, DashboardSidebar } from '@modules'
import { DashboardPaper } from '@ui'

import { FC, useMemo } from 'react'
import { Outlet, useLocation, useParams } from 'react-router'

import { Stack } from '@mui/material'

import { useWindowResizeContext } from '@providers'

import { PATHS } from '@configs'

export const DashboardLayout: FC = () => {
	const { matchMap, width, height } = useWindowResizeContext() // используем контекст
	const { pathname } = useLocation()
	// const { id } = useParams()

	const { showList, showViewing, sidebarFixed, listMaxWidth, viewingWidth, stackStyles } =
		useMemo(() => {
			const isViewing = pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT)
			const isAdding = pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD)
			const isDashboard = pathname === `/${PATHS.DASHBOARD.ROOT}`

			const showWithMinWidth = matchMap.mobile && (isViewing || isAdding)
			const showList = !showWithMinWidth || isDashboard
			const showViewing = showWithMinWidth || !matchMap.mobile

			const sidebarFixed = matchMap.tablet
			const listMaxWidth = sidebarFixed ? '40%' : !matchMap.mobile ? '50%' : '100%'
			const viewingWidth = sidebarFixed ? '35%' : '100%'

			const stackStyles = {
				'& > :first-of-type': {
					gap: 0,
					marginLeft: sidebarFixed ? undefined : 0,
				},
				'& > :nth-of-type(2)': {
					gap: 0,
					marginLeft: sidebarFixed ? undefined : 0,
				},
			}

			return {
				showList,
				showViewing,
				sidebarFixed,
				listMaxWidth,
				viewingWidth,
				stackStyles,
			}
		}, [matchMap, width, height])

	return (
		<Stack
			spacing={0.5}
			direction='row'
			height='100%'
			width='100%'
			alignItems='center'
			justifyContent='center'
			position='relative'
			sx={stackStyles}
		>
			<DashboardSidebar fixed={sidebarFixed} />
			{showList && (
				<DashboardPaper sx={{ maxWidth: listMaxWidth }}>
					<DashboardList sidebarFixed={sidebarFixed} />
				</DashboardPaper>
			)}
			{showViewing && (
				<DashboardPaper sx={{ width: viewingWidth }}>
					<Outlet />
				</DashboardPaper>
			)}
		</Stack>
	)
}
