import { ScrollYBox } from '@/ui'

import { type FC } from 'react'

import {
	Button,
	Divider,
	List,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material'

import { XIcon } from 'lucide-react'

interface BaseViewingSectionProps {
	isAdding: boolean
	isViewing: boolean
	id?: string
}

export const BaseViewingSection: FC<BaseViewingSectionProps> = ({ id, isAdding, isViewing }) => {
	return (
		<Stack width='100%' height='100%' gap={0.5} justifyContent='space-between'>
			<Stack p={1} pt={0.5}>
				<Button size='large' color='warning' variant='text'>
					<XIcon size={20} />
				</Button>
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
