import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { ZodError } from 'zod'
import { programSchema } from '@/types/validate'

// プログラムを全て取得
export const GET = async () => {
	try {
		const programs = await prisma.program.findMany({
			include: {
				location: true, // 関連する場所を含む
				festival: true, // 関連する祭りを含む
			},
		})
		return NextResponse.json({ message: 'Success', programs }, { status: 200 })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// 新しいプログラムを追加
export const POST = async (req: Request) => {
	try {
		const body = await req.json()

		// Zodでバリデーション
		const validatedProgram = programSchema.parse(body)

		// 新しいプログラムを作成
		const newProgram = await prisma.program.create({
			data: {
				festival_id: validatedProgram.festival_id,
				name: validatedProgram.name,
				location_id: validatedProgram.location_id, // nullでもOK
				start_time: new Date(validatedProgram.start_time), // 日付をDate型に変換
				end_time: validatedProgram.end_time ? new Date(validatedProgram.end_time) : null, // 終了時間があればDate型に変換
				description: validatedProgram.description,
			},
		})

		return NextResponse.json({ message: 'Success', newProgram }, { status: 201 })
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.errors },
				{ status: 400 },
			)
		}
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error creating program', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
