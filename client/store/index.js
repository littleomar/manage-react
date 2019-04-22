import AppState from './app-state'
import UserState from './user'
import GoodState from './goods'
import SellState from './sell'
import BuyState from './buy'
import StatisticState from './statistic'

export {
  AppState,
  UserState,
  GoodState,
  SellState,
  BuyState,
  StatisticState
}

export default {
  AppState,
  UserState,
  GoodState,
  SellState,
  BuyState,
  StatisticState
}


export const createStoreMap = () => {
  return {
    appState: new AppState(),
    userState: new UserState(),
    goodState: new GoodState(),
    sellState: new SellState(),
    buyState: new BuyState(),
    statisticState: new StatisticState()
  }
}
