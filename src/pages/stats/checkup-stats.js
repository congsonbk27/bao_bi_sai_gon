import React from 'react'
import { Table, DatePicker, Button, Statistic, Card, Row, Col, Icon } from 'antd';
import moment from 'moment'
// import { getCheckupInput } from 'src/stoge'
import Layout from 'src/components/layout/layout'
import page from 'src/constants/page.const'
import { createCheckupInput, getCheckupInput } from "../../storage/checkupStoge"
const { RangePicker } = DatePicker;

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
    sorter: true,
    render: weight => weight ? `${weight} kg` : 'Không rõ',
    width: '20%',
  },
  {
    title: 'Ngày cân',
    sorter: true,
    dataIndex: 'createdAt',
    render: createdAt => createdAt ?  `${moment(createdAt).format('HH:mm:SS  --- DD/MM/YYYY') }` : 'Không rõ',
    width: '20%',
  },
];

const ITEM_PER_PAGE = 12
export default class CheckupStats extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      pagination: {
        pageSize: ITEM_PER_PAGE,
        current: 1
      },
      loading: false,
    }
  }

  componentDidMount() {
    this.reset()
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchDataFromDb({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetchDataFromDb = async ({ page, sortField, sortOrder }) => {
    this.setState({
      loading: true
    })
    let data = {}
    try {
      data = await getCheckupInput({
        itemPerPage: ITEM_PER_PAGE, page, sortField, sortOrder, startDate: this.state.startDate, endDate: this.state.endDate })  
    } catch (error) {
      console.warn('CheckupStats Oh shit fetchDataFromDb error', error)
    }
    const newState = {
      data: data && data.data && data.data.length ? data.data.map((d, i) => ({ ...d, index: ITEM_PER_PAGE * (this.state.pagination.current - 1) + i + 1 })) : [],
      pagination: {
        ...this.state.pagination,
        total: data.count,
        sumAll: data.sumAll
      },
      loading: false
    }
    console.log(newState);
    
    this.setState(newState)
  }

  onChangeEndDate = (date) => {
    if (this.state.startDate && date && date.isBefore(this.state.startDate)) {
      alert('Ngày kết thúc không hợp lệ.\n \n Ngày bắt đầu đã chọn là ' + this.state.startDate.format('DD-MM-YYYY') + '\n Ngày kết thức vừa chọn là: ' + date.format('DD-MM-YYYY'))
      return
    }
    this.setState({
      endDate: date
    })
  }

  onChangeStartDate = (date) => {
    if (this.state.endDate && date && date.isAfter(this.state.endDate)) {
      alert('Ngày bắt đầu không hợp lệ.\n \n Ngày kết thúc đã chọn là ' + this.state.endDate.format('DD-MM-YYYY') + '\n Ngày bắt đầu vừa chọn là: ' + date.format('DD-MM-YYYY'))
      return
    }
    this.setState({
      startDate: date
    })
  }

  clearDateRange = () => {
    this.setState({
      startDate: null,
      endDate: null,
      showClearDateRangeButton: false
    }, this.reset)
  }

  applyDateRange = () => {
    if (this.state.startDate && this.state.endDate) {
      this.reset()
      this.setState({
        showClearDateRangeButton: true
      })
    }
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

  render() {
    const { history } = this.props
    return (
      <Layout history={history} page={page.stat_weighted}>
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <h3>LỊCH SỬ QUÉT</h3>
              <div className="datepickerContainer" >
                <DatePicker placeholder="Từ ngày" value={this.state.startDate} onChange={this.onChangeStartDate} />
                <i>&nbsp;</i>
                <DatePicker placeholder="Tới ngày" value={this.state.endDate} onChange={this.onChangeEndDate} />
                <i>&nbsp;</i>
                <Button onClick={this.applyDateRange}>OK</Button>
                { 
                  this.state.startDate && this.state.endDate && this.state.showClearDateRangeButton ?
                  <>
                    <i>&nbsp;</i>
                    <Button onClick={this.clearDateRange}>Xoá bộ lọc</Button>
                  </> : null
                }
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Số lượng "
                value={this.state.pagination.total}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix={<Icon type="number" />}
                suffix="sản phẩm"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
            <Statistic
              title="Tổng khối lượng"
                value={this.state.pagination.sumAll}
              precision={3}
              valueStyle={{ color: '#cf1322' }}
              prefix={<Icon type="history" />}
              suffix="kg"
            />
            </Card>
          </Col>
        </Row>
        <Table
          columns={columnsConfig}
          rowKey={record => record._id  ? record._id : Math.random()}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          rowClassName={(record, index) => (index % 2) ? 'odd' : 'even' }
        />
      </Layout>
    )
  }

} // class Page end
