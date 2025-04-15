import { FC, memo } from 'react'

import { Drawer } from '@mui/material'

import { SidebarContent } from './SidebarContent'

interface Props {
	fixed: boolean
	open: boolean
	onClose: () => void
}

export const DashboardSidebarDrawer: FC<Props> = memo(({ fixed, open, onClose }) => {
	// const drawerWidth = useMemo(() => (fixed ? '25%' : '0'), [fixed])
	const drawerWidth = fixed ? '25%' : '0'
	return (
		<Drawer
			// ref={drawerRef}
			variant='permanent'
			anchor='right'
			open={open}
			onClose={onClose}
			style={{
				height: '100%',
				paddingBottom: 2,
				width: drawerWidth,
			}}
			sx={(theme) => ({
				width: drawerWidth,
				'& .MuiDrawer-paper': {
					position: 'relative',
					borderRadius: 1,
					boxSizing: 'border-box',
					padding: theme.spacing(1),
					width: fixed ? '100%' : '300px',
					left: 0,
					top: 1,
					border: !fixed ? `1px solid ${theme.palette.divider}` : 'none',
					transform: open ? 'translateX(0)' : 'translateX(-120%)',
					transition: 'transform 0.3s ease-in-out',
				},
			})}
		>
			<SidebarContent fixed={fixed} />
		</Drawer>
	)
})
