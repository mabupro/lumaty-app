import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { ZodError } from 'zod'
import { festivalAllSchema } from '@/types/validate'

// 祭り全て取得用
export const GET = async () => {
	try {
		const festivals = await prisma.festival.findMany({
			include: {
				locations: true,
				news: true,
				images: true,
				programs: true,
			},
		})
		return NextResponse.json({ message: 'Success', festivals }, { status: 200 })
	} catch (error: unknown) {
		return NextResponse.json({ message: 'Error', error: (error as Error).message }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// 祭り投稿用
export const POST = async (req: Request) => {
	try {
		const body = await req.json()

		// Zodでバリデーション
		const validatedData = festivalAllSchema.parse(body)

		// Festival データを作成する
		const festival = await prisma.festival.create({
			data: {
				name: validatedData.name,
				country: validatedData.country,
				prefecture: validatedData.prefecture,
				city_town: validatedData.city_town,
				representative: validatedData.representative,
				overview: validatedData.overview,
				history: validatedData.history,
				start_date: validatedData.start_date ? new Date(validatedData.start_date) : null,
				end_date: validatedData.end_date ? new Date(validatedData.end_date) : null,
				locations: validatedData.locations ? { create: validatedData.locations } : undefined,
				news: validatedData.news ? { create: validatedData.news } : undefined,
				images: validatedData.images ? { create: validatedData.images } : undefined,
				programs: validatedData.programs ? { create: validatedData.programs } : undefined,
			},
		})

		return NextResponse.json({ message: 'Success', festival }, { status: 201 })
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.errors },
				{ status: 400 },
			)
		}
		return NextResponse.json({ message: 'Error', error: (error as Error).message }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
