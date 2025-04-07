import type { FC } from 'react'

import { MotionMuiBox, type MotionMuiBoxProps } from './MotionMuiBox'

export const AnimationScreen: FC<MotionMuiBoxProps> = ({ children, ...props }) => {
	return (
		<MotionMuiBox
			initial={{ opacity: 0, y: -300 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, height: 'auto', y: 300 }}
			transition={{ duration: 0.5, ease: 'easeInOut', type: 'spring' }}
			style={{
				width: '100%',
				height: '100%',
				position: 'absolute',
				top: 0,
				left: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			{...props}
		>
			{children}
		</MotionMuiBox>
	)
}
