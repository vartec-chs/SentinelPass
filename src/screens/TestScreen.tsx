import { INVOKE_COMMANDS } from '@/configs'
import { useInvoke } from '@/hooks'

import { FC } from 'react'
import toast from 'react-hot-toast'

import { Box, Button } from '@mui/material'

export const TestScreen: FC = () => {
	const test = useInvoke({
		command: INVOKE_COMMANDS.test.testWindow,
		onError: (e) => {
			console.log(e)
			toast.error(e.message)
		},
		onSuccess: () => toast.success('Test window opened'),
	})
	return (
		<Box>
			<Button onClick={() => test.execute()}>Open Test Window</Button>
		</Box>
	)
}
