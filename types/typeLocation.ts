import type Program from '@/types/typeProgram'

export default interface Location {
	id: number
	festival_id: number
	type: string
	name?: string
	latitude: number
	longitude: number
	programs: Program[]
}
