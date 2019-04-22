import React from 'react'
import {  Redirect, Route, Switch } from 'react-router-dom'

import Sell from '../views/Sell'
import Buy from '../views/Buy'
import UserList from '../views/User/UserList'
import UserInfo from '../views/User/UserInfo'
import AddUser from '../views/User/AddUser'
import QueryBuy from '../views/Query/QueryBuy'
import QuerySell from '../views/Query/QuerySell'
import GoodKinds from '../views/Goods/GoodKinds'
import GoodTypes from '../views/Goods/GoodTypes'
import AddType from '../views/Goods/AddType'
import TypeInfo from '../views/Goods/TypeInfo'
import KindInfo from '../views/Goods/KindInfo'
import AddKind from '../views/Goods/AddKind'
import Statistics from '../views/Statistics'



export default () => {
  return (
    <Switch>
      <Route path="/" exact render={()=><Redirect to="/sell" />} key="index"/>
      <Route path="/buy" component={Buy} key="buy"/>
      <Route path="/sell" component={Sell} key="sell"/>
      <Route path="/querysell" component={QuerySell} key="querysell"/>
      <Route path="/querybuy" component={QueryBuy} key="querybuy"/>
      <Route path="/user" exact component={UserList} key="userlist"/>
      <Route path="/user/add" component={AddUser} key="adduser"/>
      <Route path="/user/:id" component={UserInfo} key="userinfo"/>
      <Route path="/goodtypes" exact component={GoodTypes} key="goodtypes"/>
      <Route path="/goodtypes/add" component={AddType} key="addtype"/>
      <Route path="/goodtypes/:id" component={TypeInfo} key="typeinfo"/>
      <Route path="/goodkinds" exact component={GoodKinds} key="goodkinds"/>
      <Route path="/goodkinds/add" component={AddKind} key="addkind"/>
      <Route path="/goodkinds/:id" component={KindInfo} key="kindinfo"/>
      <Route path="/statistics" component={Statistics} key="statistics"/>
    </Switch>
  )
}
