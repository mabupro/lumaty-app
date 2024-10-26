'use client'
import { useState, useEffect } from 'react'
import { festivalSchema } from '@/types/validate'

interface FestivalData {
	name: string
	country: string
	prefecture: string
	city_town: string
	representative: string
	overview: string
	history: string
	start_date: string
	end_date: string
}

interface FestivalFormProps {
	onSubmit: (festivalData: FestivalData) => void
	isNew: boolean // 新規作成か編集かを判断するプロパティ
	festivalId?: string | number // 編集時に使用するフェスティバルID
}

const FestivalForm = ({ onSubmit, isNew, festivalId }: FestivalFormProps) => {
	const [festivalData, setFestivalData] = useState<FestivalData>({
		name: '',
		country: '',
		prefecture: '',
		city_town: '',
		representative: '',
		overview: '',
		history: '',
		start_date: '',
		end_date: '',
	})

	const [errors, setErrors] = useState<Record<string, any>>({})
	const [isLoading, setIsLoading] = useState(true)

	// フェスティバルIDが存在する場合はデータを取得し、フォームにセットする
	useEffect(() => {
		const fetchFestivalData = async () => {
			if (!isNew && festivalId) {
				try {
					const response = await fetch(`/api/festival/${festivalId}`)
					const { festival } = await response.json() // festivalオブジェクトを展開
					if (festival) {
						setFestivalData({
							name: festival.name || '',
							country: festival.country || '',
							prefecture: festival.prefecture || '',
							city_town: festival.city_town || '',
							representative: festival.representative || '',
							overview: festival.overview || '',
							history: festival.history || '',
							start_date: festival.start_date || '',
							end_date: festival.end_date || '',
						})
						console.log('フェスティバルデータが設定されました:', festival)
					}
				} catch (error) {
					console.error('フェスティバルデータの取得に失敗しました。', error)
				} finally {
					setIsLoading(false)
				}
			} else {
				setIsLoading(false)
			}
		}

		fetchFestivalData()
	}, [festivalId, isNew])

	// フェスティバルデータが更新されたときに`console.log`を出力
	useEffect(() => {
		console.log('現在のフェスティバルデータ:', festivalData)
	}, [festivalData])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFestivalData({
			...festivalData,
			[name]: value,
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// バリデーションチェック
		const result = festivalSchema.safeParse(festivalData)

		if (!result.success) {
			const fieldErrors = result.error.format()
			setErrors(fieldErrors)
			return
		}

		// バリデーション通過後、データを送信する
		await onSubmit(festivalData)
	}

	if (isLoading) {
		return <div>データを読み込み中...</div>
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6"
		>
			<h2 className="text-xl font-bold">
				{festivalId ? '祭り・イベント情報の編集' : '新規祭り・イベント情報の作成'}
			</h2>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{/* 祭り・イベント名 */}
				<div>
					<label htmlFor="name" className="block text-sm font-medium mb-1">
						祭り・イベント名
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={festivalData.name}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.name && (
						<p className="text-red-500 text-xs mt-1">{errors.name._errors.join(', ')}</p>
					)}
				</div>

				{/* 国名 */}
				<div>
					<label htmlFor="country" className="block text-sm font-medium mb-1">
						国名
					</label>
					<input
						type="text"
						id="country"
						name="country"
						value={festivalData.country}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.country && (
						<p className="text-red-500 text-xs mt-1">{errors.country._errors.join(', ')}</p>
					)}
				</div>

				{/* 都道府県 */}
				<div>
					<label htmlFor="prefecture" className="block text-sm font-medium mb-1">
						都道府県
					</label>
					<input
						type="text"
						id="prefecture"
						name="prefecture"
						value={festivalData.prefecture}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.prefecture && (
						<p className="text-red-500 text-xs mt-1">{errors.prefecture._errors.join(', ')}</p>
					)}
				</div>

				{/* 市町村 */}
				<div>
					<label htmlFor="city_town" className="block text-sm font-medium mb-1">
						市町村
					</label>
					<input
						type="text"
						id="city_town"
						name="city_town"
						value={festivalData.city_town}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.city_town && (
						<p className="text-red-500 text-xs mt-1">{errors.city_town._errors.join(', ')}</p>
					)}
				</div>

				{/* 代表者 */}
				<div>
					<label htmlFor="representative" className="block text-sm font-medium mb-1">
						代表者名 または 代表団体名
					</label>
					<input
						type="text"
						id="representative"
						name="representative"
						value={festivalData.representative}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.representative && (
						<p className="text-red-500 text-xs mt-1">{errors.representative._errors.join(', ')}</p>
					)}
				</div>

				{/* イベント開始日 */}
				<div>
					<label htmlFor="start_date" className="block text-sm font-medium mb-1">
						イベント開始日
					</label>
					<input
						type="date"
						id="start_date"
						name="start_date"
						value={festivalData.start_date}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.start_date && (
						<p className="text-red-500 text-xs mt-1">{errors.start_date._errors.join(', ')}</p>
					)}
				</div>

				{/* イベント終了日 */}
				<div>
					<label htmlFor="end_date" className="block text-sm font-medium mb-1">
						イベント終了日
					</label>
					<input
						type="date"
						id="end_date"
						name="end_date"
						value={festivalData.end_date}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.end_date && (
						<p className="text-red-500 text-xs mt-1">{errors.end_date._errors.join(', ')}</p>
					)}
				</div>

				{/* 概要 */}
				<div className="sm:col-span-2">
					<label htmlFor="overview" className="block text-sm font-medium mb-1">
						概要
					</label>
					<textarea
						id="overview"
						name="overview"
						value={festivalData.overview}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.overview && (
						<p className="text-red-500 text-xs mt-1">{errors.overview._errors.join(', ')}</p>
					)}
				</div>

				{/* 歴史 */}
				<div className="sm:col-span-2">
					<label htmlFor="history" className="block text-sm font-medium mb-1">
						歴史
					</label>
					<textarea
						id="history"
						name="history"
						value={festivalData.history}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-emerald-300"
					/>
					{errors.history && (
						<p className="text-red-500 text-xs mt-1">{errors.history._errors.join(', ')}</p>
					)}
				</div>
			</div>

			{/* 保存ボタン */}
			<button
				type="submit"
				className="mt-6 w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-700 transition"
			>
				{festivalId ? '更新' : '作成'}
			</button>
		</form>
	)
}

export default FestivalForm
