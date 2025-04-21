import { PasswordGeneratorForm } from '@modules'

// import { useConfirm } from 'material-ui-confirm'

import { type FC } from 'react'

import { Box } from '@mui/material'

export const PasswordGeneratorScreen: FC = () => {
	// const confirm = useConfirm()

	// const handleClick = async () => {
	// 	const { confirmed, reason } = await confirm({
	// 		description: 'This action is permanent!',
	// 	})

	// 	if (confirmed) {
	// 		/* ... */
	// 	}

	// 	console.log(reason)
	// 	//=> "confirm" | "cancel" | "natural" | "unmount"
	// }
	return (
		<Box width='100%' height='100%' p={1}>
			<PasswordGeneratorForm />
		</Box>
	)
}
