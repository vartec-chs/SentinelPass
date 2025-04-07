import { useEffect, useState } from 'react'

import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window'

type OnResizeCallback = (size: PhysicalSize) => void
type MatchesCondition = (size: { width: number; height: number }) => boolean

type UseWindowResizeOptions = {
	onResize?: OnResizeCallback
	matches?: MatchesCondition
}

export const useWindowResize = ({ onResize, matches }: UseWindowResizeOptions = {}) => {
	const [match, setMatch] = useState<boolean | null>(null)
	const [width, setWidth] = useState<number | null>(null)
	const [height, setHeight] = useState<number | null>(null)

	useEffect(() => {
		let unlisten: () => void

		const updateSize = async () => {
			const window = getCurrentWindow()
			const size = await window.innerSize() // Получаем текущий размер окна
			const newM = !matches || matches({ width: size.width, height: size.height })
			setMatch(newM)
			setWidth(size.width)
			setHeight(size.height)
			if (newM && onResize) {
				onResize(size)
			}
		}

		updateSize() // Обновляем состояние при первом рендере

		const setupListener = async () => {
			unlisten = await getCurrentWindow().onResized(({ payload: size }) => {
				const newM = !matches || matches({ width: size.width, height: size.height })
				setMatch(newM)
				setWidth(size.width)
				setHeight(size.height)
				if (newM && onResize) {
					onResize(size)
				}
			})
		}

		setupListener()

		return () => {
			if (unlisten) {
				unlisten()
			}
		}
	}, [onResize])

	return { width, height, match }
}
