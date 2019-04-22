import React from 'react'
import {Helmet} from "react-helmet"
import ReactToPrint from 'react-to-print'
import injectSheet from 'react-jss'
import { Form, Input, Icon, Select, DatePicker, Button, message } from 'antd'
import moment from 'moment'
import {inject, observer} from "mobx-react"
import axios from 'axios'

const { Option } = Select
const { TextArea } = Input


const styles = {
  container: {
    margin: 20
  },
  title: {
    fontSize: 18,
    margin: "10px 0"
  },
  submit: {
    textAlign: "center",
    margin: 20
  },
  printTable: {
    width: "200.05mm",
    boxSizing: "borderBox",
    display: "block",
    padding: "0 10px",
    fontSize: "16px"
  },
  ptitle: {
    fontWeight: 700,
    textAlign: "center",
    fontSize: "20px",
    fontFamily: "'Kaiti SC', serif"
  },
  pSell: {
    fontSize: "18px",
    textAlign: "center",
    fontWeight: 500,
    fontFamily: "Microsoft Sans Serif, serif"
  },
  myInfo: {
    width: "520px",
    margin: "5px auto",
    textAlign: "center",
    fontSize: "16px"
  },
  userInfo: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px"
  },
  pItem: {
    fontSize: '14px'
  },
  pTable: {
    marginTop: "5px",
    width: "100%",
    border: "1px solid #000",
    borderCollapse: "collapse",
  },
  pth: {
    textAlign: "center",
    border: "1px solid #000",
    height: "18px",
    fontSize: "16px",
    lineHeight: "18px"
  },
  ptd: {
    textAlign: "center",
    border: "1px solid #000",
    height: "18px",
    fontSize: "16px",
    lineHeight: "18px"
  },
  totalWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around"
  },
  money: {
    padding: "0 30px"
  },
  dateWrapper: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-around",
    paddingRight: "100px"
  }

}


@inject((stores) => {
  return {
    userState: stores.userState,
    goodState: stores.goodState
  }
}) @observer

class Sell extends React.Component{
  constructor(props) {
    super(props)

    this.printTable = React.createRef()

    this.handleUserChange = this.handleUserChange.bind(this)
    this.handleUserSearch = this.handleUserSearch.bind(this)
    this.goodTypeSelected = this.goodTypeSelected.bind(this)


    this.state = {
      userInfo: {},
      userList: [],
      goodList: [],
      typeList: [],
      formData: {
        date: moment().format('YYYY-MM-DD')
      },
      timer: null,
      submitStatus: false
    }
  }

  numToStr(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
      return "数据非法";
    var unit = "千百拾亿千百拾万千百拾元", str = "";
    n = n.toString()
    unit = unit.substr(unit.length - n.length);
    for (var i=0; i < n.length; i++)
      str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
  }


  async componentDidMount() {
    await this.props.goodState.fetchGoodTypes()
    this.setState({
      typeList: this.props.goodState.goodTypes
    })
  }

  handleUserChange(index) {
    let { username,telephone, region } = this.props.userState.userList[index]
    this.setState({
      userInfo: {
        username,
        telephone: telephone,
        region
      }
    })
  }

  async handleUserSearch(value) {
    this.setState(pre => {
      return {
        userInfo: Object.assign({},pre.userInfo,{username:value})
      }
    })

    clearTimeout(this.state.timer)

    this.setState({
      timer: setTimeout( async ()=>{
        await this.props.userState.fetchUserList(value)
        this.setState({
          userList: this.props.userState.userList
        })
      },500)
    })
  }

  async goodTypeSelected(index,goodIndex) {
    await this.props.goodState.fetchGoodKinds(this.state.typeList[index].key)
    this.setState((pre)=>{
      pre.goodList[goodIndex].kindList = this.props.goodState.kindList
      pre.goodList[goodIndex].price = this.state.typeList[index].price
      return {
        goodList: pre.goodList
      }
    })

    this.setState((pre)=>{
      let { price, totalMeter, count } = pre.goodList[goodIndex]
      price = price ? price : 0
      totalMeter = totalMeter ? totalMeter : 0
      count = count ? count : 0
      pre.goodList[goodIndex].total = Math.ceil((totalMeter/2.4+count)*price)
      return {
        goodList: pre.goodList
      }
    })

    this.setState(pre=>{
      let total = 0
      pre.goodList.map(good=>{
        total += good.total
      })
      return Object.assign(pre.formData,{
        easyMoney: total,
        tradMoney: this.numToStr(total)
      })
    })
  }

