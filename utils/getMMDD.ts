export default function getMMDD(dateString: string): string {
	const date = new Date(dateString)
	const day = date.getDate()
	const month = date.getMonth() + 1 // JavaScriptの月は0から始まるので1を足す
	return `${month}.${day}`
}

