import { type LinksFunction } from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import appCss from './app.css?url'
import reset from './reset.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: reset },
	{ rel: 'stylesheet', href: appCss },
]

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@200;300;400;500;600;700&display=swap"
				/>
				<Meta />
				<Links />
			</head>
			<body
				style={{
					margin: 0,
					height: '100%',
					backgroundColor: 'rgb(14, 14, 14)',
				}}
			>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}
