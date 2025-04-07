import { type FC } from 'react'

import { Box, List, ListItemButton, ListItemText } from '@mui/material'

export const CategoryList: FC = () => {
	return (
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
				{Array.from({ length: 100 }).map((_, index) => (
					<ListItemButton
						sx={(_) => ({
							borderRadius: 1,
							py: 0.5,
							px: 1,
							mb: index === 99 ? 0 : 0.3,
						})}
						selected={index === 0}
						key={index}
					>
						<ListItemText primary={`Category ${index + 1}`} />
					</ListItemButton>
				))}
			</List>
		</Box>
	)
}
