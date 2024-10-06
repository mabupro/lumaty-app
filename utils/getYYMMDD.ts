export default function getYYMMDD(dateString: string): string {
	const date = new Date(dateString)
	const year = date.getFullYear()
	const day = date.getDate()
	const month = date.getMonth() + 1 // JavaScriptの月は0から始まるので1を足す
	return `${year}.${month}.${day}`
}

