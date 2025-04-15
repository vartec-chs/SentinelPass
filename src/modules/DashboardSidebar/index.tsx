import { FC, memo, useMemo, useState } from 'react'

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
			<DashboardSidebarDrawer
				fixed={fixed}
				open={drawerOpen}
				onClose={() => setOpen(false)}
			/>
		</>
	)
})
