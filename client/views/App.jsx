import React from 'react'
import { hot } from 'react-hot-loader/root'
import Routes from '../config/router'
import {inject, observer} from "mobx-react"
import { withRouter } from 'react-router-dom'
import { withCookies } from 'react-cookie'




@inject((stores) => {
  return {
    appState: stores.appState
  }
}) @observer



class App extends React.Component {

  componentDidMount() {
    const jssStyles = document.querySelector("#sheets-style");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  render() {
    return <Routes />
  }
}



export default withCookies(withRouter(hot(App)))
