import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'

// Zodを使ったバリデーションスキーマ
const imageSchema = z.object({
	festival_id: z.number().optional(),
	image_url: z.string().url(),
	description: z.string().optional(),
	type: z.string(),
	uploaded_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: 'Invalid uploaded_date format',
	}),
})

// 画像取得
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
		const images = await prisma.image.findMany({
			where: { festival_id },
		})

		if (images.length === 0) {
			return NextResponse.json({ message: 'No images found for this festival' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', images }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching images:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error fetching images:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 画像更新用 PUT メソッド
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/image/')[1]?.split('/')[1])

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid image ID' }, { status: 400 })
		}

		const body = await req.json()

		// バリデーションチェック
		const result = imageSchema.safeParse(body)
		if (!result.success) {
			return NextResponse.json(
				{ message: 'Validation error', errors: result.error.errors },
				{ status: 400 },
			)
		}

		const { festival_id, image_url, description, type, uploaded_date } = result.data

		const updatedImage = await prisma.image.update({
			where: { id },
			data: {
				festival_id,
				image_url,
				description,
				type,
				uploaded_date: new Date(uploaded_date),
			},
		})

		return NextResponse.json({ message: 'Success', updatedImage }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error updating image:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error updating image:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 画像削除用 DELETE メソッド
export const DELETE = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/image/')[1]?.split('/')[1])

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid image ID' }, { status: 400 })
		}

		const deletedImage = await prisma.image.delete({
			where: { id },
		})

		return NextResponse.json(
			{ message: 'Image deleted successfully', deletedImage },
			{ status: 200 },
		)
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error deleting image:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error deleting image:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}
