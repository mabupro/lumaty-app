import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

// Zodを使ったバリデーションスキーマ
const imageSchema = z.object({
	festival_id: z.number(),
	description: z.string().optional(),
	type: z.string(),
	uploaded_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: 'Invalid uploaded_date format',
	}),
})

// すべての画像を取得する GET メソッド
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const type = url.searchParams.get('type') // 画像のタイプ（例: 'thumbnail', 'overview', 'history'）

		const images = await prisma.image.findMany({
			where: {
				type: type || undefined, // typeが指定されていればフィルターを適用
			},
			include: {
				festival: true, // 祭りに関連する情報も含める
			},
		})

		if (images.length === 0) {
			return NextResponse.json({ message: 'No images found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', images }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error fetching images', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 新しい画像を追加する POST メソッド
export const POST = async (req: Request) => {
	try {
		const formData = await req.formData()
		const file = formData.get('file') as File | null
		if (!file) {
			return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
		}

		// Supabaseにファイルをアップロード
		const { data, error } = await supabase.storage
			.from('festival-image-bucket')
			.upload(`public/${file.name}`, file)

		if (error) {
			return NextResponse.json(
				{ message: 'Error uploading file to Supabase', error: error.message },
				{ status: 500 },
			)
		}

		const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/festival-image-bucket/${data.path}`

		// 他のデータを取得
		const festival_id = Number(formData.get('festival_id'))
		const description = formData.get('description')?.toString()
		const type = formData.get('type')?.toString() // サムネイル、概要、歴史など
		const uploaded_date = formData.get('uploaded_date')?.toString()

		const result = imageSchema.safeParse({ festival_id, description, type, uploaded_date })
		if (!result.success) {
			return NextResponse.json(
				{ message: 'Validation error', errors: result.error.errors },
				{ status: 400 },
			)
		}

		// 同じfestival_idとtypeを持つ画像があるか確認して、あれば上書き、なければ新規追加
		const existingImage = await prisma.image.findFirst({
			where: { festival_id: result.data.festival_id, type: result.data.type },
		})

		let newImage: any
		if (existingImage) {
			// 既存画像の更新
			newImage = await prisma.image.update({
				where: { id: existingImage.id },
				data: {
					image_url: imageUrl,
					description: result.data.description,
					uploaded_date: new Date(result.data.uploaded_date),
				},
			})
		} else {
			// 新規画像の追加
			newImage = await prisma.image.create({
				data: {
					festival_id: result.data.festival_id,
					image_url: imageUrl,
					description: result.data.description,
					type: result.data.type,
					uploaded_date: new Date(result.data.uploaded_date),
				},
			})
		}

		return NextResponse.json(
			{ message: 'Image added or updated successfully', newImage },
			{ status: 201 },
		)
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error adding or updating image', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}
