import { NextResponse } from 'next/server'
import formidable from 'formidable'
import { uploadToStorage } from '@/utils/uploadToStorage' 
import { z } from 'zod'

export const config = {
	api: {
		bodyParser: false, // formidableを使用するため、デフォルトのbodyParserを無効化
	},
}

// Zodを使ったバリデーションスキーマ
const imageUploadSchema = z.object({
	description: z.string().optional(),
	type: z.string(),
	uploaded_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: 'Invalid uploaded_date format',
	}),
})

// POSTメソッド - 画像アップロード処理
export const POST = async (req: Request) => {
	const form = new formidable.IncomingForm()

	try {
		// フォームデータを解析
		const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) reject(err)
				resolve({ fields, files })
			})
		})

		// バリデーションチェック
		const result = imageUploadSchema.safeParse(fields)
		if (!result.success) {
			return NextResponse.json(
				{ message: 'Validation error', errors: result.error.errors },
				{ status: 400 },
			)
		}

		const { description, type, uploaded_date } = result.data
		const file = files.file[0] // 'file' はフロントエンドのinputのname属性と一致させる

		// 画像ファイルをSupabaseにアップロード
		const imageUrl = await uploadToStorage(file)

		// 応答として画像URLを返す
		return NextResponse.json({ imageUrl, description, type, uploaded_date }, { status: 201 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error processing request:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error processing request:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}
