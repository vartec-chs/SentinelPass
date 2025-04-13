import { type FC, forwardRef, type PropsWithChildren } from 'react'

import { Box } from '@mui/material'

interface ScrollYBox extends PropsWithChildren {
	h?: string | number
	w?: string | number
}

export const ScrollYBox: FC<ScrollYBox> = forwardRef<HTMLDivElement, ScrollYBox>(
	({ children, h, w, ...props }, ref) => {
		return (
			<Box
				ref={ref}
				{...props}
				sx={(theme) => ({
					width: w || '100%',

					height: h || '100%',
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
				{children}
			</Box>
		)
	},
)
