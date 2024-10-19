import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Button, TextField, Box, MenuItem } from '@mui/material'

// Zodスキーマを使ってバリデーションを定義
const newsSchema = z.object({
	importance: z.string().min(1, '重要度は必須です'),
	posted_date: z.string().min(1, '投稿日付は必須です'),
	title: z.string().min(1, 'タイトルは必須です'),
	content: z.string().min(1, '内容は必須です'),
})

type NewsFormProps = {
	festivalId: number
}

export const NewsForm = ({ festivalId }: NewsFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(newsSchema),
	})

	const onSubmit = async (data: any) => {
		try {
			// POSTリクエストでニュース情報を追加
			const response = await axios.post(`/api/news`, { ...data, festival_id: festivalId })
			alert('ニュース情報が保存されました')
		} catch (error) {
			console.error('Error saving news:', error)
			alert('ニュース情報の保存に失敗しました')
		}
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
		>
			<TextField
				label="重要度"
				select
				{...register('importance')}
				error={!!errors.importance}
				helperText={errors.importance?.message}
			>
				<MenuItem value="高">高</MenuItem>
				<MenuItem value="中">中</MenuItem>
				<MenuItem value="低">低</MenuItem>
			</TextField>

			<TextField
				label="投稿日付"
				type="datetime-local"
				{...register('posted_date')}
				InputLabelProps={{ shrink: true }}
				error={!!errors.posted_date}
				helperText={errors.posted_date?.message}
			/>

			<TextField
				label="ニュースタイトル"
				{...register('title')}
				error={!!errors.title}
				helperText={errors.title?.message}
			/>

			<TextField
				label="ニュース内容"
				multiline
				rows={4}
				{...register('content')}
				error={!!errors.content}
				helperText={errors.content?.message}
			/>

			<Button type="submit" variant="contained">
				保存
			</Button>
		</Box>
	)
}
