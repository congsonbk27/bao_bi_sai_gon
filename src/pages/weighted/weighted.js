import React from 'react'
import { Button, Statistic, Card, Row, Col, Icon, List, Avatar, Skeleton, Table } from 'antd';
import Layout from 'src/components/layout/layout'
import page from 'src/constants/page.const'
import scaleReader from 'src/utils/scaleReader'
import moment from 'moment'
import { getScaleInputs } from 'src/storage/scaleInput'

const columnsConfig = [
  {
    title: 'STT',
    dataIndex: 'index',
    width: '20%',
  },
  {
    title: 'Mã sản phẩm',
    dataIndex: 'time',
    render: time => typeof time == 'string' || typeof time == 'number' ? time : '',
    width: '20%',
  },
  {
    title: 'Khối lượng',
    dataIndex: 'weight',
    render: weight => weight ? `${weight} kg` : 'Không rõ',
    width: '20%',
  },
  {
    title: 'Ngày cân',
    dataIndex: 'createdAt',
    render: createdAt => createdAt ? `${moment(createdAt).format('HH:mm:SS  --- DD/MM/YYYY')}` : 'Không rõ',
    width: '20%',
  },
];

const ITEM_PER_PAGE = 1000
export default class Weighted extends React.Component {
  constructor(props) {
    super(props)

    scaleReader.registerListener(this.onNewObject)

    this.state = {
      data: [],
      pagination: {
        pageSize: ITEM_PER_PAGE,
        current: 1
      },
      loading: false,
      newestObject: null
    }
  }

  componentDidMount() {
    this.reset()
  }

  onNewObject = async (newestObject) => {
    this.state.data.unshift(newestObject)

    this.setState({
      data: this.state.data,
      newestObject
    })
  }

  reset = () => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: 1
      },
      data: [],
    })
    this.fetchDataFromDb({ page: 1, sortField: 'createdAt', sortOrder: 'ascend' })
  }

  fetchDataFromDb = async ({ page, sortField, sortOrder }) => {
    this.setState({
      loading: true
    })
    let data = {}
    try {
      data = await getScaleInputs({
        itemPerPage: ITEM_PER_PAGE,
        page,
        sortField,
        sortOrder,
        startDate: moment(),
        endDate: moment()
      })
    } catch (error) {
      console.warn('CheckupStats Oh shit fetchDataFromDb error', error)
    }
    const newState = {
      data: data && data.data && data.data.length
        ? data.data.map((d, i) => ({
          ...d, id: d.id,
          time: d.createdAt,
          weight: d.weight,
          index: ITEM_PER_PAGE * (this.state.pagination.current - 1) + i + 1
        }))
        : [],
      pagination: {
        ...this.state.pagination,
        total: data.count,
        sumAll: data.sumAll
      },
      loading: false
    }

    console.log('newState', newState);

    this.setState(newState)
  }

  render() {
    return (
      <Layout history={this.props.history} page={page.home}>
        <div style={{ background: 'white', padding: '30px' }}>
          <Row gutter={16}>
            <Col span={16} offset={4}>
              <Card>
                <Statistic
                  title="Đang cân"
                  value={this.state.newestObject ? this.state.newestObject.weight : 'Hãy đặt sản phẩm lên cân'}
                  precision={3}
                  valueStyle={{ color: '#3f8600', fontSize: '45px' }}
                  suffix={this.state.newestObject ? 'kg' : ''}
                />
              </Card>
            </Col>
          </Row>
          <br />
          <br />
          <h3>Đã cân hôm nay</h3>
          <Row gutter={16}>
            <Table
              bordered
              columns={columnsConfig}
              rowKey={record => record._id ? record._id : Math.random()}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
              rowClassName={(record, index) => (index % 2) ? 'odd' : 'even'}
            />
          </Row>
        </div>
      </Layout>
    )
  }

} // class Weighted end
