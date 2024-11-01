import { z } from 'zod'
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
import {
	festivalSchema,
	newsSchema,
	programSchema,
	locationSchema,
	imageSchema,
} from '@/types/validate'
import defaultImageUrl from '@/public/images/640x360.png'

interface FestivalData {
	id?: number
	name: string
	start_date?: string | Date
	end_date?: string | Date
	overview?: string
	history?: string
}

interface NewsData {
	id?: number
	title: string
	posted_date: string
	importance: string
}

interface ProgramData {
	id?: number
	name: string
	start_time: string
	end_time?: string | null
	description?: string | null
	location?: { name: string } | null
}

interface LocationData {
	id?: number
	type: string
	latitude: number
	longitude: number
	name?: string | null
	programs?: ProgramData[]
}

interface ImageData {
	id?: number
	image_url: string
	type: string
}

export default async function Festival({ params }: { params: { id: string } }) {
	const festivalIdString = params.id
	const festivalId = Number(festivalIdString)

	let festivalData: FestivalData | null = null
	let newsData: NewsData[] = []
	let programData: ProgramData[] = []
	let locationData: LocationData[] = []
	let imageData: ImageData[] = []

	if (Number.isNaN(festivalId)) {
		console.error('Invalid festival ID:', festivalIdString)
		return <div>Error: Invalid festival ID</div>
	}

	try {
		// Fetch and validate festival data
		const festivalResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/festival/${festivalId}`,
		)
		const festivalJson = await festivalResponse.json()
		const validatedFestivalData = festivalSchema.parse(festivalJson.festival)
		festivalData = {
			...validatedFestivalData,
			start_date: validatedFestivalData.start_date
				? validatedFestivalData.start_date.toISOString()
				: '',
			end_date: validatedFestivalData.end_date ? validatedFestivalData.end_date.toISOString() : '',
		}

		// Fetch and validate news data
		const newsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${festivalId}`)
		const newsJson = await newsResponse.json()
		newsData = newsSchema
			.array()
			.parse(newsJson.news)
			.map((newsItem) => ({
				...newsItem,
				posted_date: newsItem.posted_date.toISOString(),
			}))

		// Fetch and validate program data
		const programResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/program/${festivalId}`,
		)
		const programJson = await programResponse.json()
		programData = programSchema
			.array()
			.parse(programJson.programs)
			.map((program) => ({
				...program,
				description: program.description ?? null,
			}))

		// Fetch and validate location data
		const locationResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/location/${festivalId}`,
		)
		const locationJson = await locationResponse.json()
		locationData = locationSchema
			.array()
			.parse(locationJson.locations)
			.map((location) => ({
				...location,
				programs: programData ?? [],
			}))

		// Fetch and validate image data
		const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image/${festivalId}`)
		const imageJson = await imageResponse.json()
		imageData = imageSchema
			.array()
			.parse(imageJson.images)
			.map((image) => ({
				id: image.festival_id ?? 0,
				...image,
			}))
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Validation error:', error.errors)
		} else {
			console.error('Error fetching data:', error)
		}
		return <div>Error loading data. Please try again later.</div>
	}

	if (festivalData) {
		const stDate = getMMDD(festivalData.start_date ? festivalData.start_date.toString() : '')
		const endDate = getMMDD(festivalData.end_date ? festivalData.end_date.toString() : '')
		const stDayOfWeek = getDayOfWeek(
			festivalData.start_date ? festivalData.start_date.toString() : '',
		)
		const endDayOfWeek = getDayOfWeek(festivalData.end_date ? festivalData.end_date.toString() : '')

		const sortedProgramData = programData.sort((a, b) => {
			const startA = new Date(a.start_time)
			const startB = new Date(b.start_time)
			return startA.getTime() - startB.getTime()
		})

		// タイプ別の画像取得またはデフォルト画像に設定
		const thumbnailImageUrl =
			imageData.find((image) => image.type === 'thumbnail')?.image_url || defaultImageUrl
		const overviewImageUrl =
			imageData.find((image) => image.type === 'overview')?.image_url || defaultImageUrl
		const historyImageUrl =
			imageData.find((image) => image.type === 'history')?.image_url || defaultImageUrl

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
						style={{ objectFit: 'cover' }}
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
							index={festivalData.id ?? 0}
						/>
					</div>

					<div className="pb-3">
						<div className="mb-10">
							<Subtitle subtitle="プログラム" color="white" />
						</div>
						{sortedProgramData.map((program) => (
							<ProgramPeriod
								key={program.id}
								programId={program.id ?? 0}
								name={program.name}
								startTime={program.start_time}
								endTime={program.end_time ?? null}
								locationName={program.location?.name || '場所未定'}
								description={program.description ?? null}
							/>
						))}
					</div>
				</div>

				<div className="bg-white py-12">
					<div className="mb-10">
						<Subtitle subtitle="会場マップ" color="black" />
					</div>
					{/* <GoogleMap locations={locationData} /> */}
					<GoogleMap
						locations={locationData.map((location) => ({
							...location,
							id: location.id ?? 0,
							name: location.name ?? null,
							programs: (location.programs ?? []).map((program) => ({
								...program,
								id: program.id ?? 0, // idがundefinedの場合は0を設定
							})),
						}))}
					/>
				</div>

				<div className="bg-emerald-500 py-12">
					<div className="mb-10">
						<Subtitle subtitle="まつりについて" color="white" />
					</div>
					<div className="cursor-pointer">
						<Image
							className="mx-auto mt-8 w-4/5 h-48 aspect-[16/9] justify-center rounded-md bg-gray-100"
							src={overviewImageUrl}
							alt="祭りの概要"
							width={640}
							height={360}
							style={{ objectFit: 'cover' }}
						/>
						<p className="text-xl font-semibold text-center pr-36 mt-3 text-white">
							{festivalData.name}の概要
						</p>
						<div className="bg-slate-50 mx-auto my-8 w-4/5 rounded-md p-3">
							<MarkdownRenderer content={festivalData.overview || ''} />
						</div>
					</div>

					<div className="cursor-pointer">
						<Image
							className="mx-auto mt-8 w-4/5 h-48 aspect-[16/9] justify-center rounded-md bg-gray-100"
							src={historyImageUrl}
							alt="祭りの歴史"
							width={640}
							height={360}
							style={{ objectFit: 'cover' }}
						/>
						<p className="text-xl font-semibold text-center pr-36 mt-3 text-white">
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
					{newsData.slice(0, 3).map((news) => (
						<NewsButton
							key={news.id}
							id={news.id || 0}
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
