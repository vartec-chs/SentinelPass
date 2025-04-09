import * as React from 'react'

import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { alpha, styled } from '@mui/material/styles'

import { ArrowDown, KeyRound, SquareAsterisk } from 'lucide-react'

import { STORAGE_TYPE } from '@configs'

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 180,
		color: 'rgb(55, 65, 81)',
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
		...theme.applyStyles('dark', {
			color: theme.palette.grey[300],
		}),
	},
}))

export function SelectStorageMode() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const [select, setSelect] = React.useState(STORAGE_TYPE.PASSWORDS)
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<div>
			<Button
				id='demo-customized-button'
				aria-controls={open ? 'demo-customized-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				// variant='contained'
				disableElevation
				onClick={handleClick}
				fullWidth
				size='small'
				startIcon={
					select === STORAGE_TYPE.PASSWORDS ? <KeyRound size={20} /> : <SquareAsterisk size={20} />
				}
				endIcon={<ArrowDown size={20} />}
			>
				{select === STORAGE_TYPE.PASSWORDS ? 'Пароли' : 'Аутентификаторы'}
			</Button>
			<StyledMenu
				id='demo-customized-menu'
				MenuListProps={{
					'aria-labelledby': 'demo-customized-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				{Object.entries(STORAGE_TYPE).map(([key, value]) => (
					<MenuItem
						key={key}
						sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						onClick={() => {
							setSelect(value)
							handleClose()
						}}
						disableRipple
					>
						{<value.icon size={20} />}
						{value.name}
					</MenuItem>
				))}
			</StyledMenu>
		</div>
	)
}
