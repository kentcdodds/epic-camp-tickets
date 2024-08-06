import { cloneElement } from 'react'
import {
	convexLogo,
	epicWebLogo,
	tigrisLogo,
	nxLogo,
	prismaLogo,
	thisDotLogo,
	tursoLogo,
} from './sponsors.tsx'

export function Ticket({
	name,
	avatar,
	handle,
	domain,
	ticketNumber,
	lanyardHole,
}: {
	name: string | null
	avatar: string | null
	handle: string | null
	domain: string
	ticketNumber: string | null
	lanyardHole: boolean
}) {
	name ??= ' '
	avatar ??= `${domain}/img/profile-filler.png`
	handle ??= ' '
	return (
		<Layout
			domain={domain}
			ticketNumber={ticketNumber}
			lanyardHole={lanyardHole}
		>
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignItems: 'center',
					color: 'white',
					padding: '50px 20px 20px 20px',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 30,
						alignItems: 'center',
					}}
				>
					<img
						src={avatar}
						style={{
							height: 340,
							width: 340,
							objectFit: 'cover',
							borderRadius: '50%',
							border: '4px solid white',
						}}
					/>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 24,
							alignItems: 'center',
						}}
					>
						<h1
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								fontSize: '80px',
								// https://github.com/vercel/satori/issues/498
								textWrap: name.includes(' ') ? 'balance' : 'initial',
								textAlign: 'center',
								fontWeight: 700,
								margin: 0,
							}}
						>
							{name}
						</h1>
						<p
							style={{
								display: 'flex',
								fontSize: '40px',
								margin: 10,
							}}
						>
							{handle}
						</p>
						<p
							style={{
								display: 'flex',
								fontSize: '30px',
								textAlign: 'center',
								textWrap: 'balance',
								margin: 0,
							}}
						>
							An epic experience in the mountains of Utah
						</p>
					</div>
				</div>
			</div>
		</Layout>
	)
}

function Layout({
	domain,
	children,
	ticketNumber,
	lanyardHole,
}: {
	ticketNumber: string | null
	domain: string
	children: React.ReactNode
	lanyardHole: boolean
}) {
	return (
		<div
			style={{
				fontFamily: 'Josefin Sans',
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				position: 'relative',
				padding: 40,
				background: 'linear-gradient(105deg, #5ed77a, #35d25d, #4bd07a)',
				color: 'white',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
					height: '100%',
					width: '100%',
					borderRadius: 20,
					overflow: 'hidden',
					padding: '60px 40px 20px 40px',
				}}
			>
				<div
					style={{
						display: 'flex',
						position: 'absolute',
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
						width: 800,
						height: 1200,
						backgroundColor: '#080B16',
					}}
				>
					<img
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							opacity: 0.4,
						}}
						src={`${domain}/img/aspen-grove.png`}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						height: '100%',
						width: '100%',
						flexDirection: 'column',
						position: 'relative',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<div
							style={{
								display: 'flex',
								width: 80,
								height: 20,
								backgroundColor: lanyardHole ? 'white' : 'transparent',
								borderRadius: 20,
							}}
						/>
					</div>
					{/* <div style={{ display: 'flex', height: 30 }} /> */}
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div
							style={{
								display: 'flex',
								gap: 12,
								alignItems: 'center',
							}}
						>
							{cloneElement(epicWebLogo, { width: 68, height: 80 })}
							<h1 style={{ fontSize: 30, fontWeight: 700 }}>Epic Web Camp</h1>
						</div>
						<div
							style={{
								display: 'flex',
								gap: 12,
								alignItems: 'center',
								fontSize: 50,
								fontWeight: 300,
								letterSpacing: 2,
							}}
						>
							{ticketNumber ? `#${ticketNumber.padStart(2, '0')}` : ' '}
						</div>
					</div>
					{children}
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 30,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								display: 'flex',
								gap: 50,
								justifyContent: 'center',
								alignItems: 'center',
								opacity: 0.9,
							}}
						>
							{cloneElement(tigrisLogo, { style: { width: 197, height: 80 } })}
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 24,
								opacity: 0.8,
							}}
						>
							{cloneElement(tursoLogo, {
								style: { height: 43, width: 50 },
							})}
							{cloneElement(convexLogo, {
								style: { height: 50, width: 50 },
							})}
							{cloneElement(nxLogo, {
								style: { height: 32, width: 50 },
							})}
							{cloneElement(prismaLogo, {
								style: { height: 50, width: 41 },
							})}
							{cloneElement(thisDotLogo, {
								style: { height: 30, width: 50 },
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
