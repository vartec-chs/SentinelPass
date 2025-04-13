import { type FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { DashboardLayout, HomeLayout, MainLayout } from '@layouts'

import {
	DashboardScreen,
	HomeScreen,
	PasswordGeneratorScreen,
	PasswordStorageScreen,
} from '@screens'

import { PATHS } from '@configs'

export const Routing: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path={PATHS.HOME} element={<HomeLayout />}>
						<Route index element={<HomeScreen />} />
						<Route path={PATHS.PASSWORD_STORAGE.ROOT} element={<PasswordStorageScreen />} />
						<Route path={PATHS.PASSWORD_GENERATOR} element={<PasswordGeneratorScreen />} />
					</Route>

					<Route path={PATHS.DASHBOARD.ROOT} element={<DashboardLayout />}>
						<Route index element={<DashboardScreen />} />
						<Route path={PATHS.DASHBOARD.ADD_NEW_PASSWORD} element={<DashboardScreen />} />
						<Route path={PATHS.DASHBOARD.VIEW_PASSWORD.PARAMS} element={<DashboardScreen />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
