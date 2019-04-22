import {action, observable, computed} from 'mobx'
import axios from 'axios'


export default class UserState {
  constructor({userList,syncing,userInfoCount,currentPage,userInfo}={userList: [],syncing:false,userInfoCount:0,currentPage: 1,userInfo: {}}) {
    this.userList = userList
    this.userInfoCount = userInfoCount
    this.syncing = syncing
    this.currentPage = currentPage
    this.userInfo = userInfo
  }

  toJson() {
    return {
      userList: this.userList,
      syncing: this.syncing,
      userInfoCount: this.userInfoCount,
      currentPage: this.currentPage,
      userInfo: this.userInfo
    }
  }

  @observable userList
  @observable userInfoCount
  @observable syncing
  @observable currentPage
  @observable userInfo


  @action async fetchUserList( filter = "") {
    this.userList = []
    this.syncing = true
    const userRes = (await axios.get(`${process.env.API_BASE}/api/customer/info?skip=${(this.currentPage-1)*10}&filter=${filter}`)).data
    userRes.map(item=>{
      let tempObj = {}
      tempObj.key = item.id ? item.id : Math.random()
      tempObj.username = item.username ? item.username : ""
      tempObj.region = item.region ? item.region : ""
      tempObj.telephone = item.telephone ? item.telephone : ""
      this.userList.push(tempObj)
    })

    if (filter) {
      this.userInfoCount = this.userList.length
      this.userList = this.userList.slice((this.currentPage-1) * 10)
    } else {
      await this.fetchCount()
    }
    this.syncing = false
  }

  @action async changeCurrentPage(page) {
    this.currentPage = page
  }

  @action async fetchCount() {
    this.userInfoCount = (await axios.get(`${process.env.API_BASE}/api/customer/count`)).data
  }

  @action async deleteUser(id) {
    await axios.delete(`${process.env.API_BASE}/api/customer/delete?id=${id}`)
    this.fetchCount()
    this.fetchUserList()
  }

  @action async fetchUserInfo(id) {
    this.userInfo = (await axios.get(`${process.env.API_BASE}/api/customer/info?id=${id}`)).data[0]
  }

  @action changeSyncing(bool) {
    this.syncing = bool
  }

  @computed get userInfoObj() {
    let tempArr = new Array(5)
    this.userInfo.telephone.map((value,index)=>{
      tempArr[index] = value
    })
    return Object.assign({},this.userInfo,{telephone: tempArr})
  }

}
