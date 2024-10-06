export default function getDayOfWeek(dateString: string): string {
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']
    const date = new Date(dateString)
    const dayOfWeek = date.getDay() // 0 (日曜日) から 6 (土曜日) の数値を返す
    return daysOfWeek[dayOfWeek] // 数値を対応する曜日に変換
}
