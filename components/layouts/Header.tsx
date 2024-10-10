import { Lalezar } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
// import HumbergerButton from '@/components/elements/HumbergerButton'

const LalezarFont = Lalezar({
	weight: '400',
	subsets: ['latin'],
})

export default function Header() {
	const festivalId = 1; // TODO:仮のfestivalId。実際には動的に取得する。
	const newsId = 2; // TODO:仮のnewsId。実際には動的に取得する。

	return (
		<div className="fixed top-0 left-0 w-full shadow-md rounded-b-lg bg-white z-50">
			<div className="flex justify-between">
				<div className="pt-4 pb-3 px-6 gap-3 flex">
					<Image
						className="h-10"
						src="/images/logo.png"
						alt="Logo"
						width={20}
						height={40}
						loading="lazy"
					/>
					<Link href={'/'}>
						<div className="text-xl py-2 text-gray-700">
							<p className={LalezarFont.className}>Lumaty</p>
						</div>
					</Link>
				</div>
				{/* <div className="my-auto mx-6 pt-1">
					<HumbergerButton />
				</div> */}
			</div>

			{/* アンケートリンクを中央に配置 */}
			<div className="flex justify-center">
				<Link href={`/festivals/${festivalId}/news/${newsId}`}>
					<div className="text-blue-700  underline cursor-pointer">
						<p>アンケートの回答はコチラ</p>
					</div>
				</Link>
			</div>
		</div>
	)
}
