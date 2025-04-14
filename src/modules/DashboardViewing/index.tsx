import { ScrollYBox } from '@ui'

import { type FC } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'

import { Button, Divider, IconButton, Stack, Typography } from '@mui/material'

import { ArrowLeftIcon, Trash2Icon } from 'lucide-react'

import { PATHS } from '@configs'

import { NotOperation } from './components/NotOperation'
import { AddNewPasswordForm } from './modules/AddNewPasswordForm'

export const DashboardViewing: FC = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const { id } = useParams()

	const isViewing = pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT) && Boolean(id)
	const isAdding = pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD)
	const isDashboard = pathname === `/${PATHS.DASHBOARD.ROOT}`

	const close = () => navigate(`/${PATHS.DASHBOARD.ROOT}`, { replace: true })
	if (isDashboard) return <NotOperation />

	return (
		<Stack width='100%' height='100%' gap={0.5} justifyContent='space-between' position='relative'>
			<Stack p={1} py={0.5} pl={0.5} gap={1} direction='row' alignItems='center'>
				<IconButton onClick={close} size='small'>
					<ArrowLeftIcon size={20} />
				</IconButton>

				<Typography variant='h6'>
					{isAdding
						? 'Добавление нового пароля'
						: isViewing
							? 'Просмотр пароля'
							: 'Пароль не выбран'}
				</Typography>
			</Stack>
			<Divider />

			<ScrollYBox>{isAdding && <AddNewPasswordForm />}</ScrollYBox>

			<Stack direction='row' gap={1} justifyContent='space-between'>
				<Button fullWidth size='large' variant='contained'>
					Отредактировать
				</Button>
				<Button size='large' variant='text' color='error'>
					<Trash2Icon size={20} />
				</Button>
			</Stack>
		</Stack>
	)
}
