import cachified from '@epic-web/cachified'
import { invariant } from '@epic-web/invariant'
import { Resvg } from '@resvg/resvg-js'
import satori, { type SatoriOptions } from 'satori'
import { cache } from '#app/utils.tsx'

export async function getSvg(
	jsx: React.ReactNode,
	{
		request,
		width,
		height,
	}: { request: Request; width: number; height: number },
) {
	const url = new URL(request.url)
	const svg = await satori(jsx, {
		width,
		height,
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

	return svg
}

export async function getImg(
	jsx: React.ReactNode,
	options: { request: Request; width: number; height: number },
) {
	const svg = await getSvg(jsx, options)
	const resvg = new Resvg(svg)
	const pngData = resvg.render()
	const img = pngData.asPng()

	return img
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
