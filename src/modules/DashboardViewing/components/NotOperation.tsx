import { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button, Stack, Typography } from '@mui/material'

import { PlusIcon } from 'lucide-react'

import { PATHS } from '@configs'

export const NotOperation: FC = () => {
	const navigate = useNavigate()

	const redirect = () => navigate(PATHS.DASHBOARD.ADD_NEW_PASSWORD)

	return (
		<Stack
			width='100%'
			height='100%'
			direction='column'
			justifyContent='center'
			alignItems='center'
			gap={1}
		>
			<Typography textAlign='center' variant='body1' sx={{ opacity: 0.5 }}>
				Элемент не выбран для просмотра/редактирования
			</Typography>
			<Button onClick={redirect} variant='text' size='large' startIcon={<PlusIcon size={20} />}>
				Добавить
			</Button>
		</Stack>
	)
}
