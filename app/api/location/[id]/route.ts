import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 祭りごとのデータ取得
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const festival_id = Number(url.pathname.split('/location/')[1])

		// isNaN を Number.isNaN に置き換え
		if (Number.isNaN(festival_id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		const locations = await prisma.location.findMany({
			where: { festival_id },
			include: {
				programs: true, // プログラム情報も含める
				festival: true, // 祭り情報も含める
			},
		})

		if (locations.length === 0) {
			return NextResponse.json({ message: 'Locations not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', locations }, { status: 200 })
	} catch (error) {
		// error が Error 型かチェック
		if (error instanceof Error) {
			console.error('Error fetching news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		// unknown 型のエラーが発生した場合
		console.error('Unknown error fetching news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}finally {
		await prisma.$disconnect()
	}
}

// データ編集用
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/location/')[1])

		// isNaN を Number.isNaN に置き換え
		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid location ID' }, { status: 400 })
		}

		const { type, latitude, longitude, start_datetime, end_datetime, is_shared } = await req.json()

		// 必須項目のチェック
		if (!type || !latitude || !longitude) {
			return NextResponse.json(
				{ message: 'Required fields are missing' },
				{ status: 400 },
			)
		}

		const updatedLocation = await prisma.location.update({
			data: {
				type,
				latitude,
				longitude,
				start_datetime,
				end_datetime,
				is_shared,
			},
			where: { id },
		})

		return NextResponse.json({ message: 'Success', updatedLocation }, { status: 200 })
	} catch (error) {
		// error が Error 型かチェック
		if (error instanceof Error) {
			console.error('Error fetching news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		// unknown 型のエラーが発生した場合
		console.error('Unknown error fetching news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}finally {
		await prisma.$disconnect()
	}
}
