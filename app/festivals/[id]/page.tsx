import Header from '@/components/layouts/Header'
import Subtitle from '@/components/elements/Subtitle'
import ProgramPeriod from '@/components/elements/ProgramPeriod'
import FestivalPeriod from '@/components/elements/FestivalPeriod'
import GoogleMap from '@/components/elements/GoogleMap'
import NewsButton from '@/components/elements/NewsButton'
import MainButton from '@/components/elements/MainButton'
import MarkdownRenderer from '@/components/layouts/MarkdownRenderer'
import Image from 'next/image'
import getMMDD from '@/utils/getMMDD'
import getYYMMDD from '@/utils/getYYMMDD'
import getDayOfWeek from '@/utils/getDayOfWeek'
import defaultImageUrl from '@/public/images/準備中2-1024x576.png'

interface FestivalData {
	id: number
	name: string
	country: string
	prefecture: string
	city_town: string
	representative?: string
	overview?: string
	history?: string
	start_date: string
	end_date: string
	locations: LocationData[]
	news: NewsData[]
	images: ImageData[]
	programs: ProgramData[]
}

interface NewsData {
	id: number
	title: string
	posted_date: string
	importance: string
	content: string
}

interface ProgramData {
	id: number
	name: string
	start_time: string
	end_time?: string | null
	description?: string | null
	location_id?: number
}

interface LocationData {
	id: number
	type: string
	latitude: number
	longitude: number
	name: string | null
	programs?: ProgramData[]
}

interface ImageData {
	id: number
	image_url: string
	type: string
	description?: string
}

export default async function Festival({ params }: { params: { id: string } }) {
	const festivalIdString = params.id
	const festivalId = Number(festivalIdString)

	let festivalData: FestivalData | null = null

	if (Number.isNaN(festivalId)) {
		return <div>Error: Invalid festival ID</div>
	}

	try {
		const festivalResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/festival/${festivalId}`,
		)
		const festivalJson = await festivalResponse.json()
		festivalData = festivalJson.festival
	} catch (error) {
		console.error('Error fetching data:', error)
		return <div>Error loading data. Please try again later.</div>
	}

	if (festivalData) {
		const stDate = getMMDD(festivalData.start_date)
		const endDate = getMMDD(festivalData.end_date)
		const stDayOfWeek = getDayOfWeek(festivalData.start_date)
		const endDayOfWeek = getDayOfWeek(festivalData.end_date)

		const sortedProgramData = festivalData.programs.sort((a, b) => {
			const startA = new Date(a.start_time)
			const startB = new Date(b.start_time)
			return startA.getTime() - startB.getTime()
		})

		const thumbnailImageUrl =
			festivalData.images.find((image) => image.type === 'thumbnail')?.image_url || defaultImageUrl
		const overviewImageUrl =
			festivalData.images.find((image) => image.type === 'overview')?.image_url || defaultImageUrl
		const historyImageUrl =
			festivalData.images.find((image) => image.type === 'history')?.image_url || defaultImageUrl

		return (
			<>
				<Header />
				<div className="bg-emerald-500 pt-20">
					<Image
						className="mx-auto mt-8 w-4/5 h-72 aspect-[1/1] justify-center rounded-2xl bg-gray-100"
						src={thumbnailImageUrl}
						alt="Festival Thumbnail"
						width={400}
						height={400}
					/>
					<div className="mt-8 pb-1">
						<div className="mb-10">
							<Subtitle subtitle="開催期間" color="white" />
						</div>
						<FestivalPeriod
							festivalId={festivalId}
							program={festivalData.name}
							stDate={stDate}
							stDayOfWeek={stDayOfWeek}
							endDate={endDate}
							endDayOfWeek={endDayOfWeek}
							index={festivalData.id}
						/>
					</div>

					<div className="pb-3">
						<div className="mb-10">
							<Subtitle subtitle="プログラム" color="white" />
						</div>
						{sortedProgramData.map((program) => (
							<ProgramPeriod
								key={program.id}
								programId={program.id}
								name={program.name}
								startTime={program.start_time}
								endTime={program.end_time ?? null}
								locationName={
									festivalData.locations.find((loc) => loc.id === program.location_id)?.name ||
									'場所未定'
								}
								description={program.description ?? null}
							/>
						))}
					</div>
				</div>

				<div className="bg-white py-12">
					<div className="mb-10">
						<Subtitle subtitle="会場マップ" color="black" />
					</div>
					<GoogleMap
						locations={festivalData.locations.map((location) => ({
							...location,
							programs: sortedProgramData.filter((program) => program.location_id === location.id),
						}))}
					/>
				</div>

				<div className="bg-emerald-500 py-12">
					<div className="mb-10">
						<Subtitle subtitle="まつりについて" color="white" />
					</div>
					<div>
						<Image
							className="mx-auto mt-8 w-4/5 h-48 aspect-[16/9] justify-center rounded-md bg-gray-100"
							src={overviewImageUrl}
							alt="祭りの概要"
							width={640}
							height={360}
						/>
						<p className="text-xl font-semibold text-center mt-3 text-white w-4/5">
							{festivalData.name}の概要
						</p>
						<div className="bg-slate-50 mx-auto my-8 w-4/5 rounded-md p-3">
							<MarkdownRenderer content={festivalData.overview || ''} />
						</div>
					</div>

					<div>
						<Image
							className="mx-auto mt-8 w-4/5 h-48 aspect-[16/9] justify-center rounded-md bg-gray-100"
							src={historyImageUrl}
							alt="祭りの歴史"
							width={640}
							height={360}
						/>
						<p className="text-xl font-semibold text-center mt-3 text-white w-4/5">
							{festivalData.name}の歴史
						</p>
						<div className="bg-slate-50 mx-auto my-8 w-4/5 rounded-md p-3">
							<MarkdownRenderer content={festivalData.history || ''} />
						</div>
					</div>
				</div>

				<div className="bg-white py-12">
					<div className="mb-10">
						<Subtitle subtitle="NEWS" color="black" />
					</div>
					{festivalData.news.slice(0, 3).map((news) => (
						<NewsButton
							key={news.id}
							id={news.id}
							festivalId={festivalId}
							importance={news.importance as '高' | '中' | '低'}
							posted_date={getYYMMDD(news.posted_date)}
							title={news.title}
						/>
					))}
					<div className="my-12">
						<MainButton title="News一覧はコチラ" url={`${params.id}/news`} />
					</div>
				</div>
			</>
		)
	}
	return null
}
