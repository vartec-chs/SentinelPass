import * as React from 'react'

import { Box, IconButton, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import { FileIcon, FileUp, PlusIcon, TrashIcon, XIcon } from 'lucide-react'

export const CategoryModal = () => {
	const [open, setOpen] = React.useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<React.Fragment>
			<IconButton size='small' onClick={handleClickOpen}>
				{open ? <XIcon size={20} /> : <PlusIcon size={20} />}
			</IconButton>
			<Dialog
				maxWidth={'sm'}
				fullWidth
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
						component: 'form',
					},
				}}
			>
				<DialogTitle>Создать категорию</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{/* <DialogContentText>
						Введите название категории
					</DialogContentText> */}
					<TextField
						autoFocus
						required
						id='name'
						name='name'
						label='Название категории'
						type='text'
						fullWidth
						variant='standard'
					/>
					<TextField
						autoFocus
						required
						multiline
						id='description'
						name='description'
						label='Описание'
						type='text'
						fullWidth
						variant='standard'
						rows={3}
					/>
					<Stack direction='row' spacing={0.5} alignItems='center'>
						<Box
							sx={(theme) => ({
								border: `1px solid ${theme.palette.divider}`,
								height: '64px',
								width: '64px',
								borderRadius: theme.spacing(1),
							})}
						/>
						<Stack direction='column' spacing={0.5}>
							<IconButton size='small' onClick={handleClickOpen}>
								<TrashIcon size={20} />
							</IconButton>
							<IconButton size='small' onClick={handleClickOpen}>
								<FileUp size={20} />
							</IconButton>
						</Stack>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Отмена</Button>
					<Button type='submit'>Сохранить</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	)
}
