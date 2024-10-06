'use client'
import Header from '@/components/layouts/Header'
import Subtitle from '@/components/elements/Subtitle'
import NewsButton from '@/components/elements/NewsButton'
import Link from 'next/link'
import { FiChevronLeft } from 'react-icons/fi'
import { useEffect, useState } from 'react'

interface NewsData {
	id: number
	title: string
	posted_date: string
	importance: '高' | '中' | '低'
}

export default function NewsListPage({ params }: { params: { id: string } }) {
	const festivalId = Number(params.id)
	const [newsData, setNewsData] = useState<NewsData[]>([])

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const response = await fetch(`https://lumaty-app.vercel.app/api/news?festivalId=${festivalId}`)
				const data = await response.json()
				if (Array.isArray(data.news)) {
					setNewsData(data.news)
				} else {
					console.error('News data is not an array:', data.news)
				}
			} catch (error) {
				console.error('Failed to fetch news:', error)
			}
		}

		fetchNews()
	}, [festivalId])

	return (
		<>
			<div className="p-10">
				<Header />
			</div>
			<div className="bg-white py-12">
				{/* Back Button */}
				<div className="px-10">
					<Link href={`/festivals/${festivalId}`} className="flex">
						<FiChevronLeft size={30} color="#666" />
						<p className="text-lg font-semibold text-[#666]">戻る</p>
					</Link>
				</div>
				<Subtitle subtitle="News一覧" color="black" />
				<div className="mt-12">
					{newsData.map((news) => (
						<NewsButton
							key={news.id}
							festivalId={festivalId}
							importance={news.importance}
							posted_date={new Date(news.posted_date).toLocaleDateString()} // Format the date
							title={news.title}
							id={news.id}
						/>
					))}
				</div>
			</div>
		</>
	)
}
