import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { sha256 } from 'hash-wasm'
import { useEffect } from 'react'
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

	const email = params.get('email')

	useEffect(() => {
		if (email)
			void sha256(email).then((hash) =>
				setParams((oldParams) => {
					const newParams = new URLSearchParams(oldParams)
					newParams.set(
						'avatar',
						`https://gravatar.com/avatar/${hash}?s=680&d=retro`,
					)
					return newParams
				}),
			)
	}, [email, setParams])

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
						Email:{' '}
						<input
							name="email"
							value={params.get('email') ?? ''}
							onChange={handleChange}
						/>
					</label>
					<p style={{ opacity: 0.8 }}>
						<strong>Note</strong>: the email is just used to prefill the avatar
						with gravatar if they did not provide a custom avatar
					</p>
					<label>
						Avatar:{' '}
						<input
							required
							name="avatar"
							value={params.get('avatar') ?? ''}
							onChange={handleChange}
							style={{ width: '100%', maxWidth: 500 }}
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
					<button style={{ width: 'fit-content' }} type="submit">
						Submit
					</button>
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

// there's no reason to revalidate this route...
export function shouldRevalidate() {
	return false
}
