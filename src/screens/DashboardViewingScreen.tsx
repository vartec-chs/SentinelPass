// screens/DashboardScreen.tsx
import { DashboardViewing } from '@modules'

import { FC, useMemo } from 'react'
import { useLocation, useParams } from 'react-router'

import { PATHS } from '@configs'

export const DashboardViewingScreen: FC = () => {
	const { pathname } = useLocation()
	const { id } = useParams()

	console.log('rerender DashboardViewingScreen')

	const shouldShowViewer = useMemo(() => {
		const isViewing = pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT) && Boolean(id)
		const isAdding = pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD)
		return isViewing || isAdding
	}, [pathname, id])

	if (shouldShowViewer) {
		return <DashboardViewing />
	}

	return null
}
