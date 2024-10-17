'use client'
import { useState } from 'react'
import type FestivalData from '@/types/typeFestival'
import {
	validateFestival,
	validateProgram,
	validateLocation,
	validateNews,
	validateImage,
} from '@/lib/validate'

export default function FestivalForm() {
	const [activeTab, setActiveTab] = useState<
		'basic' | 'news' | 'locations' | 'programs' | 'overview-history'
	>('basic')
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [festivalData, setFestivalData] = useState<FestivalData>({
		name: '',
		country: '',
		prefecture: '',
		city_town: '',
		representative: '',
		overview: '',
		history: '',
		start_date: new Date(),
		end_date: new Date(),
		news: [
			{ id: 0, title: '', content: '', importance: '', festival_id: 0, posted_date: new Date() },
		],
		programs: [
			{
				id: 0,
				festival_id: 0,
				name: '',
				start_time: new Date(),
				end_time: new Date(),
				description: '',
			},
		],
		locations: [
			{ id: 0, festival_id: 0, type: '', name: '', latitude: 0, longitude: 0, programs: [] },
		],
		images: [
			{
				id: 0,
				festival_id: 0,
				image_url: '',
				description: '',
				image_type: '',
				uploaded_date: '',
				header: '',
				overview: '',
				history: '',
			},
		],
	})

	const renderTabContent = () => {
		switch (activeTab) {
			case 'basic':
				return (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="festival-name" className="block text-sm font-medium text-gray-700">
								祭り または イベント名
							</label>
							<input
								id="festival-name"
								name="name"
								value={festivalData.name}
								onChange={(e) => handleInputChange(e, '')}
								placeholder="祭り または イベント名を入力"
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.name && <p className="text-red-500">{errors.name}</p>}
						</div>

						{/* ヘッダー画像のアップロード */}
						<div>
							<label htmlFor="header-image" className="block text-sm font-medium text-gray-700">
								ヘッダー画像
							</label>
							<input
								id="header-image"
								type="file"
								accept="image/*"
								onChange={(e) => handleImageUpload(e, 'header')}
								className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
							/>
							TODO:{errors.name && <p className="text-red-500">{errors.name}</p>}
							{festivalData.images?.header && (
								<img src={festivalData.images.header} alt="HeaderImage" />
							)}
						</div>

						<div>
							<label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
								イベント開始日
							</label>
							<input
								id="start_date"
								name="start_date"
								type="date"
								value={
									festivalData.start_date
										? festivalData.start_date.toISOString().substring(0, 10)
										: ''
								}
								onChange={(e) => handleInputChange(e, '')}
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.start_date && <p className="text-red-500">{errors.start_date}</p>}
						</div>

						<div>
							<label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
								イベント終了日
							</label>
							<input
								id="end_date"
								name="end_date"
								type="date"
								value={
									festivalData.end_date ? festivalData.end_date.toISOString().substring(0, 10) : ''
								}
								onChange={(e) => handleInputChange(e, '')}
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.end_date && <p className="text-red-500">{errors.end_date}</p>}
						</div>

						<div>
							<label htmlFor="country" className="block text-sm font-medium text-gray-700">
								国名
							</label>
							<input
								id="country"
								name="country"
								value={festivalData.country}
								onChange={(e) => handleInputChange(e, '')}
								placeholder="国名を入力"
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.country && <p className="text-red-500">{errors.country}</p>}
						</div>

						<div>
							<label htmlFor="prefecture" className="block text-sm font-medium text-gray-700">
								都道府県
							</label>
							<input
								id="prefecture"
								name="prefecture"
								value={festivalData.prefecture}
								onChange={(e) => handleInputChange(e, '')}
								placeholder="都道府県を入力"
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.prefecture && <p className="text-red-500">{errors.prefecture}</p>}
						</div>

						<div>
							<label htmlFor="city_town" className="block text-sm font-medium text-gray-700">
								市町村
							</label>
							<input
								id="city_town"
								name="city_town"
								value={festivalData.city_town}
								onChange={(e) => handleInputChange(e, '')}
								placeholder="市町村を入力"
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.city_town && <p className="text-red-500">{errors.city_town}</p>}
						</div>

						<div>
							<label htmlFor="representative" className="block text-sm font-medium text-gray-700">
								代表者 または 代表団体名
							</label>
							<input
								id="representative"
								name="representative"
								value={festivalData.representative || ''}
								onChange={(e) => handleInputChange(e, '')}
								placeholder="代表者名 または 代表団体名を入力"
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.representative && <p className="text-red-500">{errors.representative}</p>}
						</div>
					</div>
				)
			case 'news':
				return (
					<div className="space-y-4">
						{festivalData.news.map((news, index) => (
							<div key={index} className="p-4 pb-12 bg-gray-50 rounded-lg border">
								<label
									htmlFor={`news-title-${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									ニュースタイトル
								</label>
								<input
									id={`news-title-${index}`}
									name="title"
									value={news.title}
									onChange={(e) => handleInputChange(e, 'news', index)}
									placeholder="ニュースタイトル"
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
								{errors.title && <p className="text-red-500">{errors.title}</p>}
								<label
									htmlFor={`news-content-${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									ニュース内容
								</label>
								<textarea
									id={`news-content-${index}`}
									name="content"
									value={news.content}
									onChange={(e) => handleInputChange(e, 'news', index)}
									placeholder="ニュース内容"
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
								{errors.content && <p className="text-red-500">{errors.content}</p>}
								<div className="flex space-x-2 mt-2">
									{['重要', 'お知らせ', '一般情報'].map((level) => (
										<button
											key={level}
											type="button"
											onClick={() => handleNewsImportanceChange(index, level)}
											className={`p-2 border rounded-md ${news.importance === level ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
										>
											{level}
										</button>
									))}
								</div>
								{errors.importance && <p className="text-red-500">{errors.importance}</p>}
								<button
									type="button"
									onClick={() => handleDelete('news', index)}
									className="mt-2 text-red-600 hover:underline float-right"
								>
									削除
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => handleAdd('news')}
							className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
						>
							+ ニュースを追加
						</button>
					</div>
				)
			case 'locations':
				return (
					<div className="space-y-4">
						{festivalData.locations.map((location, index) => (
							<div key={location.id} className="p-4 pb-12 bg-gray-50 rounded-lg border">
								<label
									htmlFor={`location-content-${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									種類
								</label>
								<div className="flex space-x-2 mt-1">
									{['主要場所', '駐車場', 'ゴミ箱', 'トイレ'].map((type) => (
										<button
											key={type}
											type="button"
											onClick={() => handleLocationTypeChange(index, type)}
											className={`p-2 border rounded-md ${location.type === type ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
										>
											{type}
										</button>
									))}
								</div>
								TODO:{errors.type && <p className="text-red-500">{errors.name}</p>}
								{location.type === '主要場所' && (
									<div className="mt-2">
										<label
											htmlFor={`location-content-${index}`}
											className="block text-sm font-medium text-gray-700"
										>
											場所の名前
										</label>
										<input
											name="name"
											value={location.name}
											onChange={(e) => handleInputChange(e, 'locations', index)}
											placeholder="場所の名前を入力"
											className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
										/>
										{errors.name && <p className="text-red-500">{errors.name}</p>}
									</div>
								)}
								<label
									htmlFor={`location-content-${index}`}
									className="block text-sm font-medium text-gray-700 mt-4"
								>
									緯度
								</label>
								<input
									name="latitude"
									type="number"
									value={location.latitude}
									onChange={(e) => handleInputChange(e, 'locations', index)}
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
								{errors.latitude && <p className="text-red-500">{errors.latitude}</p>}
								<label
									htmlFor={`location-content-${index}`}
									className="block text-sm font-medium text-gray-700 mt-2"
								>
									軽度
								</label>
								<input
									name="longitude"
									type="number"
									value={location.longitude}
									onChange={(e) => handleInputChange(e, 'locations', index)}
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
								{errors.longitde && <p className="text-red-500">{errors.longitde}</p>}
								<button
									type="button"
									onClick={() => handleDelete('locations', index)}
									className="mt-2 text-red-600 hover:underline float-right"
								>
									削除
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => handleAdd('locations')}
							className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
						>
							+ 位置情報を追加
						</button>
					</div>
				)
			case 'programs':
				return (
					<div className="space-y-4">
						{festivalData.programs.map((program, index) => (
							<div key={index} className="p-4 pb-12 bg-gray-50 rounded-lg border">
								<label
									htmlFor={`program-name-${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									プログラム名
								</label>
								<input
									id={`program-name-${index}`}
									name="name"
									value={program.name}
									onChange={(e) => handleInputChange(e, 'programs', index)}
									placeholder="プログラム名"
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
								{errors.name && <p className="text-red-500">{errors.name}</p>}
								<label
									htmlFor={`program-start-time-${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									開始時間
								</label>
								<input
									id={`program-start-time-${index}`}
									name="start_time"
									type="time"
									value={new Date(program.start_time).toLocaleTimeString('ja-JP', {
										hour: '2-digit',
										minute: '2-digit',
										hour12: false,
									})}
									onChange={(e) => handleInputChange(e, 'programs', index)}
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
								{errors.start_time && <p className="text-red-500">{errors.start_time}</p>}
								<label
									htmlFor={`program-end-time-${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									終了時間
								</label>
								<input
									id={`program-end-time-${index}`}
									name="end_time"
									type="time"
									value={new Date(program.end_time).toLocaleTimeString('ja-JP', {
										hour: '2-digit',
										minute: '2-digit',
										hour12: false,
									})}
									onChange={(e) => handleInputChange(e, 'programs', index)}
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
								{errors.end_time && <p className="text-red-500">{errors.end_time}</p>}
								<label
									htmlFor={`program-location-${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									場所
								</label>
								<select
									id={`program-location-${index}`}
									name="location_id"
									value={program.location_id}
									onChange={(e) => handleInputChange(e, 'programs', index)}
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								>
									<option value="">場所を選択してください</option>
									{festivalData.locations
										.filter((location) => location.type === '主要場所')
										.map((location, idx) => (
											<option key={idx} value={idx}>
												{location.name || `主要場所 ${idx + 1}`}
											</option>
										))}
								</select>
								{errors.location_id && <p className="text-red-500">{errors.location_id}</p>}
								<label
									htmlFor={`program-description-${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									詳細説明
								</label>
								<textarea
									id={`program-description-${index}`}
									name="description"
									value={program.description || ''}
									onChange={(e) => handleInputChange(e, 'programs', index)}
									placeholder="プログラムの詳細説明"
									className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
								/>
								{errors.description && <p className="text-red-500">{errors.description}</p>}
								<button
									type="button"
									onClick={() => handleDelete('programs', index)}
									className="mt-2 text-red-600 hover:underline float-right"
								>
									削除
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => handleAdd('programs')}
							className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
						>
							+ プログラムを追加
						</button>
					</div>
				)
			case 'overview-history':
				return (
					<div className="space-y-4">
						{/* 概要画像のアップロード */}
						<div>
							<label htmlFor="overview-image" className="block text-sm font-medium text-gray-700">
								概要画像
							</label>
							<input
								id="overview-image"
								type="file"
								accept="image/*"
								onChange={(e) => handleImageUpload(e, 'overview')}
								className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
							/>
							{errors.image_url && <p className="text-red-500">{errors.name}</p>}
							{festivalData.images.overview && (
								<img
									src={festivalData.images.overview}
									alt="OverviewImage"
									className="w-32 h-32 object-cover mt-2"
								/>
							)}
						</div>

						<div>
							<label htmlFor="overview" className="block text-sm font-medium text-gray-700">
								概要
							</label>
							<textarea
								id="overview"
								name="overview"
								value={festivalData.overview || ''}
								onChange={(e) => handleInputChange(e, '')}
								placeholder="祭り または イベントの概要を入力"
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.overview && <p className="text-red-500">{errors.overview}</p>}
						</div>

						{/* 歴史画像のアップロード */}
						<div>
							<label htmlFor="history-image" className="block text-sm font-medium text-gray-700">
								歴史画像
							</label>
							<input
								id="history-image"
								type="file"
								accept="image/*"
								onChange={(e) => handleImageUpload(e, 'history')}
								className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
							/>
							{errors.image_url && <p className="text-red-500">{errors.name}</p>}
							{festivalData.images.history && (
								<img
									src={festivalData.images.history}
									alt="HistoryImage"
									className="w-32 h-32 object-cover mt-2"
								/>
							)}
						</div>

						<div>
							<label htmlFor="overview" className="block text-sm font-medium text-gray-700">
								歴史
							</label>
							<textarea
								id="history"
								name="history"
								value={festivalData.history || ''}
								onChange={(e) => handleInputChange(e, '')}
								placeholder="祭り または イベントの歴史を入力"
								className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							{errors.history && <p className="text-red-500">{errors.history}</p>}
						</div>
					</div>
				)
			default:
				return null
		}
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
		const files = e.target.files
		if (files) {
			const fileUrls = Array.from(files).map((file) => URL.createObjectURL(file))
			setFestivalData({
				...festivalData,
				images: festivalData.images.map((image) => {
					if (type === 'header' && image.image_type === 'header') {
						return { ...image, image_url: fileUrls[0] }
					}
					if (type === 'overview' && image.image_type === 'overview') {
						return { ...image, image_url: fileUrls[0] }
					}
					if (type === 'history' && image.image_type === 'history') {
						return { ...image, image_url: fileUrls[0] }
					}
					return image
				}),
			})
		}
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: string,
		index?: number,
	) => {
		const { name, value } = e.target

		let parsedValue: any = value

		if (name === 'start_date' || name === 'end_date' || name === 'uploaded_date') {
			parsedValue = new Date(value)
		}

		if (index !== undefined) {
			setFestivalData({
				...festivalData,
				[field]: festivalData[field as keyof FestivalData].map((item: any, i: number) =>
					i === index ? { ...item, [name]: parsedValue } : item,
				),
			})
		} else {
			setFestivalData({ ...festivalData, [name]: parsedValue })
		}
	}

	const handleAdd = (field: string) => {
		setFestivalData({
			...festivalData,
			[field]: [...festivalData[field as keyof FestivalData], {}],
		})
	}

	const handleDelete = (field: string, index: number) => {
		setFestivalData({
			...festivalData,
			[field]: festivalData[field as keyof FestivalData].filter((_: any, i: number) => i !== index),
		})
	}

	const handleLocationTypeChange = (index: number, value: string) => {
		const updatedLocations = festivalData.locations.map((location, i) => {
			if (i === index) {
				let newName = location.name
				if (value === '主要場所') {
					newName = '' // 自由に名前を付けられるように
				} else {
					const count = festivalData.locations.filter((loc) => loc.type === value).length + 1
					newName = `${value}${count}` // 自動で名前をカウント
				}
				return { ...location, type: value, name: newName }
			}
			return location
		})

		setFestivalData({
			...festivalData,
			locations: updatedLocations,
		})
	}

	const handleNewsImportanceChange = (index: number, value: string) => {
		setFestivalData({
			...festivalData,
			news: festivalData.news.map((news, i) =>
				i === index ? { ...news, importance: value } : news,
			),
		})
	}

	// フォームの送信処理
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault() // デフォルトの送信を防ぐ

		let validationResult

		// 現在のタブに基づいて、適切なバリデーションを行う
		switch (activeTab) {
			case 'basic':
				validationResult = validateFestival(festivalData)
				break
			case 'news':
				validationResult = validateNews(festivalData.news[0]) // ニュースをバリデーション
				break
			case 'locations':
				validationResult = validateLocation(festivalData.locations[0]) // 位置情報をバリデーション
				break
			case 'programs':
				validationResult = validateProgram(festivalData.programs[0]) // プログラムをバリデーション
				break
			case 'overview-history':
				validationResult = validateImage(festivalData.images[0]) // 画像をバリデーション
				break
			default:
				validationResult = { success: true } // バリデーションが必要ない場合
		}

		if (validationResult.success) {
			setErrors({}) // エラーメッセージをクリア
			await saveFestival(festivalData) // データを保存（仮）
		} else {
			// バリデーションエラーがある場合、エラーをステートに設定
			const fieldErrors: Record<string, string> = {}
			validationResult.error.errors.forEach((error: any) => {
				if (error.path[0]) {
					fieldErrors[error.path[0] as string] = error.message
				}
			})
			setErrors(fieldErrors) // エラーメッセージを更新
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
			<div className="border-b mb-6 border-gray-200">
				<nav className="-mb-px flex space-x-4">
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={() => setActiveTab('basic')}
						className={`px-3 py-2 font-medium text-sm ${activeTab === 'basic' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} border-b-2`}
					>
						基本情報
					</button>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={() => setActiveTab('news')}
						className={`px-3 py-2 font-medium text-sm ${activeTab === 'news' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} border-b-2`}
					>
						ニュース
					</button>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={() => setActiveTab('locations')}
						className={`px-3 py-2 font-medium text-sm ${activeTab === 'locations' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} border-b-2`}
					>
						位置情報
					</button>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={() => setActiveTab('programs')}
						className={`px-3 py-2 font-medium text-sm ${activeTab === 'programs' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} border-b-2`}
					>
						プログラム
					</button>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={() => setActiveTab('overview-history')}
						className={`px-3 py-2 font-medium text-sm ${activeTab === 'overview-history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} border-b-2`}
					>
						概要・歴史
					</button>
				</nav>
			</div>
			<form className="space-y-6">
				{renderTabContent()}
				<button
					type="submit"
					onClick={handleSubmit}
					className="mt-6 w-full inline-flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
				>
					保存
				</button>
			</form>
		</div>
	)
}
