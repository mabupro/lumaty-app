import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
// biome-ignore lint/correctness/noUndeclaredDependencies: <explanation>
import { ZodError } from 'zod'
import { festivalSchema, locationSchema, newsSchema, imageSchema } from '@/types/validate' // validate.tsからスキーマをインポート

// 祭りごとに取得用
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/festival/')[1])

		if (Number.isNaN(id)) {
			// idが数値でない場合のチェック
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		const festival = await prisma.festival.findFirst({
			where: { id },
			include: {
				locations: true,
				news: true,
				images: true,
				programs: true,
			},
		})

		if (!festival) {
			return NextResponse.json({ message: 'Festival not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', festival }, { status: 200 })
	} catch (error: unknown) {
		return NextResponse.json(
			{ message: 'Error fetching festival', error: (error as Error).message },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}

// 祭り編集用
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/festival/')[1])

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		const body = await req.json()

		// 各スキーマを使ってバリデーション
		const validatedFestival = festivalSchema.parse(body)
		const validatedLocations = body.locations
			? locationSchema.array().parse(body.locations)
			: undefined
		const validatedNews = body.news ? newsSchema.array().parse(body.news) : undefined
		const validatedImages = body.images ? imageSchema.array().parse(body.images) : undefined

		// Festival データを更新する
		const festival = await prisma.festival.update({
			where: { id },
			data: {
				name: validatedFestival.name,
				country: validatedFestival.country,
				prefecture: validatedFestival.prefecture,
				city_town: validatedFestival.city_town,
				representative: validatedFestival.representative,
				overview: validatedFestival.overview,
				history: validatedFestival.history,
				start_date: validatedFestival.start_date ? new Date(validatedFestival.start_date) : null,
				end_date: validatedFestival.end_date ? new Date(validatedFestival.end_date) : null,
				locations: validatedLocations ? { deleteMany: {}, create: validatedLocations } : undefined,
				news: validatedNews ? { deleteMany: {}, create: validatedNews } : undefined,
				images: validatedImages ? { deleteMany: {}, create: validatedImages } : undefined,
			},
		})

		return NextResponse.json({ message: 'Success', festival }, { status: 200 })
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.errors },
				{ status: 400 },
			)
		}
		return NextResponse.json(
			{ message: 'Error updating festival', error: (error as Error).message },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
