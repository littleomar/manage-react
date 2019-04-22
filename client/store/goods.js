import {action, observable, computed} from 'mobx'
import axios from 'axios'


import getFullName from '../utils/getName'

export default class GoodState {
  constructor({goodTypes,syncing,goodKinds}={goodTypes: [],syncing: false,goodKinds: []}) {
    this.goodTypes = goodTypes
    this.goodKinds = goodKinds
    this.syncing = syncing
  }


  toJson() {
    return {
      goodtypes: this.goodTypes,
      syncing: this.syncing,
      goodKinds: this.goodKinds
    }
  }
  @observable goodTypes
  @observable syncing
  @observable goodKinds




  @action async fetchGoodTypes( id = "") {
    this.goodTypes = []
    this.syncing = true
    let goodTypesRes = (await axios.get(`${process.env.API_BASE}/api/goods/typeInfo?id=${id}`)).data
    goodTypesRes.map((goodType)=>{
      let tempObj = {
        key: goodType.id,
        typeName: goodType.typeName,
        price: goodType.price
      }
      this.goodTypes.push(tempObj)
    })
    this.syncing = false
  }

  @action async fetchGoodKinds( id ) {
    this.goodKinds = []
    this.syncing = true
    this.goodKinds = (await axios.get(`${process.env.API_BASE}/api/goods/kind/type?id=${id}`)).data
    this.syncing = false
  }

  @action async deleteType(id) {
    await axios.delete(`${process.env.API_BASE}/api/goods/deleteType?id=${id}`)
    await this.fetchGoodTypes()
  }


  @computed get kindList() {
    let tempArr = []
    this.goodKinds.map(kind=>{
      let tempKind = {}
      tempKind.key = kind.id
      tempKind.fullName = getFullName(kind.name,kind.nickname)
      tempArr.push(tempKind)
    })
    return tempArr
  }


}
