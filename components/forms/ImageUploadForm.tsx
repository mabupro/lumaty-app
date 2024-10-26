'use client'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface ImageUploadFormProps {
	festivalId: string | number
}

const ImageUploadForm = ({ festivalId }: ImageUploadFormProps) => {
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [formData, setFormData] = useState({
		description: '',
		type: 'thumbnail',
	})
	const [errors, setErrors] = useState<Record<string, any>>({})
	const [uploadedImages, setUploadedImages] = useState<
		Array<{ id: string; image_url: string; type: string }>
	>([])
	const [isUploading, setIsUploading] = useState(false)
	const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

	const thumbnailLimit = 5
	const overviewLimit = 1
	const historyLimit = 1

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch(`/api/image/${festivalId}`)
				const data = await response.json()
				setUploadedImages(data.images || [])
			} catch (error) {
				console.error('Error fetching images:', error)
			}
		}
		fetchImages()
	}, [festivalId])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setImageFiles(Array.from(e.target.files))
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsUploading(true)
		setUploadSuccess(null)

		const filteredImages = uploadedImages.filter((img) => img.type === formData.type)

		// アップロード制限のチェック
		if (formData.type === 'thumbnail' && filteredImages.length >= thumbnailLimit) {
			setUploadSuccess('サムネイルは5枚までしか登録できません。')
			setIsUploading(false)
			return
		}
		if (formData.type === 'overview' && filteredImages.length >= overviewLimit) {
			setUploadSuccess('概要は1枚までしか登録できません。')
			setIsUploading(false)
			return
		}
		if (formData.type === 'history' && filteredImages.length >= historyLimit) {
			setUploadSuccess('歴史は1枚までしか登録できません。')
			setIsUploading(false)
			return
		}

		// ファイルが選択されているか確認
		if (imageFiles.length === 0) {
			setErrors({ file: { _errors: ['画像ファイルを選択してください'] } })
			setIsUploading(false)
			return
		}

		try {
			// ファイル名にUUIDを使用
			const file = imageFiles[0]
			const fileExtension = file.name.split('.').pop() // ファイル拡張子を取得
			const uniqueFileName = `${uuidv4()}.${fileExtension}` // 一意のファイル名を生成

			const formDataToSubmit = new FormData()
			formDataToSubmit.append('file', file)
			formDataToSubmit.append('file_name', uniqueFileName)
			formDataToSubmit.append('festival_id', festivalId.toString())
			formDataToSubmit.append('type', formData.type)
			formDataToSubmit.append('description', formData.description)
			formDataToSubmit.append('uploaded_date', new Date().toISOString())

			// サーバーにリクエスト送信
			const response = await fetch('/api/image', {
				method: 'POST',
				body: formDataToSubmit,
			})

			if (!response.ok) {
				const errorResponse = await response.json()
				console.error('サーバーからのエラー:', errorResponse)
				throw new Error('画像データのアップロードに失敗しました')
			}

			setUploadSuccess('画像のアップロードに成功しました')
			setUploadedImages((prev) => [
				...prev,
				{ id: response.url, image_url: URL.createObjectURL(file), type: formData.type },
			])
			setImageFiles([])
			setFormData({
				description: '',
				type: 'thumbnail',
			})
		} catch (error) {
			console.error('画像アップロード中のエラー:', error)
			setUploadSuccess('画像のアップロードに失敗しました')
		} finally {
			setIsUploading(false)
		}
	}

	const handleDelete = async (imageId: string) => {
		try {
			const response = await fetch(`/api/image/${imageId}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				setUploadedImages((prev) => prev.filter((img) => img.id !== imageId))
				setUploadSuccess('画像を削除しました。')
			} else {
				throw new Error('画像削除に失敗しました。')
			}
		} catch (error) {
			console.error('画像削除中のエラー:', error)
			setUploadSuccess('画像削除に失敗しました。')
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
			<form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
				{/* ファイル選択 */}
				<div>
					<label htmlFor="file" className="block text-sm font-medium mb-2">
						画像を選択
					</label>
					<input
						type="file"
						name="file"
						onChange={handleFileChange}
						className="file-input w-full text-sm border border-gray-300 p-2 rounded-md"
					/>
				</div>

				{/* タイプ選択 */}
				<div>
					<label htmlFor="type" className="block text-sm font-medium mb-2">
						画像タイプ
					</label>
					<select
						name="type"
						value={formData.type}
						onChange={handleChange}
						className="input-field w-full p-2 border border-gray-300 rounded-md"
					>
						<option value="thumbnail">サムネイル</option>
						<option value="overview">概要</option>
						<option value="history">歴史</option>
					</select>
					{errors.type && (
						<p className="text-red-500 text-xs mt-1">{errors.type._errors.join(', ')}</p>
					)}
				</div>

				{/* 画像の説明 */}
				<div>
					<label htmlFor="description" className="block text-sm font-medium mb-2">
						画像の説明
					</label>
					<input
						type="text"
						name="description"
						placeholder="画像の説明"
						value={formData.description}
						onChange={handleChange}
						className="input-field w-full p-2 border border-gray-300 rounded-md"
					/>
					{errors.description && (
						<p className="text-red-500 text-xs mt-1">{errors.description._errors.join(', ')}</p>
					)}
				</div>

				{/* 送信ボタン */}
				<button
					type="submit"
					className={`mt-6 w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-700 ${isUploading ? 'opacity-50' : ''}`}
					disabled={isUploading}
				>
					{isUploading ? 'アップロード中...' : '画像をアップロード'}
				</button>
			</form>

			{/* アップロード成功/失敗メッセージ */}
			{uploadSuccess && <p className="mt-4 text-center text-lg">{uploadSuccess}</p>}

			{/* アップロード済みの画像表示 */}
			<h2 className="text-xl font-semibold mt-8">登録済みの画像</h2>
			{uploadedImages.length === 0 ? (
				<p>登録されている画像がありません。</p>
			) : (
				<ul className="mt-4 space-y-2">
					{uploadedImages.map((image) => (
						<li key={`${image.id}-${image.image_url}`} className="border-b pb-2">
							<img src={image.image_url} alt={image.type} className="w-24 h-24 object-cover mb-2" />
							<span className="text-sm">{image.type}</span>
							<button
								onClick={() => handleDelete(image.id)}
								className="text-red-500 text-sm hover:underline"
							>
								削除
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default ImageUploadForm
