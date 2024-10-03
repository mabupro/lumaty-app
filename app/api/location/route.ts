import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 位置情報全て取得
export const GET = async () => {
	try {
		const locations = await prisma.location.findMany({
			include: {
				programs: true, // 各ロケーションに関連するプログラムも取得
				festival: true, // 祭り情報も取得
			},
		})

		if (locations.length === 0) {
			return NextResponse.json({ message: 'No locations found' }, { status: 404 })
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
	}
}

// 位置情報を作成
export const POST = async (req: Request) => {
	try {
		const { festival_id, type, latitude, longitude, start_datetime, end_datetime, is_shared } =
			await req.json()

		// バリデーション
		if (!festival_id || !type || !latitude || !longitude) {
			return NextResponse.json(
				{ message: 'Required fields are missing' },
				{ status: 400 },
			)
		}

		const newLocation = await prisma.location.create({
			data: {
				festival_id,
				type,
				latitude,
				longitude,
				start_datetime,
				end_datetime,
				is_shared,
			},
		})

		return NextResponse.json(
			{ message: 'Success', newLocation },
			{ status: 201 },
		)
	} catch (error) {
		// error が Error 型かチェック
		if (error instanceof Error) {
			console.error('Error fetching news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		// unknown 型のエラーが発生した場合
		console.error('Unknown error fetching news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}
