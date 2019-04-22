import {action, observable, computed} from 'mobx'
import axios from 'axios'


export default class BuyState {
  constructor({currentPage,buyList,syncing,totalCount,filter}={currentPage: 1,buyList: [],syncing: false,totalCount:0,filter:{}}) {
    this.currentPage = currentPage
    this.buyList = buyList
    this.syncing = syncing
    this.totalCount = totalCount
    this.filter = filter
  }
  @observable buyList
  @observable currentPage
  @observable syncing
  @observable totalCount
  @observable filter

  toJson() {
    return {
      buyList: this.buyList,
      currentPage: this.currentPage,
      syncing: this.syncing,
      totalCount: this.totalCount,
      filter: this.filter
    }
  }

  @action async fetchBuyList() {
    this.syncing = true
    this.buyList =  (await axios.get(`${process.env.API_BASE}/api/goods/buy/query?skip=${(this.currentPage-1)*10}&order=id DESC&filter=${JSON.stringify(this.filter)}`)).data.goodArr
    this.syncing = false
  }

  @action async fetchTotalCount() {

    this.totalCount =  (await axios.get(`${process.env.API_BASE}/api/goods/buy/query?total=1&filter=${JSON.stringify(this.filter)}`)).data

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

  @computed get getBuyList() {
    this.buyList.map(buy=>{
      buy.key = Math.random()
    })
    return this.buyList
  }
}
