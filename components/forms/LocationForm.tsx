'use client'
import { useState, useEffect } from 'react'
import { locationSchema } from '@/types/validate'

interface Location {
	id: string
	type: string
	name: string
	latitude: string
	longitude: string
}

interface LocationFormProps {
	festivalId: number
}

const LocationForm = ({ festivalId }: LocationFormProps) => {
	const [locations, setLocations] = useState<Location[]>([])
	const [formData, setFormData] = useState({
		type: '',
		name: '',
		latitude: '',
		longitude: '',
	})
	const [errors, setErrors] = useState<Record<string, any>>({})

	useEffect(() => {
		// 場所一覧を取得
		const fetchLocations = async () => {
			if (festivalId) {
				try {
					const response = await fetch(`/api/location/${festivalId}`)
					if (!response.ok) {
						throw new Error(`Error fetching locations for festivalId: ${festivalId}`)
					}
					const data = await response.json()
					setLocations(data.locations || [])
				} catch (error) {
					console.error('Error fetching locations:', error)
				}
			}
		}
		fetchLocations()
	}, [festivalId])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: name === 'latitude' || name === 'longitude' ? Number.parseFloat(value) || '' : value, 
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// バリデーション
		const result = locationSchema.safeParse({
			...formData,
			festival_id: festivalId,
		})

		if (!result.success) {
			const fieldErrors = result.error.format()
			setErrors(fieldErrors)
			return
		}

		try {
			const response = await fetch('/api/location', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData, festival_id: festivalId }),
			})
			const data = await response.json()

			// 新しい場所をリストに追加
			setLocations((prev) => [...prev, data])
			setFormData({
				type: '',
				name: '',
				latitude: '',
				longitude: '',
			})
			setErrors({})
		} catch (error) {
			console.error('Error adding location:', error)
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{/* 場所の種類 */}
					<div>
						<label htmlFor="type" className="block text-sm font-medium mb-2">
							場所の種類
						</label>
						<input
							type="text"
							name="type"
							id="type"
							placeholder="場所の種類"
							value={formData.type}
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						/>
						{errors.type && (
							<p className="text-red-500 text-xs mt-1">{errors.type._errors.join(', ')}</p>
						)}
					</div>

					{/* 場所の名前 */}
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-2">
							場所の名前
						</label>
						<input
							type="text"
							name="name"
							id="name"
							placeholder="場所の名前"
							value={formData.name}
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						/>
						{errors.name && (
							<p className="text-red-500 text-xs mt-1">{errors.name._errors.join(', ')}</p>
						)}
					</div>

					{/* 緯度 */}
					<div>
						<label htmlFor="latitude" className="block text-sm font-medium mb-2">
							緯度
						</label>
						<input
							type="number"
							name="latitude"
							id="latitude"
							placeholder="緯度"
							value={formData.latitude}
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						/>
						{errors.latitude && (
							<p className="text-red-500 text-xs mt-1">{errors.latitude._errors.join(', ')}</p>
						)}
					</div>

					{/* 経度 */}
					<div>
						<label htmlFor="longitude" className="block text-sm font-medium mb-2">
							経度
						</label>
						<input
							type="number"
							name="longitude"
							id="longitude"
							placeholder="経度"
							value={formData.longitude}
							onChange={handleChange}
							className="input-field w-full p-2 border border-gray-300 rounded-md"
						/>
						{errors.longitude && (
							<p className="text-red-500 text-xs mt-1">{errors.longitude._errors.join(', ')}</p>
						)}
					</div>
				</div>

				{/* 追加ボタン */}
				<button
					type="submit"
					className="mt-6 w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-700"
				>
					場所を追加
				</button>
			</form>

			<h2 className="text-xl font-semibold mt-8">登録済みの場所</h2>
			<ul className="mt-4 space-y-2">
				{locations.map((location) => (
					<li key={location.id} className="border-b pb-2">
						<strong>{location.name || location.type}</strong> <br />
						<span className="text-sm text-gray-600">
							緯度: {location.latitude}, 経度: {location.longitude}
						</span>
					</li>
				))}
			</ul>
		</div>
	)
}

export default LocationForm
