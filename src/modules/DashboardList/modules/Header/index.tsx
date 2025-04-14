import { type FC } from 'react'

import { IconButton, InputAdornment, Stack, TextField } from '@mui/material'

import { SearchIcon } from 'lucide-react'

import { HeaderMenu } from './HeaderMenu'

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
			<Stack width='100%' direction='row' alignItems='center' gap={1}>
				<TextField
					fullWidth
					size='small'
					variant='outlined'
					label='Поиск'
					placeholder='Поиск в All'
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton size='small'>
										<SearchIcon size={18} />
									</IconButton>
								</InputAdornment>
							),
						},
					}}
				/>
				<HeaderMenu />
			</Stack>
		</Stack>
	)
}
