import type { Metadata } from 'next'
import type React from 'react'
import { Lalezar } from 'next/font/google'
import './globals.css'

const LalezarFont = Lalezar({
	weight: '400',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Lumaty-App',
	description: '祭りやイベントについて情報提供アプリです',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={LalezarFont.className}>{children}</body>
		</html>
	)
}
