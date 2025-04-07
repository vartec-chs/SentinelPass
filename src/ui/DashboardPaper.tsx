import { Paper, PaperProps, styled } from '@mui/material'

export const DashboardPaper = styled((props: PaperProps) => <Paper elevation={0} {...props} />)(
	({ theme }) => ({
		width: '100%',
		height: '100%',
		borderRadius: 12,
		border: theme.palette.mode === 'dark' ? '1px solid #222' : '1px solid #eee',
		backgroundColor:
			theme.palette.mode === 'dark'
				? theme.palette.background.paper
				: theme.palette.background.default,
		padding: theme.spacing(1),
	}),
)
