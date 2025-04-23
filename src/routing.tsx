import { createBrowserRouter } from 'react-router'

import { DashboardLayout, DashboardRenderer, HomeLayout, MainLayout } from '@layouts'

import {
	DashboardViewingScreen,
	HomeScreen,
	PasswordGeneratorScreen,
	PasswordStorageScreen,
	TestScreen,
} from '@screens'

import { PATHS } from '@configs'

import { NotOperation } from './modules/DashboardViewing/components/NotOperation'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				path: PATHS.HOME,
				element: <HomeLayout />,
				children: [
					{
						index: true,
						element: <HomeScreen />,
					},
					{
						path: PATHS.PASSWORD_STORAGE.ROOT,
						element: <PasswordStorageScreen />,
					},
					{
						path: PATHS.PASSWORD_GENERATOR,
						element: <PasswordGeneratorScreen />,
					},
					{
						path: PATHS.TEST,
						element: <TestScreen />,
					},
				],
			},
			{
				path: PATHS.DASHBOARD.ROOT,
				element: <DashboardLayout />,
				children: [
					{
						element: <DashboardRenderer />, // если ты используешь layout внутри Dashboard
						children: [
							{
								index: true,
								element: <NotOperation />,
							},
							{
								path: PATHS.DASHBOARD.VIEW_PASSWORD.ROOT,
								element: <DashboardViewingScreen />,
							},
							{
								path: PATHS.DASHBOARD.ADD_NEW_PASSWORD,
								element: <DashboardViewingScreen />,
							},
						],
					},
				],
			},
		],
	},
])
