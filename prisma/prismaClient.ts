import { PrismaClient } from '@prisma/client'

// PrismaClient をグローバル変数として管理
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
	// 本番環境では新しいインスタンスを生成
	prisma = new PrismaClient()
} else {
	// 開発環境ではグローバル変数に PrismaClient を保存
	if (!global.prisma) {
		global.prisma = new PrismaClient()
	}
	prisma = global.prisma
}

export default prisma
