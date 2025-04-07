import { ResizeObserver } from '@juggle/resize-observer'

import { FC } from 'react'
import useMeasure from 'react-use-measure'

import { Box } from '@mui/material'

import { MotionMuiBox, MotionMuiBoxProps } from './MotionMuiBox'

export const AnimationSizeBox: FC<MotionMuiBoxProps & { children: React.ReactNode }> = ({
	children,
}) => {
	const [ref, bounds] = useMeasure({
		polyfill: ResizeObserver,
	})
	return (
		<MotionMuiBox
			initial={{ opacity: 0, height: 'auto' }}
			animate={{ opacity: 1, height: bounds.height + 28 }}
			exit={{ opacity: 0, height: 'auto' }}
			transition={{ duration: 0.5, ease: 'easeInOut', type: 'spring' }}
			style={{
				width: '100%',
				position: 'absolute',
				top: '50%',
				paddingTop: '0.8rem',
				left: '50%',

				transform: 'translate(-50%, -51%)',

				overflow: 'hidden',
			}}
		>
			<Box ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{children}
			</Box>
		</MotionMuiBox>
	)
}
