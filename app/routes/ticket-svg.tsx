import { cachified } from '@epic-web/cachified'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Ticket } from '#app/components/ticket.js'
import { getSvg } from '#app/img.server.ts'
import { cache, getDomainUrl, getErrorMessage } from '#app/utils.tsx'

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url)
	const name = url.searchParams.get('name') || null
	const handle = url.searchParams.get('handle') || null
	const avatar = url.searchParams.get('avatar') || null
	const ticketNumber = url.searchParams.get('ticketNumber') || null
	const lanyardHole = url.searchParams.get('lanyardHole') === 'on'

	const element = (
		<Ticket
			domain={getDomainUrl(request)}
			name={name}
			handle={handle}
			avatar={avatar}
			ticketNumber={ticketNumber}
			lanyardHole={lanyardHole}
		/>
	)

	const debug = url.searchParams.get('debug') === 'true'
	const forceFresh =
		url.searchParams.get('fresh') === 'true' || debug ? true : undefined

	try {
		const svg = await cachified({
			forceFresh,
			key: request.url,
			cache,
			ttl: 1000 * 60 * 60 * 24 * 7,
			staleWhileRevalidate: 1000 * 60 * 60 * 24 * 365,
			getFreshValue: async () => {
				return await getSvg(element, { width: 800, height: 1200, request })
			},
		})
		return new Response(svg, {
			headers: {
				'Cache-Control': !(debug || url.searchParams.has('fresh'))
					? 'public, max-age=31536000, immutable'
					: 'no-cache no-store',
				'Content-Type': 'image/svg+xml',
			},
		})
	} catch (error) {
		return new Response(getErrorMessage(error), {
			status: 500,
		})
	}
}
