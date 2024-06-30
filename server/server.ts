const express = require('express')
const app = express()
const port = 3001

app.get('/testApi', (req, res) => {
  res.send('Hello whats up!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


