import { type FC, memo } from 'react'
import { useNavigate } from 'react-router'

import { Box, Fab, Pagination, Stack } from '@mui/material'

import { PlusIcon } from 'lucide-react'

import { PATHS } from '@configs'

import { Header, List } from './modules'

interface DashboardListProps {
	sidebarFixed: boolean
}

export const DashboardList: FC<DashboardListProps> = memo(({ sidebarFixed }) => {
	const navigate = useNavigate()

	const handleAddNewPassword = () => {
		navigate(PATHS.DASHBOARD.ADD_NEW_PASSWORD)
	}

	return (
		<Stack sx={{ height: '100%', position: 'relative' }} gap={1}>
			<Header sidebarFixed={sidebarFixed} />
			<List />
			<Pagination count={5} color='standard' />
			<Fab
				onClick={handleAddNewPassword}
				color='primary'
				aria-label='add'
				sx={{ position: 'absolute', bottom: 0, right: 0 }}
			>
				<PlusIcon />
			</Fab>
		</Stack>
	)
})
