'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { FestivalForm } from '@/components/put-forms/FestivalForm'
import { ProgramForm } from '@/components/put-forms/ProgramForm'
import { LocationForm } from '@/components/put-forms/LocationForm'
import { OverviewHistoryForm } from '@/components/put-forms/OverviewHistoryForm'
import { NewsForm } from '@/components/put-forms/NewsForm'
import { ImageForm } from '@/components/put-forms/ImageForm'
import { Tabs, Tab, useMediaQuery } from '@mui/material'

const EditFormsPage = () => {
	const params = useParams<{ id: string }>()
	const id = Number(params.id)
	const [activeTab, setActiveTab] = useState(0)

	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setActiveTab(newValue)
	}

	// スマホサイズの場合にタブがスクロール可能になる
	const isMobile = useMediaQuery('(max-width:600px)')

	return (
		<div className="mx-4">
			<h1 className="p-5 font-semibold text-2xl text-gray-500">祭り・イベント情報編集 ID: {id}</h1>

			<Tabs
				value={activeTab}
				onChange={handleTabChange}
				variant={isMobile ? 'scrollable' : 'fullWidth'}
				scrollButtons={isMobile ? 'auto' : undefined}
				aria-label="編集タブ"
				sx={{ mb: 2 }}
			>
				<Tab label="基本情報" />
				<Tab label="会場マップ" />
				<Tab label="プログラム" />
				<Tab label="概要・歴史" />
				<Tab label="ニュース" />
				<Tab label="画像" />
			</Tabs>

			<div className="mt-5">
				{activeTab === 0 && <FestivalForm festivalId={id} />}
				{activeTab === 1 && <LocationForm festivalId={id} />}
				{activeTab === 2 && <ProgramForm festivalId={id} />}
				{activeTab === 3 && <OverviewHistoryForm festivalId={id} />}
				{activeTab === 4 && <NewsForm festivalId={id} />}
				{activeTab === 5 && <ImageForm festivalId={id} />}
			</div>
		</div>
	)
}

export default EditFormsPage
