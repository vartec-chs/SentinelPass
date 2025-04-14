import { type FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { DashboardLayout, HomeLayout, MainLayout } from '@layouts'

import {
	DashboardScreen,
	DashboardViewingScreen,
	HomeScreen,
	PasswordGeneratorScreen,
	PasswordStorageScreen,
} from '@screens'

import { PATHS } from '@configs'

import { NotOperation } from './modules/DashboardViewing/components/NotOperation'

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
						<Route index element={<NotOperation />} />
						<Route
							path={PATHS.DASHBOARD.VIEW_PASSWORD.PARAMS}
							element={<DashboardViewingScreen />}
						/>
						<Route path={PATHS.DASHBOARD.ADD_NEW_PASSWORD} element={<DashboardViewingScreen />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
