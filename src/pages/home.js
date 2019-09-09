import React from 'react'
import { Button, Statistic, Card, Row, Col, Icon, List, Avatar, Skeleton } from 'antd';
import Layout from '../components/layout/layout'
import page from '../constants/page.const'
import scaleReader from '../utils/scaleReader'
import moment from 'moment'
import { createScaleInput, getScaleInputs } from '../storage/scaleInput'

export default class Home extends React.Component {
  constructor(props) {
    super(props)

    scaleReader.registerListener(this.onNewObject)

    this.state = {
      isWorking: true,
      data: [],
      newestObject: null
    }
    setTimeout(this.getHistory, 500);

  }

  getHistory = async () => {
    try {
      const data = await getScaleInputs()

      if (data && data.scaleInputs) {
        const mappedData = data.scaleInputs.map(d => ({
          id: d.id,
          time: d.createdAt,
          weight: d.weight
        }))

        this.setState({
          data: mappedData,
          isWorking: false
        })
      }
    } catch (error) {
      console.log('error loading history')
    }
  }

  onNewObject = async (newestObject) => {
    this.state.data.unshift(newestObject)

    this.setState({
      data: this.state.data,
      newestObject
    })
  }

  render() {
    const { isWorking, data } = this.state
    return (
      <Layout history={this.props.history} page={page.home}>
        <div style={{ background: '#ECECEC', padding: '30px' }}>
          <Row gutter={16}>
            <Col span={16} offset={4}>
              <Card>
                <Statistic
                  title="Đang cân"
                  value={this.state.newestObject ? this.state.newestObject.weight : 'Vui lòng bỏ sản phẩm lên cân'}
                  precision={3}
                  valueStyle={{ color: '#3f8600', fontSize: '45px' }}
                  suffix={this.state.newestObject ? 'kg' : ''}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16} offset={4}>
              <List
                className="history"
                loading={isWorking}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a key="list-loadmore-edit">edit</a>,
                    ]}
                  >
                    <Skeleton avatar title={false} loading={isWorking} active>
                      <List.Item.Meta
                        avatar={
                          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        }
                        title={<a href="https://ant.design">{`Khối lượng: ${item.weight} kg`}</a>}
                        description={`Ngày giờ: ${moment(item.time).format('DD/MM/YYYY HH:mm:SS')}`}
                      />
                      {item.id && <div>Mã: {item.id}</div>}
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>
      </Layout>
    )
  }

} // class Home end
