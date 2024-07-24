import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { Ticket } from '#app/components/ticket.tsx'
import { getDomainUrl } from '#app/utils.js'

export async function loader({ request }: LoaderFunctionArgs) {
	return json({
		domain: getDomainUrl(request),
	})
}

export default function TicketRoute() {
	const { domain } = useLoaderData<typeof loader>()
	const [params, setParams] = useState({
		name: 'Kent C. Dodds',
		handle: '@kentcdodds',
		avatar:
			'https://pbs.twimg.com/profile_images/1567269493608714241/6ACZo99k_400x400.jpg',
		ticketNumber: '0',
	})

	const ticketUrl = `/ticket-img?${new URLSearchParams(params)}`

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.currentTarget
		setParams((oldParams) => ({
			...oldParams,
			[name]: value,
		}))
	}
	return (
		<div
			style={{
				padding: 40,
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: 24,
			}}
		>
			<div style={{ color: 'white' }}>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						window.open(ticketUrl, '_blank')
					}}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 8,
					}}
				>
					<label>
						Name:{' '}
						<input
							required
							name="name"
							value={params.name}
							onChange={handleChange}
						/>
					</label>
					<label>
						Handle:{' '}
						<input
							required
							name="handle"
							value={params.handle}
							onChange={handleChange}
						/>
					</label>
					<label>
						Avatar:{' '}
						<input
							required
							name="avatar"
							value={params.avatar}
							onChange={handleChange}
						/>
					</label>
					<label>
						Ticket Number:{' '}
						<input
							required
							name="ticketNumber"
							value={params.ticketNumber}
							onChange={handleChange}
						/>
					</label>
					<button type="submit">Submit</button>
				</form>
				<a style={{ color: 'white' }} href={ticketUrl} target="_blank">
					Open Ticket Image
				</a>
			</div>
			<div>
				<div
					style={{
						height: 1200,
						width: 800,
						display: 'block',
						margin: 'auto',
						backgroundColor: 'hsl(0, 0%, 90%)',
					}}
				>
					<Ticket
						domain={domain}
						name={params.name}
						handle={params.handle}
						avatar={params.avatar}
						ticketNumber={params.ticketNumber}
					/>
				</div>
			</div>
		</div>
	)
}
