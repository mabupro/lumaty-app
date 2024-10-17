import type Location from '@/types/typeLocation'

export default interface Program {
	id: number
	festival_id: number
	name: string
	location_id?: number
	location?: Location
	start_time: Date
	end_time?: Date
	description?: string
}
