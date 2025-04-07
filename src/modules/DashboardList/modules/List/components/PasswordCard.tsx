import { type FC, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import {
	Box,
	Card,
	CardActionArea,
	CardActions,
	Chip,
	Divider,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material'

import { HomeIcon, KeyRound, Link, Star, TagIcon, UserIcon } from 'lucide-react'

import { AnimatePresence, motion } from 'motion/react'

import { useHover } from '@hooks'

const MotionCard = motion(Card)

export const PasswordCard: FC = () => {
	const refPaper = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const hovering = useHover(refPaper)

	return (
		<MotionCard
			ref={refPaper}
			sx={{ width: '100%', overflow: 'hidden' }}
			whileHover={{ scale: 1.01, boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: 'spring', stiffness: 250, damping: 20 }}
		>
			<CardActions sx={{ padding: 0.2 }}>
				<Stack width='100%' direction='row' gap={0.5} justifyContent='flex-end'>
					<Stack
						direction='row'
						gap={0.5}
						p={0.2}
						pr={0}
						sx={(theme) => ({
							overflowX: 'auto',
							overflowY: 'hidden',
							scrollbarGutter: 'stable',

							'&::-webkit-scrollbar': {
								height: '4px',
							},
							'&::-webkit-scrollbar-track': {
								background: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0',
								borderRadius: '8px',
							},
							'&::-webkit-scrollbar-thumb': {
								background: theme.palette.mode === 'dark' ? '#444' : '#bbb',
								borderRadius: '8px',
								'&:hover': {
									background: theme.palette.mode === 'dark' ? '#666' : '#999',
								},
							},
						})}
					>
						{Array.from({ length: 10 }).map((_, index) => (
							<Chip
								size='small'
								icon={<TagIcon size={14} />}
								variant='outlined'
								key={index}
								label={`Tag ${index}`}
							/>
						))}
					</Stack>
					<IconButton size='small' onClick={() => setOpen(!open)}>
						<Star size={18} />
					</IconButton>
				</Stack>
			</CardActions>

			<CardActionArea onClick={() => toast.error('Not implemented')}>
				<Stack direction='row'>
					<Box mt={1} ml={1}>
						<HomeIcon size={24} />
					</Box>
					<Stack flex={1} direction='column' gap={1} sx={{ padding: 1 }}>
						<Stack direction='row' gap={1} alignItems='center' justifyContent='space-between'>
							<Typography variant='body2'>Name</Typography>
						</Stack>
						<Divider />
						<Stack direction='column' gap={1}>
							<Typography
								sx={{ opacity: hovering ? 1 : 0.5, transition: 'opacity 0.3s' }}
								variant='body2'
							>
								Description
							</Typography>
						</Stack>
					</Stack>
					<Stack />
				</Stack>
			</CardActionArea>

			<AnimatePresence>
				{hovering && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
					>
						<CardActions>
							<Stack direction='row' gap={1}>
								<Tooltip title='Скопировать логин'>
									<IconButton onClick={() => {}}>
										<UserIcon size={20} />
									</IconButton>
								</Tooltip>
								<Tooltip title='Скопировать пароль'>
									<IconButton onClick={() => {}}>
										<KeyRound size={20} />
									</IconButton>
								</Tooltip>
								<Tooltip title='Скопировать URL'>
									<IconButton onClick={() => {}}>
										<Link size={20} />
									</IconButton>
								</Tooltip>
							</Stack>
						</CardActions>
					</motion.div>
				)}
			</AnimatePresence>
		</MotionCard>
	)
}
