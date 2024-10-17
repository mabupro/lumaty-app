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

// 祭りごとのデータ取得
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const festival_id = Number(url.pathname.split('/location/')[1])

		// festival_id のバリデーション
		if (Number.isNaN(festival_id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		const locations = await prisma.location.findMany({
			where: { festival_id },
			include: {
				programs: true, // プログラム情報も含める
			},
		})

		if (locations.length === 0) {
			return NextResponse.json({ message: 'Locations not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', locations }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching locations:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error fetching locations:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// データ編集用
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/location/')[1])

		// id のバリデーション
		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid location ID' }, { status: 400 })
		}

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

		// データ更新処理
		const updatedLocation = await prisma.location.update({
			data: {
				festival_id,
				name,
				type,
				latitude,
				longitude,
			},
			where: { id },
		})

		return NextResponse.json({ message: 'Success', updatedLocation }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error updating location:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error updating location:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// データ削除用
export const DELETE = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/location/')[1])

		// id のバリデーション
		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid location ID' }, { status: 400 })
		}

		// データ削除処理
		const deletedLocation = await prisma.location.delete({
			where: { id },
		})

		return NextResponse.json({ message: 'Success', deletedLocation }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error deleting location:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error deleting location:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
