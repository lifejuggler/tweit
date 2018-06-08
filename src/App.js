import React, { Component } from 'react'
import { connect } from 'react-redux'
import TweitComponent from './components/TweitComponent'
import './App.css';
import { generateTweet, regenerateTweet, initializeState } from './actions'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: null
    }
    this.bound = {
      generateTweet: this.generateTweet.bind(this),
      regenerateTweet: this.regenerateTweet.bind(this),
      onUserInputChange: this.onUserInputChange.bind(this)
    }
    this.props.init()
  }

  onUserInputChange (val) {
    this.setState({username: val.target.value})
  }

  generateTweet () {
    this.props.generateTweet(this.state.username)
  }

  regenerateTweet () {
    this.props.generateTweet(this.state.username)
  }

  render() {
    const { onUserInputChange, generateTweet, regenerateTweet } = this.bound
    const { status, username, generatedTweet, isLoading } = this.props
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Tweit (You Give Us A User We Mimic!)</h1>
          <div className="input-container">
            <div className="input-title">
              Twitter UserID:
            </div>
            <input className="username-input" onChange={onUserInputChange} type="text" placeholder="Enter Username..." />
            <button className="custom-button" onClick={generateTweet}>Generate</button>
          </div>
        </header>
        <TweitComponent
          regenerateTweet={regenerateTweet}
          generatedTweet={generatedTweet}
          generatedUser={username}
          status={status}
          isLoading={isLoading}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    generatedTweet: state.tweits.generatedTweet,
    status: state.tweits.status,
    username: state.tweits.username,
    isLoading: state.tweits.isLoading
  }
}

const mapDispatchToProps =  () => {
  return (dispatch) => ({
    init: () => dispatch(initializeState()),
    generateTweet: (username) => dispatch(generateTweet(username)),
    regenerateTweet: (username) => dispatch(regenerateTweet(username))
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
