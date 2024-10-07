// import Link from 'next/link'
import formatTime from '@/utils/formatTime'
// import { FiChevronRight } from 'react-icons/fi'

type Props = {
	programId: number
	name: string
	startTime: string
	endTime: string | null
	locationName: string | null
	description: string | null
}

export default function ProgramPeriod({
	programId,
	name,
	startTime,
	endTime,
	locationName,
}: Props) {
	// const getFontSizeClass = (text: string) => {
	// 	if (text.length <= 8) {
	// 		return 'text-lg'
	// 	} else if (text.length <= 12) {
	// 		return 'text-md'
	// 	} else {
	// 		return 'text-sm'
	// 	}
	// }

	return (
		<div className="border-2 border-gray-200 mx-auto my-3 w-5/6 rounded-lg bg-white shadow-md  cursor-pointer transition hover:opacity-80">
			<div className="px-4 py-3 bg-teal-400 rounded-t-lg">
				<p className=" text-slate-700 font-bold">{name}</p>
			</div>
			<div className="p-4">
				<div className="flex justify-between">
					<p className="text-gray-700">開始時間: {formatTime(startTime)}</p>
					<p className="text-gray-700">終了時間: {endTime ? formatTime(endTime) : '未定'}</p>
				</div>
				{locationName && <p className="mt-2 text-gray-600">場所: {locationName}</p>}
				{/* <Link href={`/program/${programId}`}>
					<div className="flex items-center justify-end">
						<FiChevronRight size={24} className="text-teal-500" />
					</div>
				</Link> */}
			</div>
		</div>
	)
}
