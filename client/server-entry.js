import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { JssProvider } from 'react-jss'
import { Provider,useStaticRendering } from "mobx-react"
import { CookiesProvider } from "react-cookie"


import { createStoreMap } from "./store";
import App from './views/App'


useStaticRendering(true)


export default (sheets,context,url,stores,generateClassName,cookies) => (
    <Provider {...stores}>
      <CookiesProvider cookies={cookies}>
        <StaticRouter context={context} location={url}>
          <JssProvider registry={sheets} generateClassName={generateClassName}>
            <App />
          </JssProvider>
        </StaticRouter>
      </CookiesProvider>
    </Provider>
)


export {createStoreMap}
