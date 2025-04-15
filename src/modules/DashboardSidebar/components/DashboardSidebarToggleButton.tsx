import { PATHS } from '@/configs'
import { useWindowResizeContext } from '@/providers'

import { FC, useEffect, useMemo } from 'react'
import { useLocation, useParams } from 'react-router'

import { IconButton } from '@mui/material'

import { MenuIcon, XIcon } from 'lucide-react'

interface Props {
	fixed: boolean
	open: boolean
	onToggle: () => void
	setOpen: (open: boolean) => void
}

export const DashboardSidebarToggleButton: FC<Props> = ({ open, onToggle, setOpen, fixed }) => {
	const { pathname } = useLocation()
	const { id } = useParams()
	const { matchMap } = useWindowResizeContext()

	const isViewing = useMemo(
		() => pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT) && Boolean(id),
		[pathname, id],
	)
	const isAdding = useMemo(() => pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD), [pathname])
	const showWithMinWidth = useMemo(
		() => matchMap.mobile && (isAdding || isViewing),
		[matchMap.mobile, isAdding, isViewing],
	)

	useEffect(() => {
		if (showWithMinWidth) setOpen(false)
	}, [showWithMinWidth])

	if (fixed || showWithMinWidth) return null

	return (
		<IconButton onClick={onToggle} sx={{ position: 'absolute', top: 8.5, left: 8, zIndex: 2000 }}>
			{open ? <XIcon size={24} /> : <MenuIcon size={24} />}
		</IconButton>
	)
}
