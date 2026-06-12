import { Server } from 'socket.io'

export let io: Server

export const initSocket = (httpServer: import('http').Server) => {
	io = new Server(httpServer, {
		cors: {
			origin: [process.env.FRONTEND_URL ?? 'http://localhost:5173'],
			credentials: true,
		},
	})

	io.on('connection', socket => {
		socket.on('join', (socketId: string) => {
			socket.join(socketId)
		})
	})

	return io
}
