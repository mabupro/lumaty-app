import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Supabaseクライアントの設定
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!, // サーバーサイドのキー
)

// Supabaseに画像をアップロードしてURLを返す関数
export const uploadToStorage = async (file: formidable.File): Promise<string> => {
	// ファイルの読み込み
	const fileBuffer = fs.readFileSync(file.filepath)

	// ランダムなファイル名を生成
	const fileName = `${uuidv4()}-${file.originalFilename}`

	// Supabaseのストレージバケットにファイルをアップロード
	const { data, error } = await supabase.storage
		.from('festival-image-bucket') // バケット名を指定
		.upload(`images/${fileName}`, fileBuffer, {
			contentType: file.mimetype,
		})

	if (error) {
		console.error('Error uploading file to Supabase:', error)
		throw new Error('Failed to upload file to Supabase')
	}

	// アップロードされたファイルの公開URLを取得
	const { publicURL, error: urlError } = supabase.storage
		.from('festival-image-bucket')
		.getPublicUrl(`images/${fileName}`)

	if (urlError) {
		console.error('Error getting public URL from Supabase:', urlError)
		throw new Error('Failed to get public URL from Supabase')
	}

	return publicURL
}
