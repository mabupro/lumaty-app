import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'

export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/image/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const id = paths?.[1] ? Number(paths[1]) : undefined

		// festival_idが有効な数値かチェック
		if (Number.isNaN(festival_id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		// 画像IDが指定されている場合、特定の画像を取得
		if (id !== undefined) {
			if (Number.isNaN(id)) {
				return NextResponse.json({ message: 'Invalid image ID' }, { status: 400 })
			}

			const image = await prisma.image.findFirst({
				where: { festival_id, id },
			})

			if (!image) {
				return NextResponse.json({ message: 'Image not found' }, { status: 404 })
			}

			return NextResponse.json({ message: 'Success', image }, { status: 200 })
		}

		// 画像IDが指定されていない場合、すべての画像を取得
		const image = await prisma.image.findMany({
			where: { festival_id },
		})

		if (image.length === 0) {
			return NextResponse.json({ message: 'No image found for this festival' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', image }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error fetching news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}
