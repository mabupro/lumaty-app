import Link from 'next/link'
import { Lalezar } from 'next/font/google'

const LalezarFont = Lalezar({
	weight: '400',
	subsets: ['latin'],
})

export default function Home() {
	return (
		<>
			<div className="h-screen bg-emerald-500">
				<div className=" text-5xl text-center text-white pt-48">
					<p className={LalezarFont.className}>Lumaty</p>
				</div>
				<div className="grid px-20 pt-24 gap-5">
					{/* 十万石祭りリンク */}
					{/* <Link href="/festivals/1" className="btn-border">
						<span>十万石祭り</span>
					</Link> */}

					{/* 文化祭リンク */}
					<Link href="/festivals/1" className="btn-border">
						<span>文化祭</span>
					</Link>

					{/* 準備中ボタン */}
					<div className="btn-border-disabled">
						<span>準備中</span>
					</div>

					{/* 新規作成フォームリンク */}
					<Link href="/forms/new" className="btn-border">
						<span>新規作成</span>
					</Link>

					{/* 文化祭用フォームリンク */}
					<Link href="/forms/1" className="btn-border">
						<span>文化祭フォーム</span>
					</Link>
				</div>
			</div>
		</>
	)
}
