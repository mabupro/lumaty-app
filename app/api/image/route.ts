import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'

// Zodを使ったバリデーションスキーマ
const imageSchema = z.object({
	festival_id: z.number(),
	image_url: z.string().url(),
	description: z.string().optional(),
	type: z.string(),
	uploaded_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: 'Invalid uploaded_date format',
	}),
})

// すべての画像を取得する GET メソッド
export const GET = async () => {
	try {
		const images = await prisma.image.findMany({
			include: {
				festival: true, // 祭りに関連する情報も含める
			},
		})

		if (images.length === 0) {
			return NextResponse.json({ message: 'No images found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', images }, { status: 200 })
	} catch (error) {
		console.error('Error fetching images:', error.message)
		return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
	}
}

// 新しい画像を追加する POST メソッド
export const POST = async (req: Request) => {
	try {
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

		// 新しい画像をデータベースに追加
		const newImage = await prisma.image.create({
			data: {
				festival_id,
				image_url,
				description,
				type,
				uploaded_date: new Date(uploaded_date),
			},
		})

		return NextResponse.json({ message: 'Image added successfully', newImage }, { status: 201 })
	} catch (error) {
		console.error('Error adding image:', error.message)
		return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
	}
}
