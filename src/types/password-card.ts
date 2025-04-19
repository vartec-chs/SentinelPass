export interface PasswordCard {
	id: string
	name: string
	description?: string
	category: string
	tags: string[]
	isFavorite: boolean
	isTrash: boolean
	createdAt: string
	updatedAt: string
}
