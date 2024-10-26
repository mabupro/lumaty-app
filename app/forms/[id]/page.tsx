'use client'
import TabLayout from '@/components/layouts/TabLayout'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FestivalManagement({ params }: { params: { id: number } }) {
	const festivalId = Number(params.id) // 文字列として受け取る可能性があるため明示的に変換
	const [festivalExists, setFestivalExists] = useState(false)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const checkFestivalExists = async () => {
			try {
				const response = await fetch(`/api/festival/${festivalId}`)
				const data = await response.json()

				if (response.ok) {
					setFestivalExists(true)
				} else {
					console.error('フェスティバル取得エラー:', data)
					router.push('/forms/new')
				}
			} catch (error) {
				console.error('フェスティバルの存在確認エラー:', error)
				router.push('/forms/new') // エラー発生時もリダイレクト
			} finally {
				setLoading(false)
			}
		}

		if (festivalId) {
			checkFestivalExists()
		} else {
			router.push('/forms/new') // festivalIdがない場合もリダイレクト
		}
	}, [festivalId, router])

	if (loading) {
		return <div>読み込み中...</div>
	}

	return (
		<div className="container mx-auto">
			{festivalExists && <TabLayout festivalId={festivalId} />}
		</div>
	)
}
