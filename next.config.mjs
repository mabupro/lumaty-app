/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'jfxmblkflycymfjspbgn.supabase.co',
				port: '', // デフォルトのhttpsポートなら空にしておく
				pathname: '/storage/v1/object/public/**', // パスのパターンを指定
			},
		],
	},
}

export default nextConfig
