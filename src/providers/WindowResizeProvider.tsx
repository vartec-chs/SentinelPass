// contexts/WindowResizeContext.tsx
import { createContext, FC, PropsWithChildren, useContext } from 'react'

import { useWindowResize } from '@hooks'

import { MATCHES } from '@configs'

interface WindowResizeContextProps {
	matchMap: Record<string, boolean>
	width: number | null
	height: number | null
}

const WindowResizeContext = createContext<WindowResizeContextProps | undefined>(undefined)

export const useWindowResizeContext = (): WindowResizeContextProps => {
	const context = useContext(WindowResizeContext)
	if (!context) {
		throw new Error('useWindowResizeContext must be used within WindowResizeProvider')
	}
	return context
}

export const WindowResizeProvider: FC<PropsWithChildren> = ({ children }) => {
	const { matchMap, width, height } = useWindowResize({
		debounce: 300,
		leading: true,
		matches: MATCHES,
	})

	return (
		<WindowResizeContext.Provider value={{ matchMap, width, height }}>
			{children}
		</WindowResizeContext.Provider>
	)
}
