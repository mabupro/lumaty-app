import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Button, TextField, Box, MenuItem } from '@mui/material'

// Zodスキーマを使ってバリデーションを定義
const locationSchema = z.object({
	type: z.string().min(1, '場所の種類は必須です'),
	name: z.string().optional(), // 名前は任意
	latitude: z
		.number()
		.min(-90, '緯度は -90 以上の値を入力してください')
		.max(90, '緯度は 90 以下の値を入力してください'),
	longitude: z
		.number()
		.min(-180, '経度は -180 以上の値を入力してください')
		.max(180, '経度は 180 以下の値を入力してください'),
})

type LocationFormProps = {
	festivalId: number
}

export const LocationForm = ({ festivalId }: LocationFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(locationSchema),
	})

	const onSubmit = async (data: any) => {
		try {
			// POSTリクエストで新しい場所情報を追加
			const response = await axios.post(`/api/location`, { ...data, festival_id: festivalId })
			alert('場所情報が保存されました')
		} catch (error) {
			console.error('Error saving location:', error)
			alert('場所情報の保存に失敗しました')
		}
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
		>
			<TextField
				label="場所の種類"
				select
				{...register('type')}
				error={!!errors.type}
				helperText={errors.type?.message}
			>
				<MenuItem value="主要場所">主要場所</MenuItem>
				<MenuItem value="ゴミ箱">ゴミ箱</MenuItem>
				<MenuItem value="駐車場">駐車場</MenuItem>
				<MenuItem value="トイレ">トイレ</MenuItem>
				{/* 他の場所の種類を追加 */}
			</TextField>

			<TextField
				label="場所の名前 (任意)"
				{...register('name')}
				error={!!errors.name}
				helperText={errors.name?.message}
			/>

			<TextField
				label="緯度"
				type="number"
				inputProps={{ step: 'any' }}
				{...register('latitude', { valueAsNumber: true })}
				error={!!errors.latitude}
				helperText={errors.latitude?.message}
			/>

			<TextField
				label="経度"
				type="number"
				inputProps={{ step: 'any' }}
				{...register('longitude', { valueAsNumber: true })}
				error={!!errors.longitude}
				helperText={errors.longitude?.message}
			/>

			<Button type="submit" variant="contained">
				保存
			</Button>
		</Box>
	)
}
