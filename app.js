const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.send('Bonjour à tous')
})

app.get('/courses', (req, res) => {
  res.send('Mes courses' + req.params.userId)
})

app.use((req, res) => {
  res.send(404, 'Not Found')
})

app.listen(PORT, () => {
  console.log('Serveur sur le port : ', PORT)
})