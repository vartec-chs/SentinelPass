import { type FC } from 'react'

import { Button, IconButton, Stack } from '@mui/material'

import { Settings, Trash2 } from 'lucide-react'

import { CategoryList } from './CategoryList'
import { TagsList } from './TagsList'

export const MainSection: FC = () => {
	return (
		<Stack sx={{ width: '100%', height: 'calc(100% - 48px)' }} direction='column' gap={1}>
			<CategoryList />
			<TagsList />
			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
				sx={{ width: '100%' }}
			>
				<Button size='small' color='error' startIcon={<Trash2 size={20} />}>
					Корзина
				</Button>
				<IconButton size='medium'>
					<Settings size={18} />
				</IconButton>
			</Stack>
		</Stack>
	)
}
