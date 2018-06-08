//
// Creates dictionary of words with options
// Input: tweets ['tweet1', 'tweet2', ...]
// output: [{key:..., opts}, {key:..., opts}]
// opts = { key: word, startable: bool, endable: bool, wordPool: []}
//
function seedFromStream (tweets) {
  const tokenized = tokenizer(tweets)
  let results = []
  for (let tweet of tokenized) {
    tweet.forEach((token, index) => {
      token = token.trim().replace(/['"]+/g, '')
      const endFlag = ['. ', '? ', '! ']
      const canEnd = endFlag.includes(token[token.length - 1]) || !tweet[index + 1]
      let curToken = results.find(r => r.key === token) || { key: token, wordPool: [] }

      if (!curToken.endable && canEnd) {
        curToken.endable = true
      }

      if (index < (tweet.length - 1)) {
        curToken.wordPool.push(tweet[index + 1])
      }

      curToken.startable = curToken.startable || index === 0 ? true : false
      results.push(curToken)
    })
  }
  return results
}

//
// Build Tweets based on dictionary of words
// Input: wordPool [ word(1), word(2), ...], availableWords [{key:..., opts}, {key:..., opts}]
// output: randomWord (string)
//
function markovChainGenerator (wordPool, availableWords) {
  let choice = Math.random() * wordPool.length
  let chosenWord = wordPool[Math.floor(choice)]
  if (!chosenWord.key) {
    chosenWord = availableWords.find(el => el.key === chosenWord)
  }

  return chosenWord
}

//
// Build Tweets based on dictionary of words
// Input: available words [{key:..., opts}, {key:..., opts}]
// output: generated tweet (string)
//
function generateNewTweet (availableWords) {
  let newTweet = ''
  let curWordPool = availableWords.filter(el => el.startable) // starting words

  while (curWordPool && curWordPool.length > 0) {
    let curWord = markovChainGenerator(curWordPool, availableWords)

    if (curWord && curWord.key) {
      newTweet += curWord.key
      if (curWord.endable || newTweet.length >= 280) {
        curWordPool = null
      } else if (curWord.wordPool) {
        curWordPool = curWord.wordPool
        newTweet += ' '
      }
    } else {
      curWordPool = null
    }
  }

  return newTweet
}

//
// Breaks tweet into array of words
// This is a *dumb* generic tokenizer take it with a grain of salt
// Input: tweet []
// output: result []
//
function tokenizer (tweets) {
  if (!tweets) {
    return []
  }
  return tweets.reduce((result, tweet) => {
    result.push(tweet.text.split(/[;, ]+/g))

    return result
  }, [])
}

//
// Retrieve tweets from twitter.com with given username
// input: username (string)
// output: tweets []
//
async function retrieveLatestTweets(username) {
  const response = await fetch(`/api/get_tweets?screen_name=${username}`)
  const body = await response.json()

  if (response.status !== 200) throw Error(body.data.error)
  return body
}

//
// generates tweet based on userName with option to use cached diction of words if exist and
// based on provided user
//
export function generateTweet (username, cached = null) {
  return async (dispatch) => {
    let availableWords

    dispatch({
      type: 'tweet/loading'
    })

    if (cached && cached.user === username) {
      availableWords = cached
    } else {
      let tweets = await retrieveLatestTweets(username)

      if (tweets.data.error) {
        dispatch({
          type: 'tweet/user-invalid'
        })
        return
      } else if (tweets.data.length === 0) {
        dispatch({
          type: 'tweet/user-none'
        })
        return
      } else {
        dispatch({
          type: 'user/update',
          payload: username
        })
        availableWords = seedFromStream(tweets.data)
        dispatch({
          type: 'tweet/cacheList',
          payload: {
            list: availableWords,
            user: username
          }
        })
      }
    }
    const result = generateNewTweet(availableWords)
    dispatch({
      type: 'tweet/generated',
      payload: result
    })

    return
  }
}

//
// Regenerates tweet using generated list from the initial query
//
export function regenerateTweet (cached) {
  return (dispatch) => {
    const result = generateNewTweet(cached)
    dispatch({
      type: 'tweet/generated',
      payload: result
    })

    return
  }
}

//
// Initializes blank state
//
export function initializeState () {
  return (dispatch) => {
    dispatch({
      type: 'tweets/initialize'
    })
  }
}