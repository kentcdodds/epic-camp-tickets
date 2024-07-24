import { cloneElement } from 'react'
import {
	convexLogo,
	epicWebLogo,
	nxLogo,
	prismaLogo,
	tursoLogo,
} from './sponsors.tsx'

export function Ticket({
	name,
	avatar,
	handle,
	domain,
	ticketNumber,
}: {
	name: string
	avatar: string
	handle: string
	domain: string
	ticketNumber: string
}) {
	return (
		<Layout domain={domain} ticketNumber={ticketNumber}>
			<div
				style={{
					display: 'flex',
					zIndex: 10,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
					width: '100%',
					color: 'white',
					padding: 100,
				}}
			>
				<div
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'space-between',
						gap: 50,
						alignItems: 'center',
						padding: '0 30px',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<h1
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								fontSize: '80px',
								// https://github.com/vercel/satori/issues/498
								textWrap: name.includes(' ') ? 'balance' : 'initial',
								fontWeight: 700,
								marginBottom: 12,
							}}
						>
							{name}
						</h1>
						<p
							style={{
								display: 'flex',
								fontSize: '40px',
							}}
						>
							{handle}
						</p>
					</div>
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
				</div>
			</div>
		</Layout>
	)
}

function Layout({
	domain,
	children,
	ticketNumber,
}: {
	ticketNumber: string
	domain: string
	children: React.ReactNode
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
				background: 'linear-gradient(45deg, #23a6d5, #1587e0, #0f69b4)',
				color: 'white',
			}}
		>
			<div
				style={{
					display: 'flex',
					position: 'relative',
					height: '100%',
					width: '100%',
					borderRadius: 20,
					overflow: 'hidden',
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
						width: '100%',
						height: '100%',
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
						position: 'absolute',
						left: 40,
						top: '50%',
						transform: 'translateY(-50%)',
						width: 20,
						height: 80,
						backgroundColor: 'white',
						borderRadius: 20,
					}}
				/>
				<div
					style={{
						display: 'flex',
						position: 'absolute',
						top: 30,
						left: 30,
						gap: 12,
						alignItems: 'center',
					}}
				>
					{epicWebLogo}
					<h1 style={{ fontSize: 30, fontWeight: 700 }}>Epic Web Camp</h1>
				</div>
				<div
					style={{
						display: 'flex',
						position: 'absolute',
						top: 30,
						right: 30,
						gap: 12,
						alignItems: 'center',
						fontSize: 50,
						fontWeight: 200,
					}}
				>
					#{ticketNumber.padStart(2, '0')}
				</div>
				{children}
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 16,
						position: 'absolute',
						bottom: 20,
						left: 30,
						opacity: 0.8,
					}}
				>
					{cloneElement(tursoLogo, {
						style: { height: 50, width: 50 },
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
				</div>
				<div
					style={{
						display: 'flex',
						position: 'absolute',
						bottom: 20,
						right: 30,
						opacity: 0.8,
						fontSize: 40,
						fontWeight: 700,
					}}
				>
					epicweb.dev/camp
				</div>
			</div>
		</div>
	)
}
