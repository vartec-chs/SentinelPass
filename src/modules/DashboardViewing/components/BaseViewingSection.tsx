import { ScrollYBox } from '@/ui'

import { type FC } from 'react'

import {
	Box,
	Button,
	Divider,
	List,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material'

interface BaseViewingSectionProps {
	isAdding: boolean
	isViewing: boolean
	id?: string
}

export const BaseViewingSection: FC<BaseViewingSectionProps> = ({ id, isAdding, isViewing }) => {
	return (
		<Stack width='100%' height='100%' gap={0.5} justifyContent='space-between'>
			<Stack p={1} pt={0.5}>
				<Typography variant='h6'>
					{isAdding
						? 'Добавление нового пароля'
						: isViewing
							? 'Просмотр пароля'
							: 'Пароль не выбран'}
				</Typography>
			</Stack>
			<Divider />

			<ScrollYBox>
				<List sx={{ width: '100%', overflow: 'hidden', pr: 0.2 }}>
					{Array.from({ length: 10 }).map((_, index) => (
						<ListItemButton key={index}>
							<ListItemText primary={`Item ${index + 1}`} />
						</ListItemButton>
					))}
				</List>
			</ScrollYBox>
			<Stack>
				<Button size='large' variant='contained'>
					Отредактировать
				</Button>
			</Stack>
		</Stack>
	)
}
