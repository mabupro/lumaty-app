import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { supabase } from '@/lib/supabase'
import { ZodError } from 'zod'
import { imageSchema } from '@/types/validate'

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
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error fetching images', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 新しい画像をアップロードして追加
export const POST = async (req: Request) => {
	try {
		const formData = await req.formData()
		const file = formData.get('file') as File | null

		if (!file) {
			return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
		}

		// ファイルをSupabaseのストレージにアップロード
		const { data, error } = await supabase.storage
			.from('festival-image-bucket')
			.upload(`public/${file.name}`, file)

		if (error) {
			// biome-ignore lint/style/useTemplate: <explanation>
			throw new Error('Error uploading file to Supabase: ' + error.message)
		}

		const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/festival-image-bucket/${data.path}`

		// フォームデータから必要な情報を取得して、Prismaに保存
		const festival_id = Number(formData.get('festival_id'))
		const description = formData.get('description')?.toString()
		const type = formData.get('type')?.toString() // typeを取得
		const uploaded_date = formData.get('uploaded_date')?.toString()

		// バリデーション
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
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.errors },
				{ status: 400 },
			)
		}
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error uploading image', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 画像を削除
export const DELETE = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/').pop())

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid image ID' }, { status: 400 })
		}

		// Prismaから画像データを取得
		const image = await prisma.image.findUnique({ where: { id } })

		if (!image) {
			return NextResponse.json({ message: 'Image not found' }, { status: 404 })
		}

		// Supabaseの削除用パスを抽出
		const imagePath = image.image_url.split('/public/')[1]
		if (!imagePath) {
			return NextResponse.json({ message: 'Invalid image path' }, { status: 500 })
		}

		// Supabaseからの削除
		const { error: storageError } = await supabase.storage
			.from('festival-image-bucket')
			.remove([`public/${imagePath}`])

		if (storageError) {
			console.error('Error deleting file from Supabase:', storageError)
			return NextResponse.json(
				{ message: 'Error deleting file from storage', error: storageError.message },
				{ status: 500 },
			)
		}

		// Prismaからの削除
		const deletedImage = await prisma.image.delete({ where: { id } })
		return NextResponse.json(
			{ message: 'Image deleted successfully', deletedImage },
			{ status: 200 },
		)
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error deleting image', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
