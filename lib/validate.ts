import { z } from 'zod'

export const festivalSchema = z.object({
	name: z.string().min(1, { message: '祭り・イベント名は必須です' }),
	country: z.string().min(1, { message: '国名は必須です' }),
	prefecture: z.string().min(1, { message: '都道府県は必須です' }),
	city_town: z.string().min(1, { message: '市町村は必須です' }),
	representative: z.string().min(1,{message: "代表者または代表団体名は必須です"}),
	overview: z.string().optional(),
	history: z.string().optional(),
	start_date: z
		.string()
		.optional()
		.refine((val) => val === undefined || !Number.isNaN(Date.parse(val)), {
			message: '正しい日付形式で入力してください',
		}),
	end_date: z
		.string()
		.optional()
		.refine((val) => val === undefined || !Number.isNaN(Date.parse(val)), {
			message: '正しい日付形式で入力してください',
		}),
})

export const programSchema = z.object({
	festival_id: z.number(),
	name: z.string().min(1, { message: 'プログラム名は必須です' }),
	location_id: z.number().optional(),
	start_time: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: '正しい時刻形式で入力してください',
	}),
	end_time: z
		.string()
		.optional()
		.refine((val) => val === undefined || !Number.isNaN(Date.parse(val)), {
			message: '正しい時刻形式で入力してください',
		}),
	description: z.string().optional(),
})

export const locationSchema = z.object({
	festival_id: z.number(),
	type: z.string().min(1, { message: '場所の種類は必須です' }),
	name: z.string().optional(),
	latitude: z.number().refine((val) => val >= -90 && val <= 90, {
		message: '緯度は-90から90の範囲で入力してください',
	}),
	longitude: z.number().refine((val) => val >= -180 && val <= 180, {
		message: '経度は-180から180の範囲で入力してください',
	}),
})

export const newsSchema = z.object({
	festival_id: z.number(),
	importance: z.string().min(1, { message: '重要度は必須です' }),
	posted_date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: '正しい日付形式で入力してください',
	}),
	title: z.string().min(1, { message: 'ニュースタイトルは必須です' }),
	content: z.string().min(1, { message: 'ニュース内容は必須です' }),
})

export const imageSchema = z.object({
	festival_id: z.number(),
	image_url: z.string().url({ message: '有効なURLを入力してください' }),
	description: z.string().optional(),
	uploaded_date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: '正しい日付形式で入力してください',
	}),
})

export const validateFestival = (data: any) => {
	return festivalSchema.safeParse(data)
}

export const validateProgram = (data: any) => {
	return programSchema.safeParse(data)
}

export const validateLocation = (data: any) => {
	return locationSchema.safeParse(data)
}

export const validateNews = (data: any) => {
	return newsSchema.safeParse(data)
}

export const validateImage = (data: any) => {
	return imageSchema.safeParse(data)
}
