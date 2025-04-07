// import { CreatePasswordStorageForm } from '@/components/forms/create-password-storage.form'
// import { OpenPasswordStorageForm } from '@components/forms/open-password-storage.form'
import { CreatePasswordStorageForm, OpenPasswordStorageForm } from '@modules'
import { Segment, SegmentedControl } from '@ui'

import { type FC } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { Paper, Stack } from '@mui/material'

import { AnimationScreen } from '@layouts'

import { PATHS } from '@configs'

export const PasswordStorageScreen: FC = () => {
	const [searchParams] = useSearchParams()
	const mode = searchParams.get('mode')

	const navigate = useNavigate()

	const switchPage = (value: string) => {
		navigate(`/${PATHS.PASSWORD_STORAGE.ROOT}?mode=${value}`, { replace: true })
	}

	return (
		<AnimationScreen
			component='div'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: '100%',
				gap: 2,
			}}
		>
			<SegmentedControl
				sx={{ height: '50px' }}
				onChange={(_, value) => switchPage(value)}
				value={mode}
			>
				<Segment value='create' label='Создать' />
				<Segment value='open' label='Открыть' />
			</SegmentedControl>
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
					width={'100%'}
					component='div'
					sx={{
						display: 'flex',
						gap: 1,
						justifyContent: 'center',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					{mode === 'create' ? <CreatePasswordStorageForm /> : <OpenPasswordStorageForm />}
				</Stack>
			</Paper>
		</AnimationScreen>
	)
}
