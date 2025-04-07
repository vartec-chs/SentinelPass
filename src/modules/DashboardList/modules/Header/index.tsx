import { type FC } from 'react'

import { Paper, Stack, TextField, Typography } from '@mui/material'

import { Home } from 'lucide-react'

import HeaderMenu from './HeaderMenu'

interface HeaderProps {
	sidebarFixed: boolean
}

export const Header: FC<HeaderProps> = ({ sidebarFixed }) => {
	return (
		<Stack
			component='header'
			sx={(theme) => ({
				width: '100%',
				height: '48px',
				pl: sidebarFixed ? 0 : 6,
			})}
		>
			<Stack  width='100%' direction='row' alignItems='center' gap={1}>
				<TextField
					fullWidth
					size='small'
					variant='outlined'
					label='Search'
					placeholder='Search in All'
				/>
				<HeaderMenu />
			</Stack>
		</Stack>
	)
}
