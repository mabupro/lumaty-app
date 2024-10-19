import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Button, TextField, Box, MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'

// Zodスキーマを使ってバリデーションを定義
const programSchema = z.object({
	name: z.string().min(1, 'プログラム名は必須です'),
	location_id: z.union([z.string(), z.number()]).nullable(),
	start_time: z.string().min(1, '開始時間は必須です'),
	end_time: z.string().optional(),
	description: z.string().optional(),
})

type ProgramFormProps = {
	festivalId: number
}

export const ProgramForm = ({ festivalId }: ProgramFormProps) => {
	const [locations, setLocations] = useState<any[]>([]) // 場所リストを取得して格納
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: zodResolver(programSchema),
	})

	// 場所リストを取得するための API リクエスト
	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const response = await axios.get(`/api/locations?festivalId=${festivalId}`)
				if (response.data.locations) {
					setLocations(response.data.locations)
				} else {
					setLocations([]) // データがない場合の処理
				}
			} catch (error) {
				console.error('Error fetching locations:', error)
				setLocations([]) // エラー時に空のリストをセット
			}
		}
		fetchLocations()
	}, [festivalId])

	const onSubmit = async (data: any) => {
		try {
			// PUTリクエストでプログラム情報を更新
			const response = await axios.put(`/api/program/${festivalId}`, data)
			alert('プログラム情報が更新されました')
		} catch (error) {
			console.error('Error updating program:', error)
			alert('プログラム情報の更新に失敗しました')
		}
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
		>
			<TextField
				label="プログラム名"
				{...register('name')}
				error={!!errors.name}
				helperText={errors.name?.message}
			/>
			<TextField
				label="開始時間"
				type="datetime-local"
				{...register('start_time')}
				InputLabelProps={{ shrink: true }}
				error={!!errors.start_time}
				helperText={errors.start_time?.message}
			/>
			<TextField
				label="終了時間"
				type="datetime-local"
				{...register('end_time')}
				InputLabelProps={{ shrink: true }}
				error={!!errors.end_time}
				helperText={errors.end_time?.message}
			/>

			<TextField
				label="場所"
				select
				{...register('location_id')}
				error={!!errors.location_id}
				helperText={errors.location_id?.message}
				InputLabelProps={{ shrink: true }}
			>
				<MenuItem value="">選択しない</MenuItem> {/* 選択しないオプション */}
				{locations.length > 0 ? (
					locations.map((location) => (
						<MenuItem key={location.id} value={location.id}>
							{location.name || `${location.latitude}, ${location.longitude}`}
						</MenuItem>
					))
				) : (
					<MenuItem disabled>場所が見つかりません</MenuItem>
				)}
			</TextField>

			<TextField
				label="説明"
				multiline
				rows={4}
				{...register('description')}
				error={!!errors.description}
				helperText={errors.description?.message}
			/>

			<Button type="submit" variant="contained">
				保存
			</Button>
		</Box>
	)
}
