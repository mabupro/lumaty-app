export default function formatTime(timeString: string): string {
	// timeString を "T" と "Z" を除いて時間部分だけ取得
	const time = timeString.slice(11, 16)

	// "HH:mm" 形式で返す
	return time
}
