import Link from 'next/link'
import { FiChevronLeft } from 'react-icons/fi'
import Header from '@/components/layouts/Header'
import Subtitle from '@/components/elements/Subtitle'

interface NewsData {
	id: number
	title: string
	posted_date: string
	importance: '高' | '中' | '低'
	content: string
}

export default async function Page({ params }: { params: { id: string; festivalId: string } }) {
	const festivalId = Number.parseInt(params.id, 10)
	const newsId = Number.parseInt(params.festivalId, 10)

	let newsData: NewsData | null = null

	try {
		const response = await fetch(`http://localhost:3000/api/news/${festivalId}/${newsId}`)
		if (response.ok) {
			const data = await response.json()
			newsData = data.news
		} else {
			console.error('Failed to fetch news data')
		}
	} catch (error) {
		console.error('Error fetching news data:', error)
	}

	return (
		<>
			<Header />
			<div className="pt-28 px-5">
				<Link href={`/festivals/${festivalId}/news`} className="flex">
					<FiChevronLeft size={30} color="#666" />
					<p className="text-lg font-semibold text-[#666]">戻る</p>
				</Link>
			</div>
			<div className="mt-10">
				<Subtitle subtitle="NEWS" color="" />
			</div>
			{newsData && (
				<div className="mx-8 mt-16">
					<p className="text-lg font-bold text-gray-700">{newsData.title}</p>
					<div className="flex gap-6">
						<p className="text-sm text-slate-400">
							{new Date(newsData.posted_date).toLocaleDateString()}
						</p>
						<div
							className={`${newsData.importance === '高' ? 'bg-red-400' : 'bg-amber-300'} w-28 rounded-sm`}
						>
							<p className="text-white text-sm font-semibold text-center">
								{newsData.importance === '高' ? '重要' : 'お知らせ'}
							</p>
						</div>
					</div>
					<hr className="my-4 h-1 bg-slate-300 mx-auto rounded" />
					<p className="text-sm text-gray-700">{newsData.content}</p>
				</div>
			)}
		</>
	)
}
