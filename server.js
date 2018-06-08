const express = require('express')
const Twitter = require('twit')
/*
  usually this would live inside the configurations of the server as
  ENV variables but for the sake of this exercise I will put the access tokens here...
  To prevent basic misusage, I have set the access token to be read only instead of read/write
*/

const app = express()
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  app_only_auth: true
})

app.use(require('cors')())
app.use(require('body-parser').json())

app.get('/api/get_tweets', (req, res) => {
  const params = { count: 200 }
  if (req.query.screen_name) {
    params.screen_name = req.query.screen_name
  }

  client
    .get(`statuses/user_timeline`, params)
    .then(timeline => {
      res.send(timeline)
    })
    .catch(error => res.send(error))
})

app.listen(5000, () => console.log('Server running'))
