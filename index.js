const connectToMongo = require('./db');
const express = require('express')

connectToMongo();
const app = express()
const port = process.env.PORT || 5000


//middleware
app.use(express.json())

//routes
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/note/', require('./routes/note'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})