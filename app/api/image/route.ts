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
	image_url: z.string().url('無効なURLです'),
})

// すべての画像を取得する GET メソッド
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const type = url.searchParams.get('type') // 画像のタイプを取得（例: 'thumbnail', 'overview', 'history'）

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

// 画像アップロードを行う POST メソッド
export const POST = async (req: Request) => {
	try {
		const formData = await req.formData()
		const file = formData.get('file') as File | null
		const uniqueFileName = formData.get('file_name') as string

		if (!file || !uniqueFileName) {
			return NextResponse.json({ message: 'ファイルがアップロードされていません' }, { status: 400 })
		}

		const { data, error } = await supabase.storage
			.from('festival-image-bucket')
			.upload(`public/${uniqueFileName}`, file)

		if (error || !data) {
			console.error('Supabaseアップロードエラー:', error)
			return NextResponse.json(
				{
					message: 'Supabaseへのファイルアップロードエラー',
					error: error?.message || 'Unknown error',
				},
				{ status: 500 },
			)
		}

		const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/festival-image-bucket/${data.path}`
		const festival_id = Number(formData.get('festival_id'))
		const description = formData.get('description')?.toString()
		const type = formData.get('type')?.toString()
		const uploaded_date = formData.get('uploaded_date')?.toString()

		const result = imageSchema.safeParse({
			festival_id,
			description,
			type,
			uploaded_date,
			image_url: imageUrl,
		})

		if (!result.success) {
			console.log('バリデーションエラー:', result.error.errors)
			return NextResponse.json(
				{ message: 'バリデーションエラー', errors: result.error.errors },
				{ status: 400 },
			)
		}

		const newImage = await prisma.image.create({
			data: {
				festival_id: result.data.festival_id,
				image_url: result.data.image_url,
				description: result.data.description,
				type: result.data.type,
				uploaded_date: new Date(result.data.uploaded_date),
			},
		})

		return NextResponse.json(
			{ message: '画像が正常にアップロードされ、データベースに登録されました', newImage },
			{ status: 201 },
		)
	} catch (error) {
		console.error('画像アップロードまたはデータベース登録中のエラー:', error)
		return NextResponse.json(
			{ message: '画像アップロードまたはデータベース登録中のエラー', error: error },
			{ status: 500 },
		)
	}
}
