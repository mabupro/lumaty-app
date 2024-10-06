'use client'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import formatTime from '@/utils/formatTime'

const INITIALIZE_LAT = 35.68238
const INITIALIZE_LNG = 139.76556
const INITIALIZE_ZOOM = 15
const INITIALIZE_MAP_WIDTH = '100%'
const INITIALIZE_MAP_HEIGHT = '400px'

interface Location {
	id: number
	type: string | null
	name: string | null
	latitude: number
	longitude: number
	programs: Program[] | null
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
	const [activeButton, setActiveButton] = useState<string>('')

	const generateInfoWindowContent = (location: Location) => {
		const programsList = location.programs
			.map(
				(program) => `
            <li>
                <strong>${program.name}</strong><br />
                開始時間: ${formatTime(program.start_time)}<br />
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
				} else {
					marker.addListener('click', () => {
						map.setCenter({ lat: location.latitude, lng: location.longitude })

						window.open(
							`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`,
							'_blank',
						)
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
		// Google Maps API script loading function
		const loadGoogleMapsScript = () => {
			const script = document.createElement('script')
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
			script.async = true
			script.defer = true
			script.onload = initializeMap
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

	// Check if locations of a specific type exist
	const hasLocationsOfType = (type: string) => locations.some((location) => location.type === type)

	return (
		<>
			<div>
				<div ref={mapRef} style={{ width: INITIALIZE_MAP_WIDTH, height: INITIALIZE_MAP_HEIGHT }} />
			</div>
			<div className="flex gap-3 p-4 bg-teal-400">
				{hasLocationsOfType('主要場所') && (
					<button
						className={`mx-auto w-20 h-20 rounded-md shadow-md ${activeButton === '主要場所' ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}
						onClick={() => addMarkers('主要場所')}
					>
						会場
					</button>
				)}
				{hasLocationsOfType('駐車場') && (
					<button
						className={`mx-auto w-20 h-20 rounded-md shadow-md ${activeButton === '駐車場' ? 'bg-blue-400 text-white' : 'bg-slate-200'}`}
						onClick={() => addMarkers('駐車場')}
					>
						駐車場
					</button>
				)}
				{hasLocationsOfType('トイレ') && (
					<button
						className={`mx-auto w-20 h-20 rounded-md shadow-md ${activeButton === 'トイレ' ? 'bg-blue-400 text-white' : 'bg-slate-200'}`}
						onClick={() => addMarkers('トイレ')}
					>
						トイレ
					</button>
				)}
				{hasLocationsOfType('ゴミ箱') && (
					<button
						className={`mx-auto w-20 h-20 rounded-md shadow-md ${activeButton === 'ゴミ箱' ? 'bg-blue-400 text-white' : 'bg-slate-200'}`}
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
