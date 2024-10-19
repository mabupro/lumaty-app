import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Button, TextField, Box } from '@mui/material'

// Zodスキーマを使ってバリデーションを定義
const overviewHistorySchema = z.object({
	overview: z.string().optional(),
	history: z.string().optional(),
})

type OverviewHistoryFormProps = {
	festivalId: number
}

export const OverviewHistoryForm = ({ festivalId }: OverviewHistoryFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(overviewHistorySchema),
	})

	const onSubmit = async (data: any) => {
		try {
			// PUTリクエストで概要と歴史を更新
			const response = await axios.put(`/api/festival/${festivalId}/overview-history`, data)
			alert('概要と歴史が更新されました')
		} catch (error) {
			console.error('Error updating overview and history:', error)
			alert('概要と歴史の更新に失敗しました')
		}
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
		>
			<TextField
				label="概要"
				multiline
				rows={4}
				{...register('overview')}
				error={!!errors.overview}
				helperText={errors.overview?.message}
			/>
			<TextField
				label="歴史"
				multiline
				rows={4}
				{...register('history')}
				error={!!errors.history}
				helperText={errors.history?.message}
			/>

			<Button type="submit" variant="contained">
				保存
			</Button>
		</Box>
	)
}
