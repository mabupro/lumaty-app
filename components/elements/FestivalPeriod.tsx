// import Link from 'next/link'
// import { FiChevronRight } from 'react-icons/fi'

type Props = {
	festivalId: number
	program: string | null
	stDate: string | null
	stDayOfWeek: string | null
	endDate: string | null
	endDayOfWeek: string | null
	index: number
}

export default function EventPeriod({
	festivalId,
	program,
	stDate,
	stDayOfWeek,
	endDate,
	endDayOfWeek,
	index,
}: Props) {
	const getFontSizeClass = (text: string | null) => {
		if (!text) {
			return
		}

		if (text.length <= 8) {
			return 'text-lg'
		} else if (text.length <= 12) {
			return 'text-md'
		} else {
			return 'text-sm'
		}
	}

	return (
		<>
			{/* <Link href={`/festival/${festivalId}/venue/${index}`}> */}
				<div className="relative border-2 border-slate-200 mx-auto my-12 w-5/6 h-32 justify-center rounded-lg bg-emerald-500">
					<div className="w-60 h-10 mx-auto -my-5 bg-emerald-500">
						<p
							className={`pt-1 text-center font-semibold text-white ${getFontSizeClass(program)}`}
						>
							{program}
						</p>
					</div>
					<div className="flex justify-center pt-7">
						<p className="text-4xl sm:text-5xl font-semibold tracking-wider text-white">{stDate}</p>
						<p className="pt-5 text-lg font-semibold tracking-wider text-white">[{stDayOfWeek}]</p>
						<p className="px-2 pt-2 text-2xl font-semibold tracking-wider text-white">-</p>
						<p className="text-4xl sm:text-5xl font-semibold tracking-wider text-white">
							{endDate}
						</p>
						<p className="pt-5 text-lg font-semibold tracking-wider text-white">[{endDayOfWeek}]</p>
					</div>
					{/* <div className="absolute right-4 bottom-2">
						<FiChevronRight size={30} color="#fff" />
					</div> */}
				</div>
			{/* </Link> */}
		</>
	)
}
