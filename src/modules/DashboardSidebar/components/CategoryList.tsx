import { type FC } from 'react'

import {
	Box,
	Divider,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material'

import { FoldersIcon, Plus, User2 } from 'lucide-react'

import { STORAGE_TYPE } from '@configs'

export const CategoryList: FC = () => {
	return (
		<Stack sx={{ width: '100%', overflow: 'hidden', pr: 0.2 }}>
			<Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'>
				<Stack direction='row' alignItems='center' gap={1}>
					<FoldersIcon size={20} />
					<Typography variant='body2'>Категории:</Typography>
				</Stack>

				<IconButton size='small'>
					<Plus size={20} />
				</IconButton>
			</Stack>
			<Box
				sx={(theme) => ({
					width: '100%',
					overflow: 'auto',
					scrollbarGutter: 'stable', // резервируем место под скроллбар

					'&::-webkit-scrollbar': {
						width: '4px', // Ширина скроллбара
					},
					'&::-webkit-scrollbar-track': {
						background: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0', // Цвет фона
						borderRadius: '8px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: theme.palette.mode === 'dark' ? '#444' : '#bbb', // Цвет ползунка
						borderRadius: '8px',
						'&:hover': {
							background: theme.palette.mode === 'dark' ? '#666' : '#999', // Цвет при наведении
						},
					},
				})}
			>
				<List sx={{ width: '100%', overflow: 'hidden', pr: 0.2 }}>
					{Object.entries(STORAGE_TYPE).map(([key, value]) => (
						<ListItemButton
							key={key}
							sx={{
								borderRadius: 1,
								py: 0.5,
								px: 1,
								mb: 0.3,
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}
						>
							{<value.icon size={20} />}
							<ListItemText sx={{ '& .MuiTypography-root': { fontSize: 14 } }}>
								{value.name}
							</ListItemText>
						</ListItemButton>
					))}

					<Divider />
					{Array.from({ length: 100 }).map((_, index) => (
						<ListItemButton
							sx={(_) => ({
								borderRadius: 1,
								py: 0.5,
								px: 1,
								mt: index === 0 ? 0.3 : 0,
								mb: index === 99 ? 0 : 0.3,
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							})}
							selected={index === 0}
							key={index}
						>
							<User2 size={20} />
							<ListItemText
								sx={{ '& .MuiTypography-root': { fontSize: 14 } }}
								primary={`Category ${index + 1}`}
							/>
						</ListItemButton>
					))}
				</List>
			</Box>
		</Stack>
	)
}
