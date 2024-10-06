import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

type Props = {
	festivalId: number
	id: number
	title: string
	posted_date: string
	importance: '高' | '中' | '低'
}

export default function NewsButton({ festivalId, id, title, posted_date, importance }: Props) {
	return (
		<Link href={`/festivals/${festivalId}/news/${id}`}>
			<div className="cursor-pointer mx-10 mt-6 bg-slate-50 rounded-md">
				<div className="flex gap-4">
					<div className={`${importance === '高' ? 'bg-red-400' : 'bg-amber-300'} w-28 rounded-sm`}>
						<p className="text-white font-semibold text-center">
							{importance === '高' ? '重要' : 'お知らせ'}
						</p>
					</div>
					<p className="font-bold tracking-wider text-gray-400">{posted_date}</p>
				</div>
				<div className="px-2 mt-2 flex">
					<p className="font-bold tracking-wider mx-2 text-2xl text-gray-700">{title}</p>
					<div className="ml-auto pt-7 mb-2">
						<FiChevronRight size={30} color="" />
					</div>
				</div>
			</div>
		</Link>
	)
}
