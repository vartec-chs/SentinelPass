import { HomeIcon, KeyRoundIcon, SquareAsteriskIcon, StarIcon } from 'lucide-react'

type BASE = {
	name: string
	icon: typeof StarIcon
}

export const BASE_FILTER: Record<string, BASE> = {
	FAVORITE: {
		name: 'Favorite',
		icon: StarIcon,
	},
	ALL: {
		name: 'All',
		icon: HomeIcon,
	},
}

export const STORAGE_TYPE: Record<string, BASE> = {
	PASSWORDS: {
		name: 'Passwords',
		icon: SquareAsteriskIcon,
	},
	AUTHENTICATION: {
		name: 'Authentication',
		icon: KeyRoundIcon,
	},
}
