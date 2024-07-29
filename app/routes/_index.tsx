import { Link } from '@remix-run/react'

export default function Index() {
	return (
		<div
			style={{
				padding: 30,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<Link style={{ color: 'white', fontSize: '3rem' }} to="/ticket">
				Ticket Builder
			</Link>
		</div>
	)
}
