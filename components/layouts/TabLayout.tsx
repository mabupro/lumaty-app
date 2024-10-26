'use client'
import { useState, useEffect } from 'react'
import FestivalForm from '@/components/forms/FestivalForm'
import LocationForm from '@/components/forms/LocationForm'
import ProgramForm from '@/components/forms/ProgramForm'
import ImageUploadForm from '@/components/forms/ImageUploadForm'
import NewsForm from '@/components/forms/NewsForm'

// festivalIdに対して型を明示的に定義
interface TabLayoutProps {
	festivalId: number | undefined // newの場合はundefinedの可能性がある
}

const TabLayout = ({ festivalId }: TabLayoutProps) => {
	const [activeTab, setActiveTab] = useState<number>(1)
	const [isNewFestival, setIsNewFestival] = useState<boolean>(false)

	// festivalIdが存在するかによって新規作成か編集かを判別
	useEffect(() => {
		if (!festivalId) {
			setIsNewFestival(true) // festivalIdがなければ新規作成モード
		} else {
			setIsNewFestival(false) // festivalIdがあれば編集モード
		}
	}, [festivalId])

	const renderTabContent = () => {
		switch (activeTab) {
			case 1:
				return (
					<FestivalForm
						onSubmit={handleSubmitFestival}
						isNew={isNewFestival}
						festivalId={festivalId}
					/>
				)
			case 2:
				return <LocationForm festivalId={festivalId!} />
			case 3:
				return <ProgramForm festivalId={festivalId!} />
			case 4:
				return <ImageUploadForm festivalId={festivalId!} />
			case 5:
				return <NewsForm festivalId={festivalId!} />
			default:
				return (
					<FestivalForm
						onSubmit={handleSubmitFestival}
						isNew={isNewFestival}
						festivalId={festivalId}
					/>
				)
		}
	}

	// FestivalFormのonSubmitロジック
	const handleSubmitFestival = async (festivalData: any) => {
		if (isNewFestival) {
			// 新規作成モード
			try {
				const response = await fetch('/api/festival', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(festivalData),
				})
				if (response.ok) {
					const newFestival = await response.json()
					alert('祭り・イベントが作成されました')
				}
			} catch (error) {
				console.error('祭り・イベントの作成に失敗しました:', error)
			}
		} else {
			// 編集モード
			try {
				const response = await fetch(`/api/festival/${festivalId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(festivalData),
				})
				if (response.ok) {
					alert('祭り・イベントが更新されました')
				}
			} catch (error) {
				console.error('祭り・イベントの更新に失敗しました:', error)
			}
		}
	}

	return (
		<div className="w-full px-4">
			{/* ヘッダーに新規作成か編集かを明示 */}
			<div className="text-center py-4">
				<h1 className="text-2xl font-bold">
					{isNewFestival ? '新規祭り・イベントの作成' : '祭り・イベントの編集'}
				</h1>
			</div>

			{/* ナビゲーション部分 */}
			<div className="flex flex-col mx-auto max-w-4xl sm:flex-row justify-around bg-gray-100 p-4 shadow-lg">
				<button
					type="button"
					className={`tab-button ${activeTab === 1 ? 'active-tab' : ''}`}
					onClick={() => setActiveTab(1)}
				>
					基本情報
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === 2 ? 'active-tab' : ''}`}
					onClick={() => setActiveTab(2)}
				>
					場所情報
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === 3 ? 'active-tab' : ''}`}
					onClick={() => setActiveTab(3)}
				>
					プログラム情報
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === 4 ? 'active-tab' : ''}`}
					onClick={() => setActiveTab(4)}
				>
					画像アップロード
				</button>
				<button
					type="button"
					className={`tab-button ${activeTab === 5 ? 'active-tab' : ''}`}
					onClick={() => setActiveTab(5)}
				>
					ニュース登録
				</button>
			</div>

			{/* タブのコンテンツ部分 */}
			<div className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
				{renderTabContent()}
			</div>
		</div>
	)
}

export default TabLayout