  render() {
    const { classes } = this.props


    return (
      <React.Fragment>
        <Helmet>
          <title>出售开票</title>
        </Helmet>
        <div className={classes.container}>
          <div>
            <p className={classes.title}>用户信息：</p>
            <Form layout="inline">
              <Form.Item>
                <Select
                  style={{width: 160}}
                  showSearch
                  value={this.state.userInfo.username}
                  placeholder="请输入客户姓名"
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.handleUserSearch}
                  onChange={this.handleUserChange}
                  notFoundContent={null}
                >
                  {
                    this.state.userList ? this.state.userList.map((user,index)=>{
                      return <Option value={index} key={user.key}>{user.username}</Option>
                    }) : null
                  }
                </Select>
              </Form.Item>
              <Form.Item>
                <Input
                  value={this.state.userInfo.telephone}
                  onChange={(e)=>{
                    let telephone = e.target.value
                    this.setState(pre=>{
                      return Object.assign(pre.userInfo,{telephone})
                    })
                  }}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="请输入用户电话" />
              </Form.Item>
              <Form.Item>
                <Input
                  value={this.state.userInfo.region}
                  onChange={(e)=>{
                    let region = e.target.value
                    this.setState(pre=>{
                      return Object.assign(pre.userInfo,{region})
                    })
                  }}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="请输入用户地址" />
              </Form.Item>
            </Form>
          </div>
          <div>
            <p className={classes.title}>开票日期：</p>
            <DatePicker
              defaultValue={moment()}
              onChange={(date,dateString) => {
                this.setState(pre=> ({
                  formData: Object.assign(pre.formData,{date: dateString})
                }))
            }} />
          </div>
          <div>
            <p className={classes.title}>货物信息：</p>
            {
              this.state.goodList.map((good,goodIndex)=>{
                return <Form layout="inline" key={good.key}>
                  <Form.Item>
                    <Select
                      placeholder="货物类型"
                      style={{ width: 120 }}
                      onChange={(index)=>{
                        this.goodTypeSelected(index,goodIndex)
                      }}>
                      {
                        this.state.typeList.map((type,index)=>{
                          return <Option value={index} key={type.key}>{type.typeName}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Select
                      placeholder="货物种类"
                      style={{ width: 180 }}
                      onChange={(name,options)=>{
                        this.setState(pre=>{
                          pre.goodList[goodIndex].name = name
                          pre.goodList[goodIndex].fullName = options.props.children
                          return {
                            goodList: pre.goodList
                          }
                        })
                      }}>
                      {
                        this.state.goodList[goodIndex].kindList ? this.state.goodList[goodIndex].kindList.map((kind,index)=>{
                          return <Option value={kind.key} key={kind.key}>{kind.fullName}</Option>
                        }) : null
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Input
                      value={this.state.goodList[goodIndex].count}
                      style={{width: 90}}
                      onChange={async (e)=>{
                        let count = parseInt(0+e.target.value)
                        await this.setState((pre)=>{
                          pre.goodList[goodIndex].count = parseInt(count)
                          return {
                            goodList: pre.goodList
                          }
                        })

                        await this.setState((pre)=>{
                          let { price, totalMeter, count } = pre.goodList[goodIndex]
                          price = price ? price : 0
                          totalMeter = totalMeter ? totalMeter : 0
                          count = count ? count : 0
                          pre.goodList[goodIndex].total = Math.ceil((totalMeter/2.4+count)*price)
                          return {
                            goodList: pre.goodList
                          }
                        })

                        await this.setState(pre=>{
                          let total = 0
                          pre.goodList.map(good=>{
                            total += good.total
                          })
                          return Object.assign(pre.formData,{
                            easyMoney: total,
                            tradMoney: this.numToStr(total)
                          })
                        })


                      }}
                      addonAfter={<span>张</span>}
                      placeholder="张" />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      value={this.state.goodList[goodIndex].meter}
                      style={{width: 130}}
                      onChange={async (e)=>{
                        const meter = e.target.value
                        const tempArr = meter.split("+")
                        let sum = 0
                        tempArr.map(meter=>{
                          sum += parseFloat(meter)
                        })
                        await this.setState((pre)=>{
                          pre.goodList[goodIndex].meter = meter
                          pre.goodList[goodIndex].totalMeter = parseFloat(sum)
                          return {
                            goodList: pre.goodList
                          }
                        })


                        await this.setState((pre)=>{
                          let { price, totalMeter, count } = pre.goodList[goodIndex]
                          price = price ? price : 0
                          totalMeter = totalMeter ? parseFloat(totalMeter) : 0
                          count = count ? count : 0
                          pre.goodList[goodIndex].total = Math.ceil(((totalMeter/2.4)+count)*price)
                          return {
                            goodList: pre.goodList
                          }
                        })

                        await this.setState(pre=>{
                          let total = 0
                          pre.goodList.map(good=>{
                            total += good.total
                          })
                          return Object.assign(pre.formData,{
                            easyMoney: total,
                            tradMoney: this.numToStr(total)
                          })
                        })
                      }}
                      addonAfter={<span>米</span>}
                      placeholder="米" />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      value={this.state.goodList[goodIndex].price}
                      style={{width: 90}}
                      onChange={async (e)=>{
                        const price = e.target.value
                        await this.setState((pre)=>{
                          pre.goodList[goodIndex].price = price
                          return {
                            goodList: pre.goodList
                          }
                        })


                        await this.setState((pre)=>{
                          let { price, totalMeter, count } = pre.goodList[goodIndex]
                          price = price ? price : 0
                          totalMeter = totalMeter ? totalMeter : 0
                          count = count ? count : 0
                          pre.goodList[goodIndex].total = Math.ceil((totalMeter/2.4+count)*price)
                          return {
                            goodList: pre.goodList
                          }
                        })

                        await this.setState(pre=>{
                          let total = 0
                          pre.goodList.map(good=>{
                            total += good.total
                          })
                          return Object.assign(pre.formData,{
                            easyMoney: total,
                            tradMoney: this.numToStr(total)
                          })
                        })
                      }}
                      addonAfter={<span>元</span>}
                      placeholder="单价" />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      value={this.state.goodList[goodIndex].total}
                      style={{width: 130}}
                      onChange={async (e)=>{
                        const total = e.target.total
                        await this.setState((pre)=>{
                          pre.goodList[goodIndex].total = total
                          return {
                            goodList: pre.goodList
                          }
                        })


                        await this.setState(pre=>{
                          let total = 0
                          pre.goodList.map(good=>{
                            total += good.total
                          })
                          return Object.assign(pre.formData,{
                            easyMoney: total,
                            tradMoney: this.numToStr(total)
                          })
                        })
                      }}
                      addonAfter={<span>元</span>}
                      placeholder="金额" />
                  </Form.Item>
                  <Form.Item>
                    <DatePicker
                      placeholder="请选择货物日期"
                      onChange={async (date, dateString)=>{
                        this.setState(pre=>{
                          pre.goodList[goodIndex].goodTime = dateString
                          return {
                            goodList: pre.goodList
                          }
                        })
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <TextArea
                      placeholder="请填写备注信息"
                      onChange={(e)=>{
                        const comments =  e.target.value
                        this.setState(pre=>{
                          pre.goodList[goodIndex].comments =comments
                          return {
                            goodList: pre.goodList
                          }
                        })
                      }}
                      value={this.state.goodList[goodIndex].comments}
                      autosize={{ minRows: 1, maxRows: 6 }} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="danger"
                      shape="circle"
                      icon="delete"
                      onClick={()=>{
                        this.setState(pre=>{
                          pre.goodList.splice(goodIndex,1)
                          return {
                            goodList: pre.goodList
                          }
                        })
                      }}
                    />
                  </Form.Item>
                </Form>
                }
              )
            }
            <div ><Button
              type="primary"
              shape="circle"
              icon="plus"
              size="large"
              onClick={async ()=>{
                let tempArr = this.state.goodList
                tempArr.push({
                  key: Math.random()
                })
                await this.setState({
                  goodList: tempArr
                })

              }} />
            </div>
          </div>
          <div>
            <p className={classes.title}>货单备注信息:</p>
            <div>
              <TextArea
                value={this.state.formData.comments}
                onChange={(e)=>{
                  const comments = e.target.value
                  this.setState(pre=>({
                      formData: Object.assign(pre.formData,{comments})
                    }
                  ))
                }}
                style={{width: 300}}
                placeholder="请输入备注信息"
                autosize={{ minRows: 2, maxRows: 6 }} />
            </div>
          </div>
          <div className={classes.submit}>
            <Form layout="inline">
              <Form.Item>

                <ReactToPrint
                  onBeforePrint={async ()=>{
                    if ( !this.state.userInfo.username ) {
                      message.error("打印失败，请填写用户信息！")
                      return false
                    }

                    if (!this.state.formData.date) {
                      message.error("打印失败，请填写票据日期")
                      return false
                    }
                    const tempGoodList = this.state.goodList.filter((good,index)=>{
                      if(!good.name) {
                        message.error(`第${index+1}种货物缺少货物种类`)
                      }
                      return good.name
                    })

                    if (tempGoodList.length !== this.state.goodList.length) {
                      message.error(`打印失败，请完善货物信息`)
                      return false
                    }

                    this.setState({
                      submitStatus: true
                    })
                    const data = {
                      date: this.state.formData.date,
                      comments: this.state.formData.comments
                    }

                    data.user = {
                      name: this.state.userInfo.username,
                      region: this.state.userInfo.region,
                      telephone: this.state.userInfo.telephone
                    }
                    data.goods = this.state.goodList.map(good=>{
                      return {
                        name: good.name,
                        meter: good.meter,
                        totalMeter: good.totalMeter,
                        total: good.total,
                        count: good.count,
                        goodTime: good.goodTime,
                        price: good.price,
                        comments: good.comments
                      }
                    })

                    let saveRes = await axios.post(`${process.env.API_BASE}/api/goods/sell/add`,data)

                    if (saveRes.data) {
                      message.success('数据存储成功')
                      this.setState({
                        userInfo: {},
                        goodList: [],
                        formData: {
                          date: moment().format("YYYY-MM-DD")
                        }
                      })
                    } else{
                      message("服务器错误，数据存储失败")
                    }

                    this.setState({
                      submitStatus: false
                    })
                  }}
                  trigger={() => <Button
                    type="primary"
                    disabled={this.state.submitStatus}
                  >打印</Button>}


                  content={() => this.printTable.current}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="danger"
                  onClick={async ()=>{
                    await this.setState({
                      userInfo: {},
                      goodList: [],
                      formData: {
                        date: moment().format("YYYY-MM-DD")
                      }
                    })
                    message.success("表单重置成功")
                  }}
                >重置</Button>
              </Form.Item>
            </Form>
          </div>

        </div>





        <div ref={this.printTable} className={classes.printTable}>
          <h1 className={classes.ptitle}>威雅诺、金奇利，易彩丽石英石，晶益佳人造石出库单</h1>
          <div className={classes.myInfo}>
            <div className={classes.pItem}>订货电话：18049603499、13259858886&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*可定制3m以下板材</div>
          </div>
          <p className={classes.pSell}>出&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单</p>
          <div className={classes.userInfo}>
            <div>出货日期：{this.state.formData.date}</div>
            <div>客户名称：{this.state.userInfo.username}</div>
            <div>客户地址：{this.state.userInfo.region}</div>
            <div>客户电话：{this.state.userInfo.telephone}</div>
          </div>
          <table className={classes.pTable}>
            <thead>
              <tr>
                <th className={classes.pth} style={{width:"18%"}}>品名</th>
                <th className={classes.pth} style={{width:"9%"}}>张</th>
                <th className={classes.pth} style={{width:"15%"}}>米</th>
                <th className={classes.pth} style={{width:"13%"}}>单价（元）</th>
                <th className={classes.pth} style={{width:"20%"}}>批号</th>
                <th className={classes.pth} style={{width:"13%"}}>金额（元）</th>
                <th className={classes.pth} style={{width:"12%"}}>备注</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.goodList.map((good,index)=>{
                return (
                  <tr key={index}>
                    <th className={classes.pth}>{good.fullName}</th>
                    <th className={classes.pth}>{good.count||'----'}</th>
                    <th className={classes.pth}>{good.meter||'----'}</th>
                    <th className={classes.pth}>{good.price}</th>
                    <th className={classes.pth}>{good.goodTime||'----'}</th>
                    <th className={classes.pth}>{good.total}</th>
                    <th className={classes.pth}>{good.comments}</th>
                  </tr>
                )
              })
            }
              <tr className={classes.money}>
                <td className={classes.ptd} colSpan={5}>合计金额（大写）：{this.state.formData.tradMoney}</td>
                <td className={classes.ptd} colSpan={2} >￥：{this.state.formData.easyMoney}</td>
              </tr>
            </tbody>
        </table>
        <div className={classes.dateWrapper}>
          <div>板材送货人签字：</div>
          <div>欠款客户签字：</div>
        </div>
      </div>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(Sell)
