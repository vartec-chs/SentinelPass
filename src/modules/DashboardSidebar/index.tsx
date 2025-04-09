import { type FC, useState } from 'react'

import { Box, Divider, Drawer, IconButton, Stack } from '@mui/material'

import { MenuIcon, Settings, XIcon } from 'lucide-react'

import { useClickOutside } from '@hooks'

import { MainSection } from './components'
import { SelectStorageMode } from './components/SelectStorageMode'

interface DashboardSidebarProps {
	fixed?: boolean
}

export const DashboardSidebar: FC<DashboardSidebarProps> = ({ fixed }) => {
	const [open, setOpen] = useState(fixed ? true : false)
	const ref = useClickOutside<HTMLDivElement>(() => {
		if (!fixed && !open) {
			setOpen(false)
		}
	})

	return (
		<>
			{!fixed && (
				<IconButton
					sx={{ position: 'absolute', top: 8.5, left: 8, zIndex: 2000 }}
					onClick={() => setOpen(!open)}
				>
					{!open ? <MenuIcon size={24} /> : <XIcon size={24} />}
				</IconButton>
			)}

			<Drawer
				ref={ref}
				onClose={() => setOpen(false)}
				style={{
					height: '100%',

					paddingBottom: 2,
					width: fixed ? '25%' : '0',
				}}
				sx={(theme) => ({
					width: fixed ? '25%' : '0',
					'& .MuiDrawer-paper': {
						position: 'relative',
						borderRadius: 1,
						padding: theme.spacing(1),
						border: !fixed
							? theme.palette.mode === 'dark'
								? `1px solid ${theme.palette.divider}`
								: `1px solid ${theme.palette.divider}`
							: 'none',
						width: fixed ? '100%' : '300px',
						boxSizing: 'border-box',

						left: 0,
						top: 1,

						transform: fixed || open ? 'translateX(0)' : 'translateX(-120%)',
						transition: 'transform 0.3s ease-in-out',
					},
				})}
				variant='permanent'
				anchor='right'
				open={fixed || open}
			>
				<Stack sx={{ width: '100%', height: '100%' }} direction='column' gap={1}>
					<Stack
						ml={fixed ? 0 : 6}
						// width='100%'
						alignItems='center'
						justifyContent='flex-end'
						direction='row'
						gap={1}
						sx={(theme) => ({
							// border: `1px solid ${theme.palette.divider}`,
							padding: theme.spacing(0),
							borderRadius: 1,
						})}
					>
						<SelectStorageMode />
					</Stack>
					<Divider />

					<MainSection />
				</Stack>
			</Drawer>
		</>
	)
}
