'use client'
import { useState, useEffect } from 'react'
import { programSchema } from '@/types/validate'

interface Program {
	id: string
	name: string
	start_time: string
	end_time: string
	description: string
	location_id: string
}

interface Location {
	id: string
	type: string
	name: string
}

interface ProgramFormProps {
	festivalId: string | number
}

const ProgramForm = ({ festivalId }: ProgramFormProps) => {
	const [programs, setPrograms] = useState<Program[]>([])
	const [formData, setFormData] = useState({
		name: '',
		start_time: '',
		end_time: '',
		description: '',
		location_name: '', // ユーザーが選択した場所名を保存
	})
	const [locations, setLocations] = useState<Location[]>([])
	const [errors, setErrors] = useState<Record<string, any>>({})

	useEffect(() => {
		const fetchPrograms = async () => {
			try {
				const response = await fetch(`/api/program/${festivalId}`)
				const data = await response.json()
				setPrograms(data.programs || [])
			} catch (error) {
				console.error('Error fetching programs:', error)
			}
		}
		fetchPrograms()

		const fetchLocations = async () => {
			try {
				const response = await fetch(`/api/location/${festivalId}`)
				const data = await response.json()
				setLocations(data.locations || [])
			} catch (error) {
				console.error('Error fetching locations:', error)
			}
		}
		fetchLocations()
	}, [festivalId])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// 選択された場所名に対応するlocation_idを検索
		const selectedLocation = locations.find((location) => location.name === formData.location_name)

		if (!selectedLocation) {
			setErrors({ location_name: { _errors: ['Invalid location selected'] } })
			return
		}

		// バリデーションの前に、start_time と end_time に任意の日付を追加
		const defaultDate = '2023-01-01' // 任意の日付
		const startDateTime = new Date(`${defaultDate}T${formData.start_time}:00`)
		const endDateTime = formData.end_time
			? new Date(`${defaultDate}T${formData.end_time}:00`)
			: null

		// start_time, end_timeのバリデーション
		if (isNaN(startDateTime.getTime()) || (formData.end_time && isNaN(endDateTime?.getTime()))) {
			setErrors({ time: { _errors: ['Invalid start or end time'] } })
			return
		}

		// バリデーション
		const result = programSchema.safeParse({
			...formData,
			festival_id: festivalId,
			location_id: selectedLocation.id, // location_nameを元にidを設定
			start_time: startDateTime.toISOString(), // ISO形式に変換
			end_time: endDateTime ? endDateTime.toISOString() : null, // ISO形式に変換
		})

		if (!result.success) {
			const fieldErrors = result.error.format()
			setErrors(fieldErrors)
			return
		}

		try {
			const response = await fetch('/api/program', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					festival_id: festivalId,
					location_id: selectedLocation.id,
					start_time: startDateTime.toISOString(), // ISO形式に変換
					end_time: endDateTime ? endDateTime.toISOString() : null, // ISO形式に変換
				}),
			})
			if (!response.ok) {
				const errorData = await response.json()
				console.error('Error adding program:', errorData)
				setErrors({ general: 'Failed to add program. Please try again.' })
				return
			}

			const data = await response.json()
			setPrograms((prev) => [...prev, data])
			setFormData({
				name: '',
				start_time: '',
				end_time: '',
				description: '',
				location_name: '', // フォームをリセット
			})
			setErrors({})
		} catch (error) {
			console.error('Error adding program:', error)
			setErrors({ general: 'An unexpected error occurred.' })
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{/* プログラム名 */}
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-2">
							プログラム名
						</label>
						<input
							type="text"
							name="name"
							id="name"
							placeholder="プログラム名"
							value={formData.name}
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						/>
						{errors.name && (
							<p className="text-red-500 text-xs mt-1">{errors.name._errors.join(', ')}</p>
						)}
					</div>

					{/* 開始時間 */}
					<div>
						<label htmlFor="start_time" className="block text-sm font-medium mb-2">
							開始時間
						</label>
						<input
							type="time"
							name="start_time"
							id="start_time"
							value={formData.start_time}
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						/>
						{errors.start_time && (
							<p className="text-red-500 text-xs mt-1">{errors.start_time._errors.join(', ')}</p>
						)}
					</div>

					{/* 終了時間 */}
					<div>
						<label htmlFor="end_time" className="block text-sm font-medium mb-2">
							終了時間
						</label>
						<input
							type="time"
							name="end_time"
							id="end_time"
							value={formData.end_time}
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						/>
						{errors.end_time && (
							<p className="text-red-500 text-xs mt-1">{errors.end_time._errors.join(', ')}</p>
						)}
					</div>

					{/* 場所 */}
					<div className="sm:col-span-2">
						<label htmlFor="location_name" className="block text-sm font-medium mb-2">
							場所を選択
						</label>
						<select
							name="location_name" // location_nameを使用
							id="location_name"
							value={formData.location_name} // location_idではなくlocation_nameを使用
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						>
							<option value="">場所を選択</option>
							{locations.map((location) => (
								<option key={location.id} value={location.name}>
									{' '}
									{/* 名前を表示し、送信時はidを使用 */}
									{location.name || location.type}
								</option>
							))}
						</select>
						{errors.location_name && (
							<p className="text-red-500 text-xs mt-1">{errors.location_name._errors.join(', ')}</p>
						)}
					</div>

					{/* 詳細 */}
					<div className="sm:col-span-2">
						<label htmlFor="description" className="block text-sm font-medium mb-2">
							プログラムの詳細
						</label>
						<textarea
							name="description"
							id="description"
							placeholder="プログラムの詳細"
							value={formData.description}
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						/>
						{errors.description && (
							<p className="text-red-500 text-xs mt-1">{errors.description._errors.join(', ')}</p>
						)}
					</div>
				</div>

				{/* 追加ボタン */}
				<button
					type="submit"
					className="mt-6 w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-700"
				>
					プログラムを追加
				</button>
			</form>

			<h2 className="text-xl font-semibold mt-8">登録済みのプログラム</h2>
			<ul className="mt-4 space-y-2">
				{programs.map((program) => {
					// 開始時間と終了時間をDateオブジェクトに変換
					const startTime = new Date(program.start_time)
					const endTime = program.end_time ? new Date(program.end_time) : null

					return (
						<li key={program.id} className="border-b pb-2">
							<strong>{program.name}</strong> <br />
							<span className="text-sm text-gray-600">
								{/* 有効な開始時間を表示、無効なら '未設定' */}
								{startTime && !Number.isNaN(startTime.getTime())
									? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
									: '未設定'}{' '}
								- {/* 有効な終了時間を表示、無効なら '未設定' */}
								{endTime && !Number.isNaN(endTime.getTime())
									? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
									: '未設定'}
							</span>
							<br />
							<span className="text-sm text-gray-600">
								{/* 場所情報を表示 */}
								場所: {program.location?.name || '場所未設定'}
							</span>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default ProgramForm
