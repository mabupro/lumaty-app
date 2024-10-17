import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'

// バリデーション用のZodスキーマ
const festivalSchema = z.object({
	name: z.string(),
	country: z.string(),
	prefecture: z.string(),
	city_town: z.string(),
	representative: z.string().optional(),
	overview: z.string().optional(),
	history: z.string().optional(),
	start_date: z
		.string()
		.refine((date) => !Number.isNaN(Date.parse(date)), {
			message: 'Invalid start_date format',
		})
		.optional(),
	end_date: z
		.string()
		.refine((date) => !Number.isNaN(Date.parse(date)), {
			message: 'Invalid end_date format',
		})
		.optional(),
	locations: z
		.array(
			z.object({
				type: z.string(),
				name: z.string().optional(),
				latitude: z.number(),
				longitude: z.number(),
			}),
		)
		.optional(),
	news: z
		.array(
			z.object({
				importance: z.string(),
				posted_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
					message: 'Invalid posted_date format',
				}),
				title: z.string(),
				content: z.string(),
			}),
		)
		.optional(),
	images: z
		.array(
			z.object({
				image_url: z.string().url(),
				description: z.string().optional(),
				uploaded_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
					message: 'Invalid uploaded_date format',
				}),
			}),
		)
		.optional(),
})

// 祭りごとのデータ取得用
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/festival/')[1])

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		const festival = await prisma.festival.findFirst({ where: { id } })

		if (!festival) {
			return NextResponse.json({ message: 'Festival not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', festival }, { status: 200 })
	} catch (error) {
		console.error('Error fetching festival:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// 祭り編集用のPUTメソッド
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/festival/')[1])

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		const body = await req.json()

		// バリデーションチェック
		const result = festivalSchema.safeParse(body)
		if (!result.success) {
			return NextResponse.json(
				{ message: 'Validation error', errors: result.error.errors },
				{ status: 400 },
			)
		}

		const {
			name,
			country,
			prefecture,
			city_town,
			representative,
			overview,
			history,
			start_date,
			end_date,
			locations,
			news,
			images,
		} = result.data

		// Festival データを更新する
		const festival = await prisma.festival.update({
			where: { id },
			data: {
				name,
				country,
				prefecture,
				city_town,
				representative,
				overview,
				history,
				start_date: start_date ? new Date(start_date) : null,
				end_date: end_date ? new Date(end_date) : null,
				// 関連データの更新: locations, news, images
				locations: {
					deleteMany: {}, // 既存のデータを削除
					create: locations, // 新規データの作成
				},
				news: {
					deleteMany: {}, // 既存のデータを削除
					create: news, // 新規データの作成
				},
				images: {
					deleteMany: {}, // 既存のデータを削除
					create: images, // 新規データの作成
				},
			},
		})

		return NextResponse.json({ message: 'Success', festival }, { status: 200 })
	} catch (error) {
		console.error('Error updating festival:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
