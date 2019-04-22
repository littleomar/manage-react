import {action, observable, computed} from 'mobx'
import axios from 'axios'


export default class SellState {
  constructor({currentPage,sellList,syncing,totalCount,filter}={currentPage: 1,sellList: [],syncing: false,totalCount:0,filter:{}}) {
    this.currentPage = currentPage
    this.sellList = sellList
    this.syncing = syncing
    this.totalCount = totalCount
    this.filter = filter
  }
  @observable sellList
  @observable currentPage
  @observable syncing
  @observable totalCount
  @observable filter

  toJson() {
    return {
      sellList: this.sellList,
      currentPage: this.currentPage,
      syncing: this.syncing,
      totalCount: this.totalCount,
      filter: this.filter
    }
  }

  @action async fetchSellList() {
    this.syncing = true
    this.sellList =  (await axios.get(`${process.env.API_BASE}/api/goods/sell/query?skip=${(this.currentPage-1)*10}&order=id DESC&filter=${JSON.stringify(this.filter)}`)).data.receiptList
    this.syncing = false
  }

  @action async fetchTotalCount() {
    this.totalCount =  (await axios.get(`${process.env.API_BASE}/api/goods/sell/query?total=1&filter=${JSON.stringify(this.filter)}`)).data

  }

  @action changePage(page) {
    this.currentPage = page
  }

  @action setFilter(filter) {
    this.filter = Object.assign({},this.filter,filter)
    for (let key in this.filter) {
      if ( !filter[key] ) delete this.filter[key]
    } 
  }

  @computed get getSellList() {
    this.sellList.map(sell=>{
      sell.key = Math.random()
      sell.goodArr.map(good=>{
        good.key = Math.random()
      })
    })
    return this.sellList
  }
}
