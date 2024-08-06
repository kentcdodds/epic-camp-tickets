import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { sha256 } from 'hash-wasm'
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

	const ticketImgUrl = `/ticket-img?${new URLSearchParams(params)}`
	const ticketSvgUrl = `/ticket-svg?${new URLSearchParams(params)}`

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		let { name, value, checked, type } = e.currentTarget
		if (type === 'checkbox') value = checked ? 'on' : ''

		setParams((oldParams) => {
			const newParams = new URLSearchParams(oldParams)
			if (value) newParams.set(name, value)
			else newParams.delete(name)
			return newParams
		})
		if (name === 'email') {
			if (!value) {
				setParams((oldParams) => {
					const newParams = new URLSearchParams(oldParams)
					newParams.delete('email')
					newParams.delete('avatar')
					return newParams
				})
				return
			}
			void sha256(value).then((hash) =>
				setParams((oldParams) => {
					const newParams = new URLSearchParams(oldParams)
					newParams.set('email', value)
					newParams.set(
						'avatar',
						`https://gravatar.com/avatar/${hash}?s=680&d=retro`,
					)
					return newParams
				}),
			)
		}
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
						window.open(ticketImgUrl, '_blank')
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
							type="number"
							min="0"
							name="ticketNumber"
							value={params.get('ticketNumber') ?? ''}
							onChange={handleChange}
						/>
					</label>
					<label>
						Lanyard hole:{' '}
						<input
							type="checkbox"
							name="lanyardHole"
							value={params.get('lanyardHole') === 'on' ? 'on' : ''}
							onChange={handleChange}
						/>
					</label>
				</form>
				<div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
					<a style={{ color: 'white' }} href={ticketImgUrl} target="_blank">
						Open Ticket Image
					</a>
					<a style={{ color: 'white' }} href={ticketSvgUrl} target="_blank">
						Open Ticket SVG
					</a>
				</div>
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
						lanyardHole={params.get('lanyardHole') === 'on' || false}
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
