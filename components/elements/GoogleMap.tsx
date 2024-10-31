'use client'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import formatTime from '@/utils/formatTime'

// 大垣に変更
const INITIALIZE_LAT = 35.3671433
const INITIALIZE_LNG = 136.6184504
const INITIALIZE_ZOOM = 15
const INITIALIZE_MAP_WIDTH = '100%'
const INITIALIZE_MAP_HEIGHT = '400px'

interface Location {
	id: number
	type: string | null
	name: string | null
	latitude: number
	longitude: number
	programs: Program[]
}

interface Program {
	id: number
	name: string | null
	start_time: string | null
}

interface GoogleMapProps {
	locations: Location[]
}

const GoogleMap: React.FC<GoogleMapProps> = ({ locations }) => {
	const mapRef = useRef<HTMLDivElement>(null)
	const [map, setMap] = useState<google.maps.Map | null>(null)
	const [markers, setMarkers] = useState<google.maps.Marker[]>([])
	const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.Marker | null>(
		null,
	)
	const [activeButton, setActiveButton] = useState<string>('')

	const generateInfoWindowContent = (location: Location) => {
		const programsList = (location.programs || [])
			.map(
				(program) => `
				<li>
					<strong>${program.name}</strong><br />
					開始時間: ${program.start_time ? formatTime(program.start_time) : '未定'}<br />
				</li>
				<br/>
			`,
			)
			.join('')

		return `
			<div>
				<h3>${location.name || ''}</h3>
				<br/>
				<ul>
					${programsList || '<li>No Programs</li>'}
				</ul>
			</div>
		`
	}

	const clearMarkers = () => {
		// biome-ignore lint/complexity/noForEach: <explanation>
		markers.forEach((marker) => marker.setMap(null))
		setMarkers([])
	}

	const addMarkers = (locationType: string) => {
		if (map) {
			clearMarkers()
			const filteredLocations = locations.filter((location) => location.type === locationType)

			const newMarkers = filteredLocations.map((location) => {
				const marker = new google.maps.Marker({
					position: { lat: location.latitude, lng: location.longitude },
					map,
					title: location.name || '',
				})

				if (location.type === '主要場所') {
					const infoWindow = new google.maps.InfoWindow({
						content: generateInfoWindowContent(location),
					})

					marker.addListener('click', () => {
						infoWindow.open(map, marker)
					})
				}
				return marker
			})

			setMarkers(newMarkers)

			if (filteredLocations.length > 0) {
				map.setCenter({ lat: filteredLocations[0].latitude, lng: filteredLocations[0].longitude })
			}
			setActiveButton(locationType)
		}
	}

	useEffect(() => {
		const loadGoogleMapsScript = () => {
			const existingScript = document.querySelector(
				`script[src="https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}"]`,
			)
			if (existingScript) return initializeMap()

			const script = document.createElement('script')
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
			script.async = true
			script.defer = true
			script.onload = initializeMap
			script.onerror = () => console.error('Google Maps スクリプトの読み込みに失敗しました。')
			document.head.appendChild(script)
		}

		const initializeMap = () => {
			if (!mapRef.current || !window.google) return
			const initializedMap = new google.maps.Map(mapRef.current, {
				center: { lat: INITIALIZE_LAT, lng: INITIALIZE_LNG },
				zoom: INITIALIZE_ZOOM,
			})
			setMap(initializedMap)
		}

		if (window.google?.maps) {
			initializeMap()
		} else {
			loadGoogleMapsScript()
		}
	}, [])

	// リアルタイムで現在地を表示する処理
	// useEffect(() => {
	// 	if (!map) return

	// 	const successCallback = (position: GeolocationPosition) => {
	// 		const { latitude, longitude } = position.coords
	// 		const userLocation = { lat: latitude, lng: longitude }

	// 		if (currentLocationMarker) {
	// 			currentLocationMarker.setPosition(userLocation)
	// 		} else {
	// 			const marker = new google.maps.Marker({
	// 				position: userLocation,
	// 				map,
	// 				title: '現在地',
	// 				icon: {
	// 					path: google.maps.SymbolPath.CIRCLE,
	// 					scale: 8,
	// 					fillColor: '#4285F4',
	// 					fillOpacity: 1,
	// 					strokeWeight: 2,
	// 					strokeColor: '#FFFFFF',
	// 				},
	// 			})
	// 			setCurrentLocationMarker(marker)
	// 		}

	// 		map.setCenter(userLocation)
	// 	}

	// 	const errorCallback = (error: GeolocationPositionError) => {
	// 		console.error('Error getting location:', error)
	// 	}

	// 	const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
	// 		enableHighAccuracy: true,
	// 		maximumAge: 10000,
	// 		timeout: 5000,
	// 	})

	// 	return () => {
	// 		navigator.geolocation.clearWatch(watchId)
	// 	}
	// }, [map, currentLocationMarker])

	// ボタンのレンダリング
	const hasLocationsOfType = (type: string) => locations.some((location) => location.type === type)

	return (
		<>
			<div>
				<div ref={mapRef} style={{ width: INITIALIZE_MAP_WIDTH, height: INITIALIZE_MAP_HEIGHT }} />
			</div>
			<div className="flex gap-3 p-4 bg-slate-50">
				{hasLocationsOfType('主要場所') && (
					// biome-ignore lint/a11y/useButtonType: <explanation>
					<button
						className={`mx-auto w-20 h-20 rounded-md shadow-md ${activeButton === '主要場所' ? 'bg-teal-700 text-white' : 'bg-slate-200'}`}
						onClick={() => addMarkers('主要場所')}
					>
						会場
					</button>
				)}
				{hasLocationsOfType('駐車場') && (
					// biome-ignore lint/a11y/useButtonType: <explanation>
					<button
						className={`mx-auto w-20 h-20 rounded-md shadow-md ${activeButton === '駐車場' ? 'bg-teal-700 text-white' : 'bg-slate-200'}`}
						onClick={() => addMarkers('駐車場')}
					>
						駐車場
					</button>
				)}
				{hasLocationsOfType('トイレ') && (
					// biome-ignore lint/a11y/useButtonType: <explanation>
					<button
						className={`mx-auto w-20 h-20 rounded-md shadow-md ${activeButton === 'トイレ' ? 'bg-teal-700 text-white' : 'bg-slate-200'}`}
						onClick={() => addMarkers('トイレ')}
					>
						トイレ
					</button>
				)}
				{hasLocationsOfType('ゴミ箱') && (
					// biome-ignore lint/a11y/useButtonType: <explanation>
					<button
						className={`mx-auto w-20 h-20 rounded-md shadow-md ${activeButton === 'ゴミ箱' ? 'bg-teal-700 text-white' : 'bg-slate-200'}`}
						onClick={() => addMarkers('ゴミ箱')}
					>
						ゴミ箱
					</button>
				)}
			</div>
		</>
	)
}

export default GoogleMap
