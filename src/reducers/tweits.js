const DEFAULT_STATE = {
  isLoading: false,
  status: null,
  cachedList: null,
  updatedAt: null,
  generatedTweet: null,
  username: null
}

const tweits = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'tweet/generated':
      return Object.assign({}, state, {
        generatedTweet: action.payload,
        isLoading: false
      })
    case 'tweet/loading':
      return Object.assign({}, state, {
        isLoading: true,
        status: null
      })
    case 'tweet/user-invalid':
      return Object.assign({}, state, {
        isLoading: false,
        status: 'invalid'
      })
    case 'user/update':
      return Object.assign({}, state, {
        username: action.payload
      })
    case 'tweet/cacheList':
      return Object.assign({}, state, {
        cachedList: {
          list: action.payload.list,
          user: action.payload.user
        }
      })
    default:
      return state
  }
}

export default tweits
