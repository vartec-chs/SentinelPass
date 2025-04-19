import { create } from 'zustand'

import { Category, PasswordCard } from '@ts'

import { STORAGE_NAME } from '@configs'

type CurrentCategory = 'all' | 'favorite' | 'trash' | Category

interface DashboardStore {
	storageType: STORAGE_NAME
	setStorageType: (storageType: STORAGE_NAME) => void

	// isAll: boolean
	// setIsAll: (isAll: boolean) => void

	// isFavorite: boolean
	// setIsFavorite: (isFavorite: boolean) => void

	// isTrashCategory: boolean
	// setIsTrashCategory: (isTrashCategory: boolean) => void

	currentCategory: CurrentCategory
	categories: Category[]
	currentEditedCategoryId?: string
	setCategories: (categories: Category[]) => void
	setCurrentCategory: (category: CurrentCategory) => void
	setCurrentEditedCategoryId: (id: string) => void

	tags?: string[]
	currentTags?: string[]
	currentEditedTagId?: string
	setTags: (tags: string[]) => void
	setCurrentTags: (tags: string[]) => void
	setCurrentEditedTagId: (id: string) => void

	currentCardId?: string
	passwordCards: PasswordCard[]
	currentPasswordCardId?: string
	setPasswordCards: (passwordCards: PasswordCard[]) => void
	setCurrentCardId: (id: string) => void

	reset: () => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
	storageType: STORAGE_NAME.PASSWORDS,
	setStorageType: (storageType) =>
		set({
			storageType,
			// isAll: true,
			// isFavorite: false,
			// isTrashCategory: false,
			currentCategory: 'all',
			tags: undefined,
			currentCardId: undefined,
			currentEditedTagId: undefined,
			currentEditedCategoryId: undefined,
			categories: [],
			currentTags: undefined,
			passwordCards: [],
			currentPasswordCardId: undefined,
		}),

	// isAll: true,
	// setIsAll: (isAll) => set({ isAll, isFavorite: false, isTrashCategory: false }),

	// isFavorite: false,
	// setIsFavorite: (isFavorite) => set({ isFavorite, isAll: false, isTrashCategory: false }),

	// isTrashCategory: false,
	// setIsTrashCategory: (isTrashCategory) =>
	// 	set({ isTrashCategory, isAll: false, isFavorite: false }),

	tags: undefined,
	setTags: (tags) => set({ tags }),

	currentTags: undefined,
	setCurrentTags: (tags) => set({ currentTags: tags }),

	currentEditedTagId: undefined,
	setCurrentEditedTagId: (id) => set({ currentEditedTagId: id }),

	currentCardId: undefined,
	setCurrentCardId: (id) => set({ currentCardId: id }),

	currentPasswordCardId: undefined,

	categories: [],
	setCategories: (categories) => set({ categories }),

	currentCategory: 'all',
	setCurrentCategory: (category) => set({ currentCategory: category }),

	currentEditedCategoryId: undefined,
	setCurrentEditedCategoryId: (id) => set({ currentEditedCategoryId: id }),

	passwordCards: [],
	setPasswordCards: (passwordCards) => set({ passwordCards }),

	reset: () =>
		set({
			// isAll: true,
			// isFavorite: false,
			// isTrashCategory: false,
			currentCategory: 'all',
			tags: undefined,
			currentCardId: undefined,
			currentEditedTagId: undefined,
			currentEditedCategoryId: undefined,
			categories: [],
			currentTags: undefined,
			passwordCards: [],
			currentPasswordCardId: undefined,
		}),
}))
