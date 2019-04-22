import {action, observable, computed} from 'mobx'
import axios from 'axios'


export default class StatisticState {
  constructor({monthSell,asyncing,typeSell}={monthSell: {},asyncing: false,typeSell:{}}) {
    this.monthSell = monthSell
    this.typeSell = typeSell
    this.asyncing = asyncing
  }
  @observable monthSell
  @observable asyncing
  @observable typeSell


  toJson() {
    return {
      monthSell: this.monthSell,
      asyncing: this.asyncing,
      typeSell: this.typeSell
    }
  }

  @action async fetchMonthSell() {
    this.asyncing = true
    this.monthSell = (await axios.get(`${process.env.API_BASE}/api/statistic/last`)).data
    this.asyncing = false
  }

  @action async fetchTypeSell(month) {
    this.typeSell = (await axios.get(`${process.env.API_BASE}/api/statistic/everyType?month=${month}`)).data
  }

  @computed get allCount() {
    let tempArr = Object.keys(this.typeSell).map((k) => this.typeSell[k])
    let count = 0
    tempArr.map(item =>{
      count += parseFloat(item) * 100
    })

    return count/100
  }
}
