import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'

// Zodを使ったバリデーションスキーマ
const locationSchema = z.object({
	festival_id: z.number(),
	name: z.string().optional(),
	type: z.string(),
	latitude: z.number(),
	longitude: z.number(),
})

// 位置情報全て取得
export const GET = async () => {
	try {
		const locations = await prisma.location.findMany({
			include: {
				programs: true, // 各ロケーションに関連するプログラムも取得
			},
		})

		if (locations.length === 0) {
			return NextResponse.json({ message: 'No locations found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', locations }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching locations:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error fetching locations:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 位置情報を作成
export const POST = async (req: Request) => {
	try {
		const body = await req.json()

		// バリデーションチェック
		const result = locationSchema.safeParse(body)
		if (!result.success) {
			return NextResponse.json(
				{ message: 'Validation error', errors: result.error.errors },
				{ status: 400 },
			)
		}

		const { festival_id, name, type, latitude, longitude } = result.data

		// 位置情報の作成
		const newLocation = await prisma.location.create({
			data: {
				festival_id,
				name,
				type,
				latitude,
				longitude,
			},
		})

		return NextResponse.json({ message: 'Success', newLocation }, { status: 201 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error creating location:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error creating location:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
