import { DashboardList, DashboardSidebar, DashboardViewing } from '@modules'
import { DashboardPaper } from '@ui'

import type { FC } from 'react'
import { useMemo } from 'react'
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

	const {
		isViewing,
		isAdding,
		isDashboard,
		showWithMinWidth,
		showList,
		showViewing,
		sidebarFixed,
		listMaxWidth,
		viewingWidth,
		stackStyles,
	} = useMemo(() => {
		const isViewing = pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT) && Boolean(id)
		const isAdding = pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD)
		const isDashboard = pathname === `/${PATHS.DASHBOARD.ROOT}`

		const showWithMinWidth = matchMap.mobile && (isAdding || isViewing)
		const sidebarFixed = matchMap.tablet
		const showList = !showWithMinWidth || isDashboard
		const showViewing = showWithMinWidth || !matchMap.mobile

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
			isViewing,
			isAdding,
			isDashboard,
			showWithMinWidth,
			showList,
			showViewing,
			sidebarFixed,
			listMaxWidth,
			viewingWidth,
			stackStyles,
		}
	}, [pathname, id, matchMap])

	console.log('render')

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
					<DashboardViewing />
				</DashboardPaper>
			)}
		</Stack>
	)
}
