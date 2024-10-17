import type Location from '@/types/typeLocation'
import type News from '@/types/typeNews'
import type Program from '@/types/typeProgram'
import type Image from '@/types/typeImage'

export default interface Festival {
	id: number
	name: string
	country: string
	prefecture: string
	city_town: string
	representative?: string
	overview?: string
	history?: string
	start_date?: Date
	end_date?: Date
	locations: Location[]
	news: News[]
	images: Image[]
	programs: Program[]
}
