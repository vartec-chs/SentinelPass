import * as z from 'zod'

import { EXTENSION_FILE } from '@configs'

export const openPasswordStorageSchema = z.object({
	path: z
		.string({
			message: 'Путь к базе данных должен быть строкой',
		})
		.describe('Путь к базе данных')
		.refine(
			(value) => value.endsWith(EXTENSION_FILE),
			`Путь к базе данных должен заканчиваться ${EXTENSION_FILE}`,
		),
	masterPassword: z
		.string({
			message: 'Ключ шифрования должен быть строкой',
		})
		.min(1, 'Ключ шифрования не может быть пустым')
		.describe('Ключ шифрования'),
})

export type OpenPasswordStorageSchema = z.infer<typeof openPasswordStorageSchema>
