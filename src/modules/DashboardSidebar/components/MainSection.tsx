import { Segment, SegmentedControl } from '@/ui'

import { type FC, useState } from 'react'

import { Box, MenuItem, Stack, TextField } from '@mui/material'

import { Home, KeyRound, SquareAsterisk, Star } from 'lucide-react'

import { BASE_FILTER, STORAGE_TYPE } from '@configs'

import { CategoryList } from './CategoryList'

export const MainSection: FC = () => {
	const [value, setValue] = useState(STORAGE_TYPE.PASSWORDS)
	const [filter, setFilter] = useState(BASE_FILTER.FAVORITE)

	return (
		<Stack sx={{ width: '100%', height: 'calc(100% - 48px)' }} direction='column' gap={1}>
			<TextField
				id='select'
				label='Storage'
				value={value}
				select
				size='small'
				variant='outlined'
				onChange={(e) => setValue(e.target.value)}
				sx={(theme) => ({
					'& .MuiInputBase-root': {
						borderColor: theme.palette.divider,
						borderRadius: 1.5,
						'& .MuiSelect-select': {
							display: 'flex',
							alignItems: 'center',
							gap: 1,
						},
					},
				})}
			>
				<MenuItem
					sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
					value={STORAGE_TYPE.PASSWORDS}
				>
					<SquareAsterisk />
					Passwords
				</MenuItem>
				<MenuItem
					sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
					value={STORAGE_TYPE.AUTHENTICATION}
				>
					<KeyRound />
					Authentication
				</MenuItem>
			</TextField>

			<Stack justifyContent='center'>
				<SegmentedControl
					sx={(theme) => ({
						height: '40px',
						width: '100%',
						bgcolor: 'transparent',
						border: 1,
						borderColor: theme.palette.divider,
					})}
					value={filter}
					onChange={(_, value) => setFilter(value)}
				>
					<Segment
						sx={{ height: '40px', width: '49%' }}
						value={BASE_FILTER.FAVORITE}
						label={
							<Stack alignItems='center' direction='row' sx={{ gap: 1 }}>
								<Star size={16} />
								Favorite
							</Stack>
						}
					/>
					<Segment
						sx={{ height: '40px', width: '49%' }}
						value={BASE_FILTER.ALL}
						label={
							<Stack alignItems='center' direction='row' sx={{ gap: 1 }}>
								<Home size={16} />
								All
							</Stack>
						}
					/>
				</SegmentedControl>
			</Stack>
			<CategoryList />
		</Stack>
	)
}
