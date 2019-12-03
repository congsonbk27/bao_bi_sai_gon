import React from 'react'
import { DatePicker, Button, Statistic, Card, Row, Col, Icon, Table } from 'antd';
import moment from 'moment'
import _ from 'lodash'
import Layout from 'src/components/layout/layout'
import page from 'src/constants/page.const'
import { getDataCheckups } from "../../storage/checkupStoge"
import '../../pages/checkup/style.less'
import notify from '../../utils/notify_message'

const ITEM_PER_PAGE = 10;

const columns = [
   {
      title: 'STT',
      dataIndex: 'stt',
      sorter: (a, b) => a.stt - b.stt,
      sortDirections: ['descend', 'ascend'],
   },
   {
      title: 'Mã sản phẩm',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
   },
   {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      sorter: (a, b) => a.weight - b.weight,
      sortDirections: ['descend', 'ascend'],
   },
   {
      title: 'Thời gian quét',
      dataIndex: 'time',
      render: time => time ? `${moment(time).format('HH:mm:ss --- DD/MM/YYYY')}` : 'Không rõ',
      sorter: (a, b) => a.time - b.time,
      defaultSortOrder: 'ascend',
      sortDirections: ['descend', 'ascend'],
   },
];


export default class CheckupStats extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         record: {},
         numProducts: 0,
         totalWeight: 0,
         endDate: null,
         startDate: null,

         data: [],
         data_test: [],
         pagination: {
            pageSize: ITEM_PER_PAGE,
            current: 1
         },
         loading: false,
         sortedInfo: null

      }
      this.applyAllDate();
   }

   render() {
      const { history } = this.props
      return (
         <Layout history={history} page={page.stat_checkup}>
            <Row gutter={16}>
               <Col span={12}>
                  <Card>
                     <h3>LỊCH SỬ QUÉT</h3>
                     <div className="datepickerContainer" >
                        <DatePicker placeholder="Từ ngày" value={this.state.startDate} onChange={this.onChangeStartDate} />
                        <i>&nbsp;</i>
                        <DatePicker placeholder="Tới ngày" value={this.state.endDate} onChange={this.onChangeEndDate} />
                        <i>&nbsp;</i>
                        <Button onClick={this.applyDateFind}>OK</Button>
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
                        value={this.state.numProducts}
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
                        value={this.state.totalWeight}
                        precision={3}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<Icon type="history" />}
                        suffix="kg"
                     />
                  </Card>
               </Col>
            </Row>
            <br></br>
            <div className="groupHead2">
               <div className="name_group_2">Danh sách sản phẩm: </div>
               <div className="content_table_page">
                  <div className="content_table">
                     <Table
                        rowKey={record => record._id ? record._id : Math.random()}
                        columns={columns}
                        dataSource={this.state.data_test}
                        onChange={this.handleTableChange}
                        bordered
                        loading={this.state.loading}
                     />
                  </div>
               </div>
            </div>
         </Layout>
      )
   }

   onChangeEndDate = (date) => {
      if (this.state.startDate && date && date.isBefore(this.state.startDate)) {
         notify.openNotification('Ngày kết thúc không hợp lệ.\n \n Ngày bắt đầu đã chọn là ' + this.state.startDate.format('DD-MM-YYYY') + '\n Ngày kết thức vừa chọn là: ' + date.format('DD-MM-YYYY'))
         return
      }
      this.setState({
         endDate: date
      }, () => {
         console.log('da set end date', this.state.endDate)
      })
   }

   onChangeStartDate = (date) => {
      if (this.state.endDate && date && date.isAfter(this.state.endDate)) {
         notify.openNotification('Ngày bắt đầu không hợp lệ.\n \n Ngày kết thúc đã chọn là ' + this.state.endDate.format('DD-MM-YYYY') + '\n Ngày bắt đầu vừa chọn là: ' + date.format('DD-MM-YYYY'))
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

   applyDateFind = async () => {
      let startDate = "";
      let endDate = "";
      if (!this.state.startDate) {
         startDate = "1970-01-01";
      }
      else {
         startDate = _.cloneDeep(this.state.startDate).subtract(1, 'day').format('YYYY-MM-DD');
      }

      if (!this.state.endDate) {
         endDate = "2070-01-01";
      }
      else {
         endDate = _.cloneDeep(this.state.endDate).add(1, 'day').format('YYYY-MM-DD');
      }
      this.find_data_by_range_date(startDate, endDate);
   }

   applyAllDate = async () => {
      const startDate = "1970-01-02";
      const endDate = "2070-01-02";
      this.find_data_by_range_date(startDate, endDate);
   }

   find_data_by_range_date = async (startDate, endDate) => {
      var page = 1;
      var sortField = 'createdAt';
      var sortOrder = 'ascend';
      const data = await getDataCheckups({
         itemPerPage: ITEM_PER_PAGE,
         page,
         sortField,
         sortOrder,
         startDate: startDate,
         endDate: endDate
      });
      var arrtemp = [];
      for (let i = 0; i < data.data.length; i++) {
         arrtemp.push({
            stt: i,
            id: data.data[i].id,
            weight: data.data[i].weight,
            time: data.data[i].createdAt
         });
      }

      this.setState({
         data_test: arrtemp,
         numProducts: data.count,
         totalWeight: data.sumAll
      });
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
         data = await getDataCheckups({
            itemPerPage: ITEM_PER_PAGE,
            page,
            sortField,
            sortOrder,
            startDate: this.state.startDate,
            endDate: this.state.endDate
         })
      } catch (error) {
         console.warn('fetchDataFromDb error', error)
      }
      const newState = {
         data: data && data.data && data.data.length ?
            data.data.map((d, i) => ({ ...d, theid: `${$api.pad(d.time, 10)}${$api.pad(d.weight, 5)}`, index: ITEM_PER_PAGE * (this.state.pagination.current - 1) + i + 1 })) : [],
         pagination: {
            ...this.state.pagination,
            total: data.count,
            sumAll: data.sumAll
         },
         loading: false
      }
      this.setState(newState)
   }
}






