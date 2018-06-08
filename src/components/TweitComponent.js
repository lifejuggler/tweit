import React, { Component } from 'react'

export default class TweitComponent extends Component {
  render () {
    const {
      generatedTweet,
      regenerateTweet,
      generatedUser,
      status,
      isLoading
    } = this.props

    let newTweet = (
      <div className="generated-container">
        Please Enter a Twitter User To Mimic!
      </div>
    )

    if (status && status === 'invalid') {
      newTweet = (
        <div className="generated-container">
          Invalid Username! Please enter a valid username
        </div>
      )
    } else if (isLoading) {
      newTweet = (
        <div className="generated-container">
          Attempting to Mimic
          <i className="fa fa-spinner fa-pulse load-sign"></i>
        </div>
      )
    } else if (generatedTweet) {
      newTweet = (
        <div className="generated-container">
          <div className="user-title">
            {generatedUser}:
          </div>
          <div className='tweet-container'>
            <i className="fa fa-quote-left"></i>
            {generatedTweet}
          </div>
          <button className="custom-button" onClick={regenerateTweet}> Regenerate </button>
        </div>
      )
    }

    return (
      <div className="output-container">
        { newTweet }
      </div>
    )
  }
}