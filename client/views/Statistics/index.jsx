import React from 'react'
import {Helmet} from "react-helmet"
import injectSheet from 'react-jss'
import moment from 'moment'
import { DatePicker } from 'antd'
import Chart from 'chart.js'
import {inject, observer} from "mobx-react"

import 'moment/locale/zh-cn'
const img_bg = require('../../loadding.gif')

const { MonthPicker } = DatePicker

moment.locale("zh-cn");


const styles = {
  canvasLine: {
    position: "relative",
    background: `url(${img_bg}) no-repeat center`,
    margin: "auto",
    height: "40vh",
    width: "75vw"
  },
  container: {
    width: "75vw",
    height: "50vh",
    position: "relative",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between"
  },
  canvasType: {
    width: "30vw",
    height: "50vh",
    background: `url(${img_bg}) no-repeat center`,
    position: "relative",
  },
  count: {
    width: "30vw",
    height: "50vh",
    position: "relative",
    padding: "10vh 10vw"
  },
  bg_img: {
    backgroundColor: "#111"
  },
  bg_color: {
    backgroundColor: "#fff"
  },
  wrapper: {
    width: "100%",
    height: "100%",
    textAlign: "center"
  }
}


@inject((stores) => {
  return {
    statisticState: stores.statisticState
  }
}) @observer


class Statistics extends React.Component{


  constructor() {
    super()


    this.canvasLine = React.createRef()
    this.canvasType = React.createRef()

    this.state = {
      date: moment().format("YYYY-MM"),
      chartBar: {}
    }
  }

  async componentDidMount() {

    await this.props.statisticState.fetchMonthSell()
    await this.props.statisticState.fetchTypeSell(this.state.date)



    new Chart(this.canvasLine.current,{
      type: 'line',
      data: {
        labels: Object.keys(this.props.statisticState.monthSell),
        datasets: [{
          label: '张数',
          data: Object.keys(this.props.statisticState.monthSell).map((k) => this.props.statisticState.monthSell[k]),
          backgroundColor: Object.keys(this.props.statisticState.typeSell).map((k) => `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, .2)`),
          borderColor: Object.keys(this.props.statisticState.typeSell).map((k) => `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, .5)`),
          borderWidth: 1
        }]
      },


      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          text: '最近30天每日销量展示'
        },

        elements: {
          line: {
            tension: 0 // disables bezier curves
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })


    await this.setState({
      chartBar: new Chart(this.canvasType.current,{
        type: 'horizontalBar',
        data: {
          labels: Object.keys(this.props.statisticState.typeSell),
          datasets: [{
            label: '张数',
            data: Object.keys(this.props.statisticState.typeSell).map((k) => this.props.statisticState.typeSell[k]),
            backgroundColor: Object.keys(this.props.statisticState.typeSell).map((k) => `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, .2)`),

            borderColor: Object.keys(this.props.statisticState.typeSell).map((k) => `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, .5)`),
            borderWidth: 1
          }]
        },


        options: {
          maintainAspectRatio: false,
          title: {
            display: true,
            text: '每月所有类型销量展示'
          },

          elements: {
            line: {
              tension: 0 // disables bezier curves
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
    })



  }


  render() {
    const  {classes} = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>数据统计</title>
        </Helmet>
        <div className={classes.canvasLine}>
          <canvas ref={this.canvasLine} style={{backgroundColor: "#fff"}} />
        </div>
        <div className={classes.select}>
          <MonthPicker
            value={moment(this.state.date)}
            onChange={async (date, dateString)=>{

              await this.setState({
                date: dateString
              })
              await this.props.statisticState.fetchTypeSell(this.state.date)

              await this.state.chartBar.destroy()

              await this.setState({
                chartBar: new Chart(this.canvasType.current,{
                  type: 'horizontalBar',
                  data: {
                    labels: Object.keys(this.props.statisticState.typeSell),
                    datasets: [{
                      label: '张数',
                      data: Object.keys(this.props.statisticState.typeSell).map((k) => this.props.statisticState.typeSell[k]),
                      backgroundColor: Object.keys(this.props.statisticState.typeSell).map((k) => `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, .2)`),

                      borderColor: Object.keys(this.props.statisticState.typeSell).map((k) => `rgba(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, .5)`),
                      borderWidth: 1
                    }]
                  },


                  options: {
                    maintainAspectRatio: false,
                    title: {
                      display: true,
                      text: '每月所有类型销量展示'
                    },

                    elements: {
                      line: {
                        tension: 0 // disables bezier curves
                      }
                    },
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true
                        }
                      }]
                    }
                  }
                })
              })

            }}
            placeholder="请选择月份" />
        </div>
        <div className={classes.container}>
          <div className={classes.canvasType}>
            <canvas ref={this.canvasType} style={{backgroundColor: "#fff"}} />
          </div>
          <div className={classes.count}>
            <p>本月总张数：{this.props.statisticState.allCount}</p>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(Statistics)
