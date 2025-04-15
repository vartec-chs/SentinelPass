import { FC } from 'react'

import { Divider, Stack } from '@mui/material'

import { MainSection } from './MainSection'
import { SelectStorageMode } from './SelectStorageMode'

interface Props {
	fixed: boolean
}

export const SidebarContent: FC<Props> = ({ fixed }) => {
	console.log('rerender SidebarContent')

	return (
		<Stack sx={{ width: '100%', height: '100%' }} direction='column' gap={1.5}>
			<Stack
				ml={fixed ? 0 : 6}
				alignItems='center'
				justifyContent='flex-end'
				direction='row'
				gap={1}
			>
				<SelectStorageMode />
			</Stack>
			<Divider />
			<MainSection />
		</Stack>
	)
}
