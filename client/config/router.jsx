import React from 'react'
import {  Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { withCookies, Cookies } from 'react-cookie'


import Main from '../views/Main'
import Login from '../views/Login'


class MainRouter extends React.Component {

  render() {
    let loginPage = this.props.history.location.pathname.indexOf("login") === 1
    let cookies = this.props.cookies.get("koa:sess") && this.props.cookies.get("koa:sess.sig")

    return (
      <Switch>
        {
          loginPage ?(cookies ? <Redirect to="/" /> : <Route path="/login" component={Login} key="login" /> ):(cookies ? <Route path="/" component={Main} key="index" />: <Redirect to="/login"  />)
        }
      </Switch>
    )
  }
}

export default withCookies(withRouter(MainRouter))
