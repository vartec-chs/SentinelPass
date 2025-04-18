import { FC, memo, useState } from 'react'

import { Box, Portal } from '@mui/material'

import { DashboardSidebarDrawer } from './components/DashboardSidebarDrawer'
import { DashboardSidebarToggleButton } from './components/DashboardSidebarToggleButton'

interface DashboardSidebarProps {
	fixed?: boolean
}

export const DashboardSidebar: FC<DashboardSidebarProps> = memo(({ fixed = false }) => {
	const [open, setOpen] = useState(fixed)

	const toggleDrawer = () => setOpen((prev) => !prev)

	const drawerOpen = fixed || open

	return (
		<>
			<DashboardSidebarToggleButton
				fixed={fixed}
				open={drawerOpen}
				onToggle={toggleDrawer}
				setOpen={setOpen}
			/>
			<DashboardSidebarDrawer fixed={fixed} open={drawerOpen} onClose={() => setOpen(false)} />

			{!fixed && open && (
				<Portal container={() => document.getElementById('root')!}>
					<Box
						onClick={() => setOpen(false)}
						sx={{
							width: '100%',
							height: '100%',
							position: 'fixed',
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 999,
						}}
					/>
				</Portal>
			)}
		</>
	)
})
