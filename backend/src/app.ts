import express from 'express'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
	res.status(200).send('ok')
})

app.listen(3000, () => {
	console.log('Server running on port 3000')
})
