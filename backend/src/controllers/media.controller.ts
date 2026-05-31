import { Request, Response } from 'express'

export const downloadImg = async (req: Request, res: Response) => {
	const { url } = req.query as { url: string }
	const filename = url.split('/').pop() ?? 'image.jpg'
	const response = await fetch(url)
	const contentType = response.headers.get('content-type') ?? 'image/jpeg'
	const buffer = await response.arrayBuffer()
	res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
	res.setHeader('Content-Type', contentType)
	res.send(Buffer.from(buffer))
}
