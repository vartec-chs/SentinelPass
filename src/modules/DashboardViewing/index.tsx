import { ScrollYBox } from '@/ui'

import { type FC } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'

import {
	Button,
	Divider,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material'

import { Trash2Icon, XIcon } from 'lucide-react'

import { PATHS } from '@configs'

import { AddNewPasswordForm } from './modules/AddNewPasswordForm'

export const DashboardViewing: FC = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const { id } = useParams()

	const isViewing = pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT) && Boolean(id)
	const isAdding = pathname.includes(PATHS.DASHBOARD.ADD_NEW_PASSWORD)

	const close = () => navigate(`/${PATHS.DASHBOARD.ROOT}`, { replace: true })

	return (
		<Stack width='100%' height='100%' gap={0.5} justifyContent='space-between' position='relative'>
			<Stack p={1} py={0.5} direction='row' justifyContent='space-between'>
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
				<Button onClick={close} size='large' color='warning' variant='text'>
					<XIcon size={20} />
				</Button>
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
