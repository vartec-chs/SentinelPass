import { useConfirm } from 'material-ui-confirm'

import { type FC } from 'react'

import { Box, Button, Typography } from '@mui/material'

export const PasswordGeneratorScreen: FC = () => {
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
	return (
		<Box>
			<Typography>PS Gen</Typography>
			<Button onClick={handleClick}>Open Confirm</Button>
		</Box>
	)
}
