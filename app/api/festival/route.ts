import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'

// フェスティバル作成用のバリデーションスキーマ
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
				type: z.string(),
				uploaded_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
					message: 'Invalid uploaded_date format',
				}),
			}),
		)
		.optional(),
	programs: z
		.array(
			z.object({
				name: z.string(),
				start_time: z.string().refine((time) => !Number.isNaN(Date.parse(time)), {
					message: 'Invalid start_time format',
				}),
				end_time: z
					.string()
					.refine((time) => !Number.isNaN(Date.parse(time)), {
						message: 'Invalid end_time format',
					})
					.optional(),
				description: z.string().optional(),
				location_id: z.number().optional(),
			}),
		)
		.optional(),
})

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
	} catch (error) {
		console.error('Error fetching festivals:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// 祭り投稿用
export const POST = async (req: Request) => {
	try {
		const body = await req.json()

		// バリデーション
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
			programs,
		} = result.data

		// フェスティバルデータの作成
		const festival = await prisma.festival.create({
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
				locations: {
					create: locations,
				},
				news: {
					create: news,
				},
				images: {
					create: images,
				},
				programs: {
					create: programs,
				},
			},
		})
		return NextResponse.json({ message: 'Success', festival }, { status: 201 })
	} catch (error) {
		console.error('Error creating festival:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
