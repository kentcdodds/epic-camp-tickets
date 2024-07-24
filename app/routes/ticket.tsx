import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Ticket } from '#app/components/ticket.tsx'
import { getDomainUrl } from '#app/utils.js'

export async function loader({ request }: LoaderFunctionArgs) {
	return json({
		domain: getDomainUrl(request),
	})
}

export default function TicketRoute() {
	const { domain } = useLoaderData<typeof loader>()
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					width: 1200,
					height: 630,
					display: 'block',
					margin: 'auto',
					backgroundColor: 'hsl(0, 0%, 90%)',
				}}
			>
				<Ticket
					domain={domain}
					name="Sunny Leggettanivia"
					handle="@Sunny4days"
					avatar="https://pbs.twimg.com/profile_images/1293247566767767552/A9povSSf_400x400.jpg"
					ticketNumber="2"
				/>
			</div>
		</div>
	)
}
