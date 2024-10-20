import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { ZodError } from 'zod'
import { locationSchema } from '@/types/validate' 

// 位置情報全て取得
export const GET = async () => {
	try {
		const locations = await prisma.location.findMany({
			include: {
				programs: true, // 各ロケーションに関連するプログラムも取得
				// festival: true, // 祭り情報も取得
			},
		})

		if (locations.length === 0) {
			return NextResponse.json({ message: 'No locations found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', locations }, { status: 200 })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// 位置情報を作成
export const POST = async (req: Request) => {
	try {
		const body = await req.json()

		// Zodでバリデーション
		const validatedLocation = locationSchema.parse(body)

		// 位置情報の作成
		const newLocation = await prisma.location.create({
			data: {
				festival_id: validatedLocation.festival_id,
				type: validatedLocation.type,
				latitude: validatedLocation.latitude,
				longitude: validatedLocation.longitude,
				name: validatedLocation.name || null,
			},
		})

		return NextResponse.json({ message: 'Success', newLocation }, { status: 201 })
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.errors },
				{ status: 400 },
			)
		}
		if (error instanceof Error) {
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
