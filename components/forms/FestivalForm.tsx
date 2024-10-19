import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Button, TextField, Box } from '@mui/material'

// Zodスキーマを使ってバリデーションを定義
const festivalSchema = z.object({
	name: z.string().min(1, 'フェスティバル名は必須です'),
	country: z.string().min(1, '国名は必須です'),
	prefecture: z.string().min(1, '県名は必須です'),
	city_town: z.string().min(1, '市町村名は必須です'),
	representative: z.string().min(1, '代表者名 または 代表団体名は必須です'),
	start_date: z.string().min(1, '開始日は必須です'),
	end_date: z.string().min(1, '終了日は必須です'),
})

export const FestivalForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(festivalSchema),
	})

	const onSubmit = async (data: any) => {
		try {
			// POSTリクエストで新しいフェスティバルデータを作成
			const response = await axios.post('/api/festival', data)
			alert('新しいフェスティバルが登録されました')
		} catch (error) {
			console.error('Error creating festival:', error)
			alert('フェスティバルの登録に失敗しました')
		}
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
		>
			<TextField
				label="祭り または イベント名"
				{...register('name')}
				error={!!errors.name}
				helperText={errors.name?.message}
			/>
			<TextField
				label="国名"
				{...register('country')}
				error={!!errors.country}
				helperText={errors.country?.message}
			/>
			<TextField
				label="都道府県"
				{...register('prefecture')}
				error={!!errors.prefecture}
				helperText={errors.prefecture?.message}
			/>
			<TextField
				label="市町村"
				{...register('city_town')}
				error={!!errors.city_town}
				helperText={errors.city_town?.message}
			/>
			<TextField
				label="代表者 または 代表団体名"
				{...register('representative')}
				error={!!errors.representative}
				helperText={errors.representative?.message}
			/>
			<TextField
				label="開始日"
				type="date"
				{...register('start_date')}
				InputLabelProps={{ shrink: true }}
				error={!!errors.start_date}
				helperText={errors.start_date?.message}
			/>
			<TextField
				label="終了日"
				type="date"
				{...register('end_date')}
				InputLabelProps={{ shrink: true }}
				error={!!errors.end_date}
				helperText={errors.end_date?.message}
			/>

			<Button type="submit" variant="contained">
				保存
			</Button>
		</Box>
	)
}
