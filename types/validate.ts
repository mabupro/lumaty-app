import { z } from 'zod'

export const festivalAllSchema = z.object({
	name: z.string().min(1, '祭り・イベント名は必須です'),
	country: z.string().min(1, '国名は必須です'),
	prefecture: z.string().min(1, '都道府県は必須です'),
	city_town: z.string().min(1, '市町村は必須です'),
	representative: z.string().optional(),
	overview: z.string().optional(),
	history: z.string().optional(),
	start_date: z.coerce.date().optional(),
	end_date: z.coerce.date().optional(),
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
				posted_date: z.coerce.date(),
				title: z.string(),
				content: z.string(),
			}),
		)
		.optional(),
	images: z
		.array(
			z.object({
				image_url: z.string(),
				type: z.string(),
				description: z.string().optional(),
				uploaded_date: z.coerce.date(),
			}),
		)
		.optional(),
	programs: z
		.array(
			z.object({
				name: z.string(),
				start_time: z.coerce.date(), // Date型に変更
				end_time: z.coerce.date().optional(), // Date型に変更
				description: z.string().optional(),
			}),
		)
		.optional(),
})

// フェスティバル情報のバリデーションスキーマ
export const festivalSchema = z.object({
	name: z.string().min(1, '祭り・イベント名は必須です'),
	country: z.string().min(1, '国名は必須です'),
	prefecture: z.string().min(1, '都道府県は必須です'),
	city_town: z.string().min(1, '市町村は必須です'),
	representative: z.string().optional(),
	overview: z.string().optional(),
	history: z.string().optional(),
	start_date: z.coerce.date().optional(),
	end_date: z.coerce.date().optional(),
})

// 場所情報のバリデーションスキーマ
export const locationSchema = z.object({
	festival_id: z.number(),
	type: z.string().min(1, '場所の種類は必須です'),
	name: z.string().optional(),
	latitude: z.number().min(-90).max(90, '無効な緯度です'),
	longitude: z.number().min(-180).max(180, '無効な経度です'),
})

// プログラム情報のバリデーションスキーマ
export const programSchema = z.object({
	festival_id: z.number(),
	name: z.string().min(1, 'プログラム名は必須です'),
	location_id: z.number(),
	start_time: z.string().min(1, '開始時刻は必須です'), // 文字列のまま扱う
	end_time: z.string().optional(), // 文字列のまま扱う
	description: z.string().optional(),
})

// ニュースのバリデーションスキーマ
export const newsSchema = z.object({
	festival_id: z.number(),
	importance: z.string().min(1, '重要度は必須です'),
	posted_date: z.coerce.date(), // Date型に変更
	title: z.string().min(1, 'タイトルは必須です'),
	content: z.string().min(1, '内容は必須です'),
})

// 画像のバリデーションスキーマ
export const imageSchema = z.object({
	festival_id: z.number(),
	image_url: z.string().url('無効なURLです'),
	type: z.string().min(1, '属性は必須です'),
	description: z.string().optional(),
	uploaded_date: z.coerce.date(), // Date型に変更
})
