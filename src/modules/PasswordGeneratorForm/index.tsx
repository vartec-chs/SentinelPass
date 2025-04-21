import { LoadingButton, ModTextField, Segment, SegmentedControl } from '@/ui'

import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { emit } from '@tauri-apps/api/event'

import {
	Box,
	Grid,
	IconButton,
	InputAdornment,
	LinearProgress,
	Slider,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import { Theme } from '@mui/material/styles'

import { Copy } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

import { useInvoke } from '@hooks'

import { INVOKE_COMMANDS } from '@configs'

import { PasswordControllersForm } from './password-controllers'
import { GeneratePasswordDTO, GeneratePasswordPayload, PasswordResult } from './type'

export const getPasswordStrengthColor = (complexity: number, theme: Theme): string => {
	if (complexity <= 20) {
		return theme.palette.error.main // красный
	} else if (complexity <= 50) {
		return theme.palette.warning.main // оранжевый
	} else if (complexity <= 80) {
		return theme.palette.info.main // синий/голубой
	} else if (complexity <= 95) {
		return theme.palette.success.main // зеленый
	} else {
		return theme.palette.primary.main // основной цвет
	}
}

// Валидация формы
const schema = z.object({
	length: z.number().min(1).max(256),
	characterSets: z.object({
		symbols: z.object({ enabled: z.boolean(), value: z.string() }),
		uppercase: z.object({ enabled: z.boolean(), value: z.string() }),
		lowercase: z.object({ enabled: z.boolean(), value: z.string() }),
		digits: z.object({ enabled: z.boolean(), value: z.string() }),
	}),
})

interface PasswordGeneratorFormValues {
	length: number
	characterSets: {
		symbols: { enabled: boolean; value: string }
		uppercase: { enabled: boolean; value: string }
		lowercase: { enabled: boolean; value: string }
		digits: { enabled: boolean; value: string }
	}
}

export const PasswordGeneratorForm: FC = () => {
	const theme = useTheme()
	const [type, setType] = useState<'password' | 'passwords'>('password')

	const { control, handleSubmit, watch, setValue, getValues } =
		useForm<PasswordGeneratorFormValues>({
			resolver: zodResolver(schema),
			defaultValues: {
				length: 12,
				characterSets: {
					symbols: { enabled: true, value: '!@#$%^&*()_+-={}[]<>?' },
					uppercase: { enabled: true, value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
					lowercase: { enabled: true, value: 'abcdefghijklmnopqrstuvwxyz' },
					digits: { enabled: true, value: '0123456789' },
				},
			},
		})

	const { execute, data, isLoading } = useInvoke<PasswordResult, GeneratePasswordDTO>({
		command: INVOKE_COMMANDS.passwordGenerator.generate,
		onError: (err) => console.log(err),
		onSuccess: async (res) => {
			await emit('new_pass', res.data.password)
		},
	})

	useEffect(() => {
		const formValues = getValues()
		const payload: GeneratePasswordPayload = {
			...formValues.characterSets, // Разворачиваем `characterSets`
			length: Number(formValues.length), // Преобразуем строку в число
		}
		execute({ dto: payload })
	}, [watch('length'), watch('characterSets')]) // Отслеживаем только длину и набор символов

	// Цвет индикатора сложности
	const progressColor = getPasswordStrengthColor(data?.data?.complexity ?? 0, theme)

	return (
		<Stack width='100%' height='100%' component='form' gap={3} position='relative'>
			{/* Поле пароля */}
			{/* <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<SegmentedControl
					sx={{ height: '50px', width: 'fit-content' }}
					value={type}
					onChange={(_, value) => setType(value)}
				>
					<Segment value='password' label='Пароль' />
					<Segment value='passwords' label='Лист' />
				</SegmentedControl>
			</Box> */}
			<ModTextField
				variant='standard'
				label='Пароль'
				value={data?.data?.password ?? ''}
				fullWidth
				InputProps={{
					readOnly: true,
					endAdornment: (
						<InputAdornment position='end'>
							<Tooltip title='Скопировать'>
								<IconButton
									onClick={() => {
										navigator.clipboard.writeText(data?.data?.password ?? '')
										toast.success('Пароль скопирован!', {
											position: 'top-center',
											style: {
												marginTop: '30px',
											},
											duration: 1500,
										})
									}}
								>
									<Copy size={18} />
								</IconButton>
							</Tooltip>
						</InputAdornment>
					),
				}}
			/>

			{/* Полоса сложности пароля */}
			<Box width='100%'>
				<LinearProgress
					variant='determinate'
					value={data?.data?.complexity ?? 0}
					sx={{
						height: 5,
						borderRadius: 5,

						'& .MuiLinearProgress-bar': { backgroundColor: progressColor },
					}}
				/>
				<Typography variant='body2' color='textSecondary' mt={1}>
					Сложность пароля: {Math.round(data?.data?.complexity ?? 0)}% (
					{data?.data?.strength_label ?? ''})
				</Typography>
			</Box>

			{/* Ползунок длины пароля */}
			<Box sx={{ width: '100%' }}>
				<Grid container spacing={2} alignItems='center'>
					<Grid size={4}>
						<Controller
							name='length'
							control={control}
							render={({ field }) => (
								<ModTextField
									label='Длина пароля'
									{...field}
									fullWidth
									onBlur={() => {
										const val = Math.max(1, Math.min(field.value, 256))
										field.onChange(val)
									}}
									inputProps={{ step: 1, min: 1, max: 256, type: 'number' }}
								/>
							)}
						/>
					</Grid>
					<Grid size='grow'>
						<Controller
							name='length'
							control={control}
							render={({ field }) => (
								<Slider
									{...field}
									valueLabelDisplay='auto'
									value={field.value}
									min={1}
									max={256}
									onChange={(_, value) => field.onChange(value)}
								/>
							)}
						/>
					</Grid>
				</Grid>
			</Box>

			{/* Контроллеры набора символов */}
			<PasswordControllersForm onChange={(value) => setValue('characterSets', value)} />

			<LoadingButton
				sx={{ position: 'absolute', bottom: 0 }}
				loading={isLoading}
				fullWidth
				variant='contained'
				size='large'
				color='primary'
				onClick={async () => {
					const formValues = getValues()
					const payload: GeneratePasswordPayload = {
						...formValues.characterSets, // Разворачиваем `characterSets`
						length: formValues.length,
					}
					await execute({ dto: payload })
				}}
			>
				Сгенерировать
			</LoadingButton>
		</Stack>
	)
}
