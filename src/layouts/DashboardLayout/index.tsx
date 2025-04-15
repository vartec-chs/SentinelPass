// screens/DashboardLayout.tsx
import { DashboardSidebar } from '@modules'

import { FC, useMemo } from 'react'
import { Outlet } from 'react-router'

import { Stack } from '@mui/material'

import { useWindowResizeContext } from '@providers'

export * from './DashboardRenderer'

export const DashboardLayout: FC = () => {
	const { matchMap } = useWindowResizeContext()
	const sidebarFixed = matchMap.tablet
	const listMaxWidth = sidebarFixed ? '40%' : !matchMap.mobile ? '50%' : '100%'
	const viewingWidth = sidebarFixed ? '35%' : '100%'

	const stackStyles = useMemo(
		() => ({
			'& > :first-of-type': {
				gap: 0,
				marginLeft: sidebarFixed ? undefined : 0,
			},
			'& > :nth-of-type(2)': {
				gap: 0,
				marginLeft: sidebarFixed ? undefined : 0,
			},
		}),
		[sidebarFixed],
	)

	console.log('rerender DashboardLayout')

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
			<Outlet context={{ sidebarFixed, listMaxWidth, viewingWidth, matchMap }} />
		</Stack>
	)
}
