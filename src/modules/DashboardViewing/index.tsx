import { type FC } from 'react'

import { Button, Stack, Typography } from '@mui/material'

export const DashboardViewing: FC = () => {
	return (
		<Stack
			alignItems='center'
			justifyContent='center'
			sx={{ height: '100%', position: 'relative' }}
			gap={1}
		>
			<Stack direction='column' alignItems='center' justifyContent='center' gap={1}>
				<Typography textAlign='center' variant='body2' sx={{ opacity: 0.5 }}>
					Вы не выбрали пароль для просмотра/редактирования
				</Typography>
				<Button>Добавить</Button>
			</Stack>
		</Stack>
	)
}
