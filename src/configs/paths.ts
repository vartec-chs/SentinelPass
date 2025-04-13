export const PATHS = {
	HOME: '/',
	PASSWORD_GENERATOR: 'password-generator',
	DASHBOARD: {
		ROOT: 'dashboard',
		ADD_NEW_PASSWORD: '/dashboard/add-new-password',
		VIEW_PASSWORD: {
			ROOT: '/dashboard/view-password',
			PARAMS: '/dashboard/view-password/:id',
		},
	},
	PASSWORD_STORAGE: {
		ROOT: 'password-storage',
		CREATE: 'password-storage?mode=create',
		OPEN: 'password-storage?mode=open',
	},
}
