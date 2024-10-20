import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { ZodError } from 'zod'
import { locationSchema } from '@/types/validate'

// 特定のロケーションまたは複数ロケーションを取得
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/location/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const location_id = paths?.[1] ? Number(paths[1]) : undefined

		// festival_idが有効かどうかチェック
		if (Number.isNaN(festival_id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		// location_idが指定されている場合、その特定のロケーションを取得
		if (location_id !== undefined) {
			if (Number.isNaN(location_id)) {
				return NextResponse.json({ message: 'Invalid location ID' }, { status: 400 })
			}

			const location = await prisma.location.findFirst({
				where: { festival_id, id: location_id },
				include: {
					programs: true, // プログラム情報も含める
				},
			})

			if (!location) {
				return NextResponse.json({ message: 'Location not found' }, { status: 404 })
			}

			return NextResponse.json({ message: 'Success', location }, { status: 200 })
		}

		// location_idが指定されていない場合、指定されたfestival_idのすべてのロケーションを取得
		const locations = await prisma.location.findMany({
			where: { festival_id },
			include: {
				programs: true,
			},
		})

		if (locations.length === 0) {
			return NextResponse.json({ message: 'No locations found for this festival' }, { status: 404 })
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

// ロケーションの編集
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/location/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const location_id = paths?.[1] ? Number(paths[1]) : undefined

		if (Number.isNaN(festival_id) || Number.isNaN(location_id)) {
			return NextResponse.json({ message: 'Invalid festival or location ID' }, { status: 400 })
		}

		const body = await req.json()

		// Zodでバリデーション
		const validatedLocation = locationSchema.parse(body)

		// ロケーションの更新
		const updatedLocation = await prisma.location.update({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			where: { id: location_id!, festival_id },
			data: {
				type: validatedLocation.type,
				latitude: validatedLocation.latitude,
				longitude: validatedLocation.longitude,
				name: validatedLocation.name || null, // 名前があれば設定、なければnull
			},
		})

		return NextResponse.json({ message: 'Success', updatedLocation }, { status: 200 })
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

// ロケーションの削除
export const DELETE = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/location/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const location_id = paths?.[1] ? Number(paths[1]) : undefined

		if (Number.isNaN(festival_id) || Number.isNaN(location_id)) {
			return NextResponse.json({ message: 'Invalid festival or location ID' }, { status: 400 })
		}

		// ロケーションの削除
		const deletedLocation = await prisma.location.delete({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			where: { id: location_id!, festival_id },
		})

		return NextResponse.json(
			{ message: 'Location deleted successfully', deletedLocation },
			{ status: 200 },
		)
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error deleting location', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
