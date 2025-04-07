import { type FC } from 'react'

import { Box, Fab, Pagination, Stack } from '@mui/material'

import { PlusIcon } from 'lucide-react'

import { Header, List } from './modules'

interface DashboardListProps {
	sidebarFixed: boolean
}

export const DashboardList: FC<DashboardListProps> = ({ sidebarFixed }) => {
	return (
		<Stack sx={{ height: '100%', position: 'relative' }} gap={1}>
			<Header sidebarFixed={sidebarFixed} />
			<List />
			<Pagination count={5} color='standard' />
			<Fab color='primary' aria-label='add' sx={{ position: 'absolute', bottom: 0, right: 0 }}>
				<PlusIcon />
			</Fab>
		</Stack>
	)
}
