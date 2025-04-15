import { create } from 'zustand'

import { STORAGE_NAME } from '@configs'

interface DashboardStore {
	storageType: STORAGE_NAME
	setStorageType: (storageType: STORAGE_NAME) => void

	isAll: boolean
	setIsAll: (isAll: boolean) => void

	isFavorite: boolean
	setIsFavorite: (isFavorite: boolean) => void

	isTrashCategory: boolean
	setIsTrashCategory: (isTrashCategory: boolean) => void

	category?: string
	setCategory: (category: string) => void

	tags?: string[]
	setTags: (tags: string[]) => void

	reset: () => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
	storageType: STORAGE_NAME.PASSWORDS,
	setStorageType: (storageType) =>
		set({
			storageType,
			isAll: true,
			isFavorite: false,
			isTrashCategory: false,
			category: undefined,
			tags: undefined,
		}),

	isAll: true,
	setIsAll: (isAll) => set({ isAll, isFavorite: false, isTrashCategory: false }),
	isFavorite: false,
	setIsFavorite: (isFavorite) => set({ isFavorite, isAll: false, isTrashCategory: false }),

	isTrashCategory: false,
	setIsTrashCategory: (isTrashCategory) =>
		set({ isTrashCategory, isAll: false, isFavorite: false }),

	category: undefined,
	setCategory: (category) =>
		set({ category, isAll: false, isFavorite: false, isTrashCategory: false }),

	tags: undefined,
	setTags: (tags) => set({ tags }),

	reset: () =>
		set({
			isAll: true,
			isFavorite: false,
			isTrashCategory: false,
			category: undefined,
			tags: undefined,
		}),
}))
