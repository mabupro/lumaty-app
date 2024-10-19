import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Button, TextField, Box, MenuItem, CircularProgress } from '@mui/material'
import { useState } from 'react'

// Zodスキーマを使ってバリデーションを定義
const imageSchema = z.object({
	image_url: z.string().url('有効なURLを入力してください').min(1, '画像のURLは必須です'),
	description: z.string().optional(),
	type: z.string().min(1, '画像の種類は必須です'),
	uploaded_date: z.string().min(1, 'アップロード日は必須です'),
})

type ImageFormProps = {
	festivalId: number
}

export const ImageForm = ({ festivalId }: ImageFormProps) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(imageSchema),
	})
	const [uploading, setUploading] = useState(false) // アップロード状態を管理

	// 画像をアップロードする関数
	const handleFileUpload = async (file: File) => {
		const formData = new FormData()
		formData.append('file', file)

		try {
			setUploading(true) // アップロード中
			const response = await axios.post('/api/upload-image', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})

			// サーバーからURLを取得してフォームにセット
			setValue('image_url', response.data.imageUrl)
			setUploading(false)
		} catch (error) {
			console.error('Error uploading file:', error)
			setUploading(false)
			alert('画像のアップロードに失敗しました')
		}
	}

	const onSubmit = async (data: any) => {
		try {
			// POSTリクエストで画像情報を追加
			const response = await axios.post(`/api/image`, { ...data, festival_id: festivalId })
			alert('画像情報が保存されました')
		} catch (error) {
			console.error('Error saving image:', error)
			alert('画像情報の保存に失敗しました')
		}
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
		>
			<input
				type="file"
				accept="image/*"
				onChange={(e) => {
					if (e.target.files?.[0]) {
						handleFileUpload(e.target.files[0])
					}
				}}
			/>
			{uploading && <CircularProgress />} {/* アップロード中に表示 */}
			<TextField
				label="画像URL"
				{...register('image_url')}
				error={!!errors.image_url}
				helperText={errors.image_url?.message}
				disabled={true} // URLは自動的にセットされるので編集不可
			/>
			<TextField
				label="画像の説明 (任意)"
				multiline
				rows={3}
				{...register('description')}
				error={!!errors.description}
				helperText={errors.description?.message}
			/>
			<TextField
				label="画像の種類"
				select
				{...register('type')}
				error={!!errors.type}
				helperText={errors.type?.message}
			>
				<MenuItem value="header">ヘッダー画像</MenuItem>
				<MenuItem value="overview">概要画像</MenuItem>
				<MenuItem value="history">歴史画像</MenuItem>
			</TextField>
			<TextField
				label="アップロード日"
				type="datetime-local"
				{...register('uploaded_date')}
				InputLabelProps={{ shrink: true }}
				error={!!errors.uploaded_date}
				helperText={errors.uploaded_date?.message}
			/>
			<Button type="submit" variant="contained" disabled={uploading}>
				保存
			</Button>
		</Box>
	)
}
