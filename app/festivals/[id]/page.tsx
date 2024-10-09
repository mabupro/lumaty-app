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

// データの型定義
interface FestivalData {
	id: number
	name: string
	start_date: string
	end_date: string
	overview: string
	history: string
}

interface NewsData {
	id: number
	title: string
	posted_date: string
	importance: '高' | '中' | '低'
}

interface ProgramData {
	id: number
	name: string
	start_time: string
	end_time: string | null
	description: string | null
	location: { name: string } | null
}

interface LocationData {
	id: number
	type: string
	latitude: number
	longitude: number
	name: string | null
	programs: ProgramData[]
}

interface ImageData {
	id: number
	image_url: string
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
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/festival/${festivalId}`)

		const data = await response.json()

		if (response.ok) {
			festivalData = data.festival

			// festivalDataがnullでないことを確認
			if (!festivalData) {
				console.error('Festival data is null')
				return <div>Error: Festival data not found</div>
			}

			// ニュース
			const newsResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/news?festivalId=${festivalData.id}`,
			)
			const newsDataResponse = await newsResponse.json()

			// newsDataResponse.newsが配列かどうか確認
			if (Array.isArray(newsDataResponse.news)) {
				newsData = newsDataResponse.news
			} else {
				console.error('News data is not an array:', newsDataResponse.news)
				newsData = [] // 配列でない場合は空の配列にする
			}

			// プログラム
			const programResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/program?festivalId=${festivalData.id}`,
			)
			const programDataResponse = await programResponse.json()

			if (Array.isArray(programDataResponse.programs)) {
				programData = programDataResponse.programs
			} else {
				console.error('Program data is not an array:', programDataResponse.programs)
				programData = []
			}

			// マップ
			const locationResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/location?festivalId=${festivalData.id}`,
			)
			const locationDataResponse = await locationResponse.json()

			if (Array.isArray(locationDataResponse.locations)) {
				locationData = locationDataResponse.locations
			} else {
				console.error('Location data is not an array:', locationDataResponse.locations)
				locationData = []
			}

			// 画像
			const imageResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/image/${festivalData.id}`,
			)
			const imageDataResponse = await imageResponse.json()

			if (Array.isArray(imageDataResponse.image)) {
				imageData = imageDataResponse.image
			} else {
				console.error('Image data is not an array:', imageDataResponse.image)
				imageData = []
			}
		} else {
			console.error('Error fetching festival data:', data.message)
		}
	} catch (error) {
		console.error('Failed to fetch data from API:', error)
		return <div>Error loading data. Please try again later.</div>
	}

	if (festivalData) {
		const stDate = getMMDD(festivalData.start_date)
		const endDate = getMMDD(festivalData.end_date)
		const stDayOfWeek = getDayOfWeek(festivalData.start_date) // 曜日を取得
		const endDayOfWeek = getDayOfWeek(festivalData.end_date)

		const sortedProgramData = programData.sort((a, b) => {
			// start_timeをDateオブジェクトに変換
			const startA = new Date(a.start_time)
			const startB = new Date(b.start_time)
			return startA.getTime() - startB.getTime() // 昇順にソート
		})

		return (
			<>
				<Header />

				<div className="bg-teal-500 pt-20">
					<Image
						className="mx-auto mt-8 w-4/5 h-72 justify-center rounded-2xl bg-white"
						src={imageData.length > 0 ? imageData[0].image_url : ''}
						alt="Festival Image"
						width={400}
						height={200}
					/>

					<div className="mt-8 pb-1">
						{/* <div className="pb-8">
							<Subtitle subtitle={`Demo: ${festivalData.name}`} color="white" />
						</div> */}
						<Subtitle subtitle="開催期間" color="white" />
						<FestivalPeriod
							festivalId={festivalId}
							program={festivalData.name}
							stDate={stDate}
							stDayOfWeek={stDayOfWeek} // 開始日の曜日
							endDate={endDate}
							endDayOfWeek={endDayOfWeek} // 終了日の曜日
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
								endTime={program.end_time}
								locationName={program.location?.name || '場所未定'}
								description={program.description}
							/>
						))}
					</div>
				</div>

				<div className="bg-white  py-12">
					<Subtitle subtitle="会場マップ" color="black" />
					<div className="mx-auto mt-8 w-90 h-auto justify-center rounded-md bg-slate-300">
						<GoogleMap locations={locationData} />
					</div>
					{/* <div className="mt-12"> */}
					{/* TODO: urlを動的にしたい */}
					{/* <MainButton title="アクセスの詳細はコチラ" url="Suito/access" /> */}
					{/* </div> */}
				</div>

				<div className="bg-teal-500 py-12">
					<Subtitle subtitle="まつりについて" color="white" />
					{/* TODO: 必要かどうかや、名前も動的にしたい */}
					<div className="cursor-pointer">
						<Image
							className="mx-auto mt-8 w-4/5 h-48 justify-center rounded-md bg-slate-300"
							alt="祭りの概要"
							src={imageData.length > 0 ? imageData[1].image_url : ''}
							width={640}
							height={360}
						/>
						<p className="text-xl font-semibold text-center pr-36 mt-3 text-white">
							{festivalData.name}の概要
						</p>
						<div className="bg-slate-200 mx-auto my-8 w-4/5 rounded-md p-3">
							<MarkdownRenderer content={festivalData.overview} />
							{/* <p className="p-2 text-md">{festivalData.overview}</p> */}
						</div>
					</div>

					{/* TODO: 必要かどうかや、名前も動的にしたい */}
					<div className="cursor-pointer">
						<Image
							className="mx-auto mt-8 w-4/5 h-48 justify-center rounded-md bg-slate-300"
							alt="祭りの歴史"
							src={imageData.length > 0 ? imageData[2].image_url : ''}
							width={640}
							height={360}
						/>
						<p className="text-xl font-semibold text-center pr-36 mt-3 text-white">
							{festivalData.name}の歴史
						</p>
						<div className="bg-slate-200 mx-auto my-8 w-4/5 rounded-md p-3">
							<MarkdownRenderer content={festivalData.history} />
							{/* <p className="p-3 text-md">{festivalData.history}</p> */}
						</div>
					</div>
				</div>

				<div className="bg-white py-12">
					<Subtitle subtitle="NEWS" color="black" />
					<div className="mt-12">
						{newsData.slice(0, 3).map((news) => (
							<NewsButton
								key={news.id}
								id={news.id}
								festivalId={festivalId}
								importance={news.importance}
								posted_date={getYYMMDD(news.posted_date)}
								title={news.title}
							/>
						))}
					</div>
					<div className="my-12">
						<MainButton title="News一覧はコチラ" url={`${params.id}/news`} />
					</div>
				</div>
			</>
		)
	}
	return null // イベントデータがない場合はnullを返す
}
