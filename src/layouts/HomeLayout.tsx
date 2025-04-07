import { type FC } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { IconButton, Stack, Tooltip } from '@mui/material'

import { ArrowLeft } from 'lucide-react'

import { PATHS } from '@configs'

import { MotionMuiBox } from './MotionMuiBox'

export const HomeLayout: FC = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const isHome = pathname === `${PATHS.HOME}` || pathname.includes(PATHS.PASSWORD_GENERATOR)

	return (
		<Stack
			component='section'
			sx={(theme) => ({
				display: 'flex',
				flexDirection: 'column',
				justifyItems: 'center',
				alignItems: 'center',
				position: 'relative',
				height: '100%',
				width: '100%',
				borderRadius: theme.spacing(1),
				backgroundColor:
					theme.palette.mode === 'dark'
						? theme.palette.background.paper
						: theme.palette.background.default,
			})}
		>
			{!isHome && (
				<MotionMuiBox
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -100 }}
					transition={{ duration: 0.5, ease: 'easeInOut', type: 'spring' }}
					style={{
						position: 'absolute',
						top: 6,
						left: 6,
						zIndex: 1000,
					}}
				>
					<Tooltip title='Назад'>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowLeft />
						</IconButton>
					</Tooltip>
				</MotionMuiBox>
			)}
			<Outlet />
		</Stack>
	)
}
