import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { Ticket } from '#app/components/ticket.tsx'
import { getDomainUrl } from '#app/utils.js'

export async function loader({ request }: LoaderFunctionArgs) {
	return json({
		domain: getDomainUrl(request),
	})
}

export default function TicketRoute() {
	const { domain } = useLoaderData<typeof loader>()
	const [params, setParams] = useSearchParams()

	const ticketUrl = `/ticket-img?${new URLSearchParams(params)}`

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.currentTarget
		setParams((oldParams) => {
			const newParams = new URLSearchParams(oldParams)
			newParams.set(name, value)
			return newParams
		})
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
							value={params.get('name') ?? ''}
							onChange={handleChange}
						/>
					</label>
					<label>
						Handle:{' '}
						<input
							required
							name="handle"
							value={params.get('handle') ?? ''}
							onChange={handleChange}
						/>
					</label>
					<label>
						Avatar:{' '}
						<input
							required
							name="avatar"
							value={params.get('avatar') ?? ''}
							onChange={handleChange}
						/>
					</label>
					<label>
						Ticket Number:{' '}
						<input
							required
							name="ticketNumber"
							value={params.get('ticketNumber') ?? ''}
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
						name={params.get('name') || null}
						handle={params.get('handle') || null}
						avatar={params.get('avatar') || null}
						ticketNumber={params.get('ticketNumber') || null}
					/>
				</div>
			</div>
		</div>
	)
}
