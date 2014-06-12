var enchilada = require('enchilada')
  , express = require('express')
  , path = require('path')

var app = express()

app.use('/app', enchilada({
   src: path.normalize(__dirname + '/app')
  ,transforms: ['brfs']
}))

app.use(express.static(__dirname + '/static'))


console.log("Listening on port 8000...")
app.listen(8000)

