'use client'
import { useState, useEffect } from 'react'
import { newsSchema } from '@/types/validate'

interface NewsFormProps {
	festivalId: string | number
}

const NewsForm = ({ festivalId }: NewsFormProps) => {
	const [newsList, setNewsList] = useState<
		Array<{
			id: string | number
			title: string
			content: string
			posted_date: string
			importance: string
		}>
	>([])
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		posted_date: '',
		importance: '中',
	})
	const [errors, setErrors] = useState<Record<string, any>>({}) // バリデーションエラーメッセージ用

	// フェスティバルIDに基づいてニュースを取得
	useEffect(() => {
		const fetchNews = async () => {
			try {
				const response = await fetch(`/api/news/${festivalId}`)
				if (!response.ok) {
					throw new Error('Failed to fetch news')
				}
				const data = await response.json()
				setNewsList(data.news || [])
			} catch (error) {
				console.error('Error fetching news:', error)
			}
		}
		fetchNews()
	}, [festivalId]) // festivalIdが変わるたびにニュースを取得

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// バリデーション
		const result = newsSchema.safeParse({
			title: formData.title,
			content: formData.content,
			posted_date: formData.posted_date,
			importance: formData.importance,
			festival_id: festivalId,
		})

		if (!result.success) {
			const fieldErrors = result.error.format()
			setErrors(fieldErrors)
			return
		}

		try {
			const response = await fetch('/api/news', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData, festival_id: festivalId }),
			})
			if (!response.ok) {
				throw new Error('Failed to add news')
			}
			const data = await response.json()
			setNewsList((prev) => [...prev, data]) // 新しいニュースをリストに追加
			setFormData({
				title: '',
				content: '',
				posted_date: '',
				importance: '中',
			})
			setErrors({})
		} catch (error) {
			console.error('Error adding news:', error)
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* タイトル */}
				<div>
					<label htmlFor="title" className="block text-sm font-medium mb-2">
						ニュースタイトル
					</label>
					<input
						type="text"
						id="title"
						name="title"
						placeholder="ニュースタイトル"
						value={formData.title}
						onChange={handleChange}
						className="input-field w-full p-2 border border-gray-300 rounded-md"
					/>
					{errors.title && (
						<p className="text-red-500 text-xs mt-1">{errors.title._errors.join(', ')}</p>
					)}
				</div>

				{/* 内容 */}
				<div>
					<label htmlFor="content" className="block text-sm font-medium mb-2">
						ニュース内容
					</label>
					<textarea
						id="content"
						name="content"
						placeholder="ニュース内容"
						value={formData.content}
						onChange={handleChange}
						className="input-field w-full p-2 border border-gray-300 rounded-md"
					/>
					{errors.content && (
						<p className="text-red-500 text-xs mt-1">{errors.content._errors.join(', ')}</p>
					)}
				</div>

				{/* 投稿日 */}
				<div>
					<label htmlFor="posted_date" className="block text-sm font-medium mb-2">
						投稿日
					</label>
					<input
						type="date"
						id="posted_date"
						name="posted_date"
						value={formData.posted_date}
						onChange={handleChange}
						className="input-field w-full p-2 border border-gray-300 rounded-md"
					/>
					{errors.posted_date && (
						<p className="text-red-500 text-xs mt-1">{errors.posted_date._errors.join(', ')}</p>
					)}
				</div>

				{/* 重要度 */}
				<div>
					<label htmlFor="importance" className="block text-sm font-medium mb-2">
						重要度
					</label>
					<select
						id="importance"
						name="importance"
						value={formData.importance}
						onChange={handleChange}
						className="input-field w-full p-2 border border-gray-300 rounded-md"
					>
						<option value="高">高</option>
						<option value="中">中</option>
						<option value="低">低</option>
					</select>
					{errors.importance && (
						<p className="text-red-500 text-xs mt-1">{errors.importance._errors.join(', ')}</p>
					)}
				</div>

				{/* 送信ボタン */}
				<button
					type="submit"
					className="mt-6 w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-700"
				>
					ニュースを追加
				</button>
			</form>

			<h2 className="text-xl font-semibold mt-6">登録済みのニュース</h2>
			<ul className="mt-4 space-y-2">
				{newsList.map((news) => (
					<li key={news.id}>
						{news.title} - {news.posted_date}
					</li>
				))}
			</ul>
		</div>
	)
}

export default NewsForm
