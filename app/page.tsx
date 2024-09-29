import Link from 'next/link'

export default function Home() {
	return (
		<>
			<div className="h-screen bg-teal-500">
				<div className=" text-5xl text-center text-white pt-48">
					<p>Lumaty</p>
				</div>
				<div className="grid px-20 pt-24 gap-5">
					{/* 十万石祭りリンク */}
					<Link href="/" className="btn-border">
						<span>十万石祭り</span>
					</Link>
					{/* 準備中ボタン */}
					<div className="btn-border-disabled">
						<span>準備中</span>
					</div>
				</div>
			</div>
		</>
	)
}
