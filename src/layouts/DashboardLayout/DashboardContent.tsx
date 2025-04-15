import { DashboardList } from '@modules'
import { DashboardPaper } from '@ui'

import { FC } from 'react'
import { Outlet, useLocation } from 'react-router'

import { MatchMap } from '@hooks'

import { PATHS } from '@configs'

// DashboardContent.tsx — зависит от pathname
export const DashboardContent: FC<{
	matchMap: MatchMap<string>
	sidebarFixed: boolean
	listMaxWidth: string
	viewingWidth: string
}> = ({ matchMap, sidebarFixed, listMaxWidth, viewingWidth }) => {
	const { pathname } = useLocation()

	const isViewing = pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT)
	const isAdding = pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD)
	const isDashboard = pathname === PATHS.DASHBOARD.ROOT

	const showWithMinWidth = matchMap.mobile && (isViewing || isAdding)
	const showList = !showWithMinWidth || isDashboard
	const showViewing = showWithMinWidth || !matchMap.mobile

	return (
		<>
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
		</>
	)
}
