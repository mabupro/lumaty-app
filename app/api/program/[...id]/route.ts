import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { ZodError } from 'zod'
import { programSchema } from '@/types/validate'

// プログラム取得
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/api/program/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const program_id = paths?.[1] ? Number(paths[1]) : undefined

		if (Number.isNaN(festival_id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		if (program_id !== undefined) {
			if (Number.isNaN(program_id)) {
				return NextResponse.json({ message: 'Invalid program ID' }, { status: 400 })
			}

			const program = await prisma.program.findFirst({
				where: { festival_id, id: program_id },
				include: {
					location: true, // 関連する場所も含める
				},
			})

			if (!program) {
				return NextResponse.json({ message: 'Program not found' }, { status: 404 })
			}

			return NextResponse.json({ message: 'Success', program }, { status: 200 })
		}

		// プログラムIDが指定されていない場合、festival_idに関連するすべてのプログラムを取得
		const programs = await prisma.program.findMany({
			where: { festival_id },
			include: {
				location: true,
			},
		})

		if (programs.length === 0) {
			return NextResponse.json({ message: 'No programs found for this festival' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', programs }, { status: 200 })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error fetching programs', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// プログラム更新
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/api/program/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const program_id = paths?.[1] ? Number(paths[1]) : undefined

		// festival_idやprogram_idが有効かチェック
		if (Number.isNaN(festival_id) || Number.isNaN(program_id)) {
			return NextResponse.json({ message: 'Invalid festival or program ID' }, { status: 400 })
		}

		const body = await req.json()

		// バリデーション時に festival_id を除外する
		const validatedProgram = programSchema.omit({ festival_id: true }).parse(body)

		// プログラムを更新
		const updatedProgram = await prisma.program.update({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			where: { id: program_id!, festival_id },
			data: {
				name: validatedProgram.name,
				location_id: validatedProgram.location_id, // nullでもOK
				start_time: new Date(validatedProgram.start_time), // 日付をDate型に変換
				end_time: validatedProgram.end_time ? new Date(validatedProgram.end_time) : null,
				description: validatedProgram.description,
			},
		})

		return NextResponse.json({ message: 'Success', updatedProgram }, { status: 200 })
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.errors },
				{ status: 400 },
			)
		}
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error updating program', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// プログラム削除
export const DELETE = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/api/program/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const program_id = paths?.[1] ? Number(paths[1]) : undefined

		if (Number.isNaN(festival_id) || Number.isNaN(program_id)) {
			return NextResponse.json({ message: 'Invalid festival or program ID' }, { status: 400 })
		}

		// プログラムの削除
		const deletedProgram = await prisma.program.delete({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			where: { id: program_id!, festival_id },
		})

		return NextResponse.json(
			{ message: 'Program deleted successfully', deletedProgram },
			{ status: 200 },
		)
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error deleting program', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
