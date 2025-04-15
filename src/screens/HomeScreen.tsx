import { useConfirm } from 'material-ui-confirm'

import { type FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

import { Button, Divider, Paper, Stack, Typography } from '@mui/material'

import { LockKeyhole } from 'lucide-react'

import { AnimationScreen } from '@layouts'

import { Logo } from '@components'

import { useInterval, useInvoke } from '@hooks'

import { checkWindowIsExist } from '@utils'

import { APP_NAME } from '@configs'
import { INVOKE_COMMANDS, PATHS } from '@configs'

export const HomeScreen: FC = () => {
	const [passwordGenButtonIsDisabled, setPasswordGenButtonIsDisabled] = useState(true)
	const navigate = useNavigate()

	const confirm = useConfirm()

	const handleClick = async () => {
		const { confirmed, reason } = await confirm({
			description: 'This action is permanent!',
		})

		if (confirmed) {
			/* ... */
		}

		console.log(reason)
		//=> "confirm" | "cancel" | "natural" | "unmount"
	}

	useEffect(() => {
		checkWindowIsExist('password-generator').then((isExist) => {
			setPasswordGenButtonIsDisabled(isExist)
		})
	}, [])

	useInterval(() => {
		checkWindowIsExist('password-generator').then((isExist) => {
			setPasswordGenButtonIsDisabled(isExist)
		})
	}, 1000)

	const openPasswordGenerator = useInvoke<string>({
		command: INVOKE_COMMANDS.passwordGenerator.open,
		onError: (err) => {
			if (err.status_code === 4000) {
				toast.error('Окно генератора паролей уже открыто')
			}
			setPasswordGenButtonIsDisabled(false)
		},
		onSuccess: () => {
			setPasswordGenButtonIsDisabled(true)
		},
	})

	const createStorage = () => navigate(`/${PATHS.PASSWORD_STORAGE.CREATE}`)
	const openStorage = () => navigate(`/${PATHS.PASSWORD_STORAGE.OPEN}`)

	return (
		<AnimationScreen>
			<Paper
				elevation={0}
				sx={{
					p: 2,
					borderRadius: 4,
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					width: '400px',
				}}
			>
				<Stack
					component='div'
					sx={{
						display: 'flex',
						gap: 1,
						justifyContent: 'center',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Logo width={82} height={82} />
					<Typography fontWeight={600} color='textPrimary' variant='h4'>
						{APP_NAME}
					</Typography>
				</Stack>
				<Button onClick={openStorage} variant='contained' size='large'>
					Открыть хранилище
				</Button>

				<Button onClick={createStorage} variant='outlined' size='large'>
					Создать хранилище
				</Button>

				<Divider />
				<Button
					disabled={passwordGenButtonIsDisabled}
					onClick={async () => await openPasswordGenerator.execute()}
					color='warning'
					variant='text'
					size='large'
					startIcon={<LockKeyhole />}
				>
					Генератор паролей
				</Button>

				<Button onClick={handleClick}>Open Confirm</Button>
			</Paper>
		</AnimationScreen>
	)
}
