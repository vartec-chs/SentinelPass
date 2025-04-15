import { load } from '@tauri-apps/plugin-store'

export { PATHS } from './paths'
export { darkTheme, lightTheme } from './theme'
export { INVOKE_COMMANDS } from './invoke-commands'
export { STORAGE_TYPE, BASE_FILTER, MATCHES, STORAGE_NAME } from './dashboard'

export const APP_NAME = 'Sentinel Pass'
export const EXTENSION_NAME = 'Sentinel Pass'
export const EXTENSION_FILE = 'sp.db'

export const SETTINGS = await load('settings.json', { autoSave: true })
