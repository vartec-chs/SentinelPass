import * as z from 'zod'

export const addNewPasswordSchema = z
	.object({
		name: z.string({ message: 'Название пароля не может быть пустым' }).describe('Название пароля'),
		description: z.string().describe('Описание пароля').optional(),
		category: z.string().describe('Категория').optional(),
		mail: z.string().describe('Почта'),
		login: z.string().describe('Логин'),
		password: z
			.string({ message: 'Пароль не может быть пустым' })
			.describe('Пароль')
			.min(1, 'Пароль не может быть пустым'),
		url: z.string().describe('URL').optional(),
		note: z.string().describe('Примечание').optional(),
		tags: z.array(z.string()).describe('Теги').optional(),
		isFavorite: z.boolean().describe('Избранное').optional(),
	})
	.refine((data) => data.login || data.mail, {
		message: 'Нужно заполнить хотя бы одно поле (Почта или Логин)',
	})

export type AddNewPasswordSchema = z.infer<typeof addNewPasswordSchema>
