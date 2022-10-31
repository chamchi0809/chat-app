import mongoose, { ConnectOptions } from 'mongoose'

const {MONGO_URL:CONNECTION_URL} = process.env;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser:true,
  useUnifiedTopology:true
} as ConnectOptions)

mongoose.connection.on('connected', () => {
  console.log('Mongo has connected succesfully')
})
mongoose.connection.on('reconnected', () => {
  console.log('Mongo has reconnected')
})
mongoose.connection.on('error', error => {
  console.log('Mongo connection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongo connection is disconnected')
})