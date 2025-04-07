import { createRoot } from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Providers } from '@providers'

import { Routing } from './routing'

// import '@fontsource/roboto/300.css'
// import '@fontsource/roboto/400.css'
// import '@fontsource/roboto/500.css'
// import '@fontsource/roboto/700.css'

import '@fontsource/rubik/300.css'
import '@fontsource/rubik/400.css'
import '@fontsource/rubik/500.css'
import '@fontsource/rubik/700.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<Providers>
		<QueryClientProvider client={queryClient}>
			<Routing />
		</QueryClientProvider>
	</Providers>,
)
