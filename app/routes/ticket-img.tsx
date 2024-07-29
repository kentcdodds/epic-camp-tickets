import { cachified } from '@epic-web/cachified'
import { invariant } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Resvg } from '@resvg/resvg-js'
import { renderToStaticMarkup } from 'react-dom/server'
import satori, { type SatoriOptions } from 'satori'
import { Ticket } from '#app/components/ticket.js'
import { cache, getDomainUrl, getErrorMessage } from '#app/utils.tsx'

const WIDTH = 800
const HEIGHT = 1200

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url)
	const name = url.searchParams.get('name') || null
	const handle = url.searchParams.get('handle') || null
	const avatar = url.searchParams.get('avatar') || null
	const ticketNumber = url.searchParams.get('ticketNumber') || null

	const element = (
		<Ticket
			domain={getDomainUrl(request)}
			name={name}
			handle={handle}
			avatar={avatar}
			ticketNumber={ticketNumber}
		/>
	)

	const renderHtml = url.searchParams.get('html')
	if (renderHtml === 'true') {
		return new Response(renderToStaticMarkup(element), {
			headers: { 'Content-Type': 'text/html' },
		})
	}

	const debug = url.searchParams.get('debug') === 'true'

	try {
		const { svg, img } = await cachified({
			// if debug is true, then force, otherwise use undefined and it'll be derived from the request
			// forceFresh: debug ? debug : undefined,
			forceFresh: true,
			key: request.url,
			cache,
			ttl: 1000 * 60 * 60 * 24 * 7,
			staleWhileRevalidate: 1000 * 60 * 60 * 24 * 365,
			getFreshValue: async () => {
				return await getOgImg(element, { request })
			},
		})
		if (url.searchParams.get('svg') === 'true') {
			return new Response(svg, {
				headers: {
					'Cache-Control': !(debug || url.searchParams.has('fresh'))
						? 'public, max-age=31536000, immutable'
						: 'no-cache no-store',
					'Content-Type': 'image/svg+xml',
				},
			})
		} else {
			return new Response(img, {
				headers: {
					'Cache-Control': !(debug || url.searchParams.has('fresh'))
						? 'public, max-age=31536000, immutable'
						: 'no-cache no-store',
					'Content-Type': 'image/png',
				},
			})
		}
	} catch (error) {
		return new Response(getErrorMessage(error), {
			status: 500,
		})
	}
}

async function getOgImg(
	jsx: React.ReactNode,
	{ request }: { request: Request },
) {
	const url = new URL(request.url)
	const svg = await satori(jsx, {
		width: WIDTH,
		height: HEIGHT,
		debug: url.searchParams.get('debug') === 'true',
		fonts: await Promise.all([getFont({ font: 'Josefin Sans' })]).then(
			(fonts) => fonts.flat(),
		),
		loadAdditionalAsset: async (code: string, segment: string) => {
			if (code === 'emoji') {
				const svg = await getEmoji(segment)
				if (!svg) return ''
				const base64 = Buffer.from(svg).toString('base64')
				return `data:image/svg+xml;base64,${base64}`
			}

			console.error(`Unhandled asset code: "${code}" for segment "${segment}"`)

			return ''
		},
	})

	const resvg = new Resvg(svg)
	const pngData = resvg.render()
	const img = pngData.asPng()

	return { svg, img }
}

async function getEmoji(emoji: string) {
	const emojiCode = emojiToCodePoints(emoji)
	if (!emojiCode) return null
	const emojiUrl = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15/assets/svg/${emojiCode}.svg`
	return cachified({
		cache,
		key: emojiUrl,
		ttl: 1000 * 60 * 60 * 24,
		swr: 1000 * 60 * 60 * 24 * 365,
		getFreshValue: async () => {
			const response = await fetch(emojiUrl)
			return response.text()
		},
	})
}

function emojiToCodePoints(emoji: string) {
	const codePoints = []
	for (let i = 0; i < emoji.length; i++) {
		const codePoint = emoji.codePointAt(i)
		if (!codePoint) continue
		codePoints.push(codePoint.toString(16))
		if (codePoint > 0xffff) {
			// Skip the next code unit for surrogate pairs
			i++
		}
	}
	return codePoints.join('-')
}

async function getFont({
	font,
	weights = [200, 300, 400, 500, 600, 700],
}: {
	font: string
	weights?: Array<number>
}) {
	const weightsString = weights.join(';')
	const fetchUrl = `https://fonts.googleapis.com/css2?family=${font}:wght@${weightsString}`
	const css = await cachified({
		key: fetchUrl,
		cache,
		ttl: 1000 * 60 * 60 * 24,
		swr: 1000 * 60 * 60 * 24 * 365,
		getFreshValue: async () => {
			return fetch(fetchUrl, {
				headers: {
					// Make sure it returns TTF.
					'User-Agent':
						'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
				},
			}).then((response) => response.text())
		},
	})

	const resource = css.matchAll(
		/src: url\((.+)\) format\('(opentype|truetype)'\)/g,
	)

	return Promise.all(
		[...resource]
			.map((match) => match[1])
			.map((url) => {
				invariant(
					url,
					() => `Expected a URL to be parsed from the google font:\n${css}`,
				)
				return fetch(url).then((response) => response.arrayBuffer())
			})
			.map(async (buffer, i) => ({
				name: font,
				style: 'normal',
				weight: weights[i],
				data: await buffer,
			})),
	) as Promise<SatoriOptions['fonts']>
}
