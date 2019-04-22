import React from 'react'
import { hydrate, render } from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'mobx-react'
import { CookiesProvider } from "react-cookie"

import App from './views/App'
import {AppState, UserState, GoodState, SellState, BuyState, StatisticState} from './store/index'
require('./reset.css')

const initState = window.__INIT_STATE__  || {}

const createApp = ( Comp ) => (
  <Provider appState={new AppState(initState.appState)} buyState={new BuyState(initState.buyState)} statisticState={new StatisticState(initState.statisticState)} sellState={new SellState(initState.sellState)} userState={new UserState(initState.userState)} goodState={new GoodState(initState.goodState)}>
    <CookiesProvider>
      <BrowserRouter>
        <Comp />
      </BrowserRouter>
    </CookiesProvider>
  </Provider>
)


render( createApp(App), document.querySelector("#app"))
