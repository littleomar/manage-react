import { observable, action } from 'mobx'


export default class AppState {
  constructor({mainIndex}={mainIndex: 1}) {
    this.mainIndex = mainIndex
  }

  @observable mainIndex

  @action changeIndex(index) {
    this.mainIndex = index
  }
  toJson() {
    return {
      mainIndex: this.mainIndex
    }
  }
}
