import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient()
} else {
	// 開発環境では、既に存在するインスタンスを再利用
	if (!globalForPrisma.prisma) {
		globalForPrisma.prisma = new PrismaClient()
	}
	prisma = globalForPrisma.prisma
}

export default prisma
