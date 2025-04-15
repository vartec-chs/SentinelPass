import { MatchMap } from '@/hooks'
import { DashboardList } from '@modules'
import { DashboardPaper } from '@ui'

import { FC } from 'react'
import { useLocation, useOutletContext } from 'react-router'
import { Outlet } from 'react-router'

import { PATHS } from '@configs'

export const DashboardRenderer: FC = () => {
	const { sidebarFixed, listMaxWidth, viewingWidth, matchMap } = useOutletContext<{
		sidebarFixed: boolean
		listMaxWidth: string
		viewingWidth: string
		matchMap: MatchMap<string>
	}>()
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
