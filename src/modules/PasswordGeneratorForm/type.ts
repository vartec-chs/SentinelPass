export interface CharacterSetInput {
	enabled: boolean
	value: string
}

export interface GeneratePasswordPayload {
	symbols: CharacterSetInput
	uppercase: CharacterSetInput
	lowercase: CharacterSetInput
	digits: CharacterSetInput
	length: number
}

export type GeneratePasswordDTO = {
	dto: GeneratePasswordPayload
}

export interface PasswordResult {
	password: string
	complexity: number // процент от 0 до 100
	strength_label: string // "Очень слабый", "Средний" и т.д.
}
