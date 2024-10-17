export default interface Image {
	id: number
	festival_id: number
	image_url: string
	description?: string
	uploaded_date: Date
	image_type: string
	header?: string
	overview?: string
	history?: string
}
