import { LoadingButton } from '@ui'

import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

import { open as openDialog } from '@tauri-apps/plugin-dialog'

import { IconButton, InputAdornment, Stack, TextField } from '@mui/material'

import { Eye, EyeOff, FileInput } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { useInvoke } from '@hooks'

import { EXTENSION_FILE, EXTENSION_NAME, INVOKE_COMMANDS, PATHS, SETTINGS } from '@configs'

import { OpenPasswordStorageSchema, openPasswordStorageSchema } from './form.schema'
import { PasswordStorageOpen } from './type'

export const OpenPasswordStorageForm: FC = () => {
	const navigate = useNavigate()
	const [isKeyVisible, setIsKeyVisible] = useState(false)

	const {
		control,
		handleSubmit,
		setValue,
		clearErrors,
		reset,
		setFocus,
		formState: { errors, isValid },
	} = useForm<OpenPasswordStorageSchema>({
		resolver: zodResolver(openPasswordStorageSchema),
		mode: 'onChange',
	})

	useEffect(() => {
		const getDBPath = async () => {
			const dbPath = await SETTINGS.get<string>('db_path')
			console.log(dbPath)
			if (dbPath) {
				setValue('path', dbPath)

				setFocus('masterPassword')
			}
		}

		getDBPath()
	}, [])

	const openStorage = useInvoke<any, { dto: PasswordStorageOpen }>({
		command: INVOKE_COMMANDS.passwordStorage.open,
		onError: (error) => {
			console.log(error)
			toast.error(error.message)
		},
		onSuccess: (res) => {
			toast.success(res.message)
			reset()
			navigate(`${PATHS.DASHBOARD.ROOT}`, { replace: true })
		},
	})

	const open = async () => {
		clearErrors('path')
		await openDialog({
			title: 'Открытие базы данных',
			message: 'Выберите базу данных',
			filters: [
				{
					name: EXTENSION_NAME,
					extensions: [EXTENSION_FILE],
				},
			],
		})
			.then((path) => {
				if (path) {
					setValue('path', path)
					setFocus('path')
				} else {
					toast.error('Путь не выбран')
				}
			})
			.catch(() => {
				toast.error('Путь не выбран')
			})
	}

	const onSubmit = async (data: OpenPasswordStorageSchema) => {
		console.log(data)
		await openStorage.execute({
			dto: {
				...data,
				masterPassword: data.masterPassword,
			},
		})
	}

	return (
		<Stack width={'100%'} component='form' onSubmit={handleSubmit(onSubmit)} gap={2}>
			<Controller
				name='path'
				control={control}
				render={({ field: { value, ...field } }) => (
					<TextField
						value={value}
						{...field}
						fullWidth
						autoFocus
						type='text'
						autoComplete='off'
						required
						label='Путь к базе данных'
						error={!!errors.path}
						helperText={errors.path?.message}
						slotProps={{
							inputLabel: { shrink: true },
							input: {
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={open}>
											<FileInput />
										</IconButton>
									</InputAdornment>
								),
							},
						}}
					/>
				)}
			/>

			<Controller
				name='masterPassword'
				control={control}
				render={({ field: { ref, ...field } }) => (
					<TextField
						{...field}
						fullWidth
						inputRef={ref}
						label='Ключ шифрования'
						error={!!errors.masterPassword}
						helperText={errors.masterPassword?.message}
						type={isKeyVisible ? 'text' : 'password'}
						autoComplete='off'
						required
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={() => setIsKeyVisible(!isKeyVisible)}>
											{isKeyVisible ? <Eye size={24} /> : <EyeOff size={24} />}
										</IconButton>
									</InputAdornment>
								),
							},
						}}
					/>
				)}
			/>
			<LoadingButton
				isLoading={openStorage.isLoading}
				type='submit'
				variant='contained'
				size='large'
				disabled={!isValid || openStorage.isLoading}
			>
				Открыть
			</LoadingButton>
		</Stack>
	)
}
