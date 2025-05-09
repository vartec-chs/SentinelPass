import { type FC, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router'

import { getCurrentWindow } from '@tauri-apps/api/window'

import {
	CircularProgress,
	colors,
	Divider,
	IconButton,
	AppBar as MuiAppBar,
	Paper,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'

import { Home, LucideLock, Maximize, Minimize, Minus, X } from 'lucide-react'

import { Logo, ThemeToggle } from '@components'

import { useInvoke } from '@hooks'

import { INVOKE_COMMANDS, PATHS } from '@configs'

export const AppBar: FC = () => {
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [label, setLabel] = useState('')
	const { pathname } = useLocation()
	const theme = useTheme()
	const navigate = useNavigate()

	const isDashboard = pathname.includes(PATHS.DASHBOARD.ROOT)
	const isPasswordGenerator = pathname.includes(PATHS.PASSWORD_GENERATOR)
	const isHome = pathname === PATHS.HOME

	const appWindowRef = useRef(getCurrentWindow())
	const appWindow = appWindowRef.current

	const closeWindow = async () => {
		await appWindow.close()
	}

	const getTitle = async () => {
		return await appWindow.title()
	}

	const minimizeWindow = async () => {
		await appWindow.minimize()
	}

	const toggleFullscreen = async () => {
		await appWindow.setFullscreen(!isFullscreen)
		setIsFullscreen(!isFullscreen)
	}

	const home = () => navigate(PATHS.HOME, { replace: true })

	useEffect(() => {
		getTitle().then(setLabel)
	}, [])

	const closeStorage = useInvoke({
		command: INVOKE_COMMANDS.passwordStorage.close,
		onError: (error) => toast.error(error.message),
		onSuccess: (res) => {
			toast.success(res.message)
			navigate(PATHS.HOME, { replace: true })
		},
	})

	return (
		<MuiAppBar
			enableColorOnDark
			position='static'
			sx={{
				borderRadius: 0,
				// borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
				px: 1,
				// pt: 0.5,
				// pb: 0.2,
				py: 0.5,
				width: '100%',
				height: '34px',
				display: 'flex',
				justifyContent: 'space-between',
				// backgroundColor:
				// theme.palette.mode === 'dark' ? theme.palette.background.default : colors.grey[50],
				backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : colors.grey[100],
				alignItems: 'center',
				gap: 1,
				flexDirection: 'row',
				zIndex: 10000,
				position: 'relative',
				boxShadow: 'none',
			}}
			// color='primary'
			color='transparent'
			data-tauri-drag-region
		>
			<Stack direction='row' gap={1} alignItems='center'>
				<Logo width={24} height={24} />
				<Typography
					variant='h4'
					fontWeight={400}
					fontSize='16px'
					color={theme.palette.text.primary}
				>
					{label}
				</Typography>
			</Stack>

			<Stack direction='row' gap={1}>
				{!isHome && !isDashboard && !isPasswordGenerator && (
					<>
						<Tooltip title='Главная'>
							<IconButton size='small' sx={{ color: theme.palette.text.primary }} onClick={home}>
								<Home size={16} />
							</IconButton>
						</Tooltip>
						{/* <Divider orientation='vertical' flexItem /> */}
					</>
				)}

				{isDashboard && (
					<>
						{/* <Divider orientation='vertical' flexItem /> */}

						<Paper
							elevation={0}
							sx={(theme) => ({
								height: '30px',
								padding: 1,
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								backgroundColor: 'transparent',

								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: 1,
							})}
						>
							<Stack direction='row' gap={1} alignItems='center'>
								<Typography
									variant='h4'
									fontWeight={400}
									fontSize='16px'
									color={theme.palette.text.primary}
								>
									{pathname}
								</Typography>
								<Typography
									variant='h4'
									fontWeight={400}
									fontSize='16px'
									color={theme.palette.text.primary}
								>
									test
								</Typography>

								<Tooltip title='Закрыть базу данных'>
									<IconButton
										size='small'
										sx={{ color: theme.palette.text.primary }}
										onClick={() => closeStorage.execute()}
									>
										{closeStorage.isLoading ? (
											<CircularProgress size={16} />
										) : (
											<LucideLock size={16} />
										)}
									</IconButton>
								</Tooltip>
							</Stack>
						</Paper>
					</>
				)}

				<ThemeToggle size={16} />

				<Tooltip title='Свернуть'>
					<IconButton onClick={minimizeWindow} size='small'>
						<Minus size={16} />
					</IconButton>
				</Tooltip>

				{!isPasswordGenerator && (
					<Tooltip title={!isFullscreen ? 'На весь экран' : 'Возвращается в обычное расположение'}>
						<IconButton onClick={toggleFullscreen} size='small'>
							{!isFullscreen ? <Maximize size={16} /> : <Minimize size={16} />}
						</IconButton>
					</Tooltip>
				)}

				<Tooltip title='Закрыть'>
					<IconButton
						onClick={closeWindow}
						size='small'
						sx={(theme) => ({
							':hover': {
								backgroundColor: theme.palette.mode === 'dark' ? colors.red[500] : colors.red[500],
								color: colors.grey[200],
							},
						})}
					>
						<X size={16} />
					</IconButton>
				</Tooltip>
			</Stack>
		</MuiAppBar>
	)
}
