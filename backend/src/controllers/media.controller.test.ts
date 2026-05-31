import request from 'supertest'
import app from '../app'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../middleware/auth', () => ({
	default: vi.fn((req, res, next) => next()),
}))

const mockArrayBuffer = new ArrayBuffer(8)

global.fetch = vi.fn()

describe('GET /api/download', () => {
	beforeEach(() => vi.clearAllMocks())

	it('should return 200 with file buffer and correct headers', async () => {
		vi.mocked(global.fetch).mockResolvedValue({
			headers: {
				get: vi.fn((header: string) => (header === 'content-type' ? 'image/jpeg' : null)),
			},
			arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer),
		} as unknown as Response)

		const response = await request(app).get('/api/download?url=https://example.com/dashboard.jpg')

		expect(response.status).toBe(200)
		expect(response.headers['content-type']).toContain('image/jpeg')
		expect(response.headers['content-disposition']).toBe('attachment; filename="dashboard.jpg"')
	})

	it('should use filename from url', async () => {
		vi.mocked(global.fetch).mockResolvedValue({
			headers: {
				get: vi.fn(() => 'image/png'),
			},
			arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer),
		} as unknown as Response)

		const response = await request(app).get('/api/download?url=https://example.com/photo.png')

		expect(response.headers['content-disposition']).toBe('attachment; filename="photo.png"')
	})

	it('should return empty filename when url ends with slash', async () => {
		vi.mocked(global.fetch).mockResolvedValue({
			headers: {
				get: vi.fn(() => 'image/jpeg'),
			},
			arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer),
		} as unknown as Response)

		const response = await request(app).get('/api/download?url=https://example.com/')

		expect(response.headers['content-disposition']).toBe('attachment; filename=""')
	})

	it('should fall back to image/jpeg content-type when header is missing', async () => {
		vi.mocked(global.fetch).mockResolvedValue({
			headers: {
				get: vi.fn(() => null),
			},
			arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer),
		} as unknown as Response)

		const response = await request(app).get('/api/download?url=https://example.com/file.jpg')

		expect(response.headers['content-type']).toContain('image/jpeg')
	})

	it('should call fetch with the provided url', async () => {
		vi.mocked(global.fetch).mockResolvedValue({
			headers: {
				get: vi.fn(() => 'image/jpeg'),
			},
			arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer),
		} as unknown as Response)

		await request(app).get(
			'/api/download?url=https://www.racv.com.au/royalauto/transport/cars/what-do-the-car-dashboard-symbols-mean-and-warning-lights/_jcr_content/root/container/articlepagecontent/image.coreimg.jpeg/1745367448392/1400x600-car-dashboard-lights-gettyimages-519216518.jpeg',
		)

		expect(global.fetch).toHaveBeenCalledWith(
			'https://www.racv.com.au/royalauto/transport/cars/what-do-the-car-dashboard-symbols-mean-and-warning-lights/_jcr_content/root/container/articlepagecontent/image.coreimg.jpeg/1745367448392/1400x600-car-dashboard-lights-gettyimages-519216518.jpeg',
		)
	})
})
