import React from 'react'
import { Table, DatePicker, Button, Statistic, Card, Row, Col, Icon } from 'antd';
import moment from 'moment'
import _ from 'lodash'
import Layout from 'src/components/layout/layout'
import page from 'src/constants/page.const'
import { find_data_from_database, find_all_data_from_database } from "../../storage/checkupStoge"
import '../../pages/checkup/style.less'

const { RangePicker } = DatePicker;

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
      record: {},
      endDate: null,
      startDate: null
    }
    this.applyAllDate();
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

  applyDateFind = async () => {
    var data = {};
    if (this.state.startDate && this.state.endDate) {

      const startDay = _.cloneDeep(this.state.startDate).subtract(1, 'day').format('YYYY-MM-DD');
      const endDay = _.cloneDeep(this.state.endDate).add(1, 'day').format('YYYY-MM-DD');
      data = await find_data_from_database(startDay, endDay);
    }

    if (data.count >= 0) {
      this.setState({
        record: data
      });
    }
  }

  applyAllDate = async () => {
    const data = await find_all_data_from_database();
    console.log("==> all_data: ", data);
    if (data.count > 0) {
      this.setState({
        record: data
      });
    }
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
                value={this.state.record.count}
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
                value={this.state.record.sumAll}
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
          <div className="content_table">
            <table id='products'>
              <tbody>
                {this.renderTableHeader()}
                {this.renderAllProduct()}
              </tbody>
            </table>
          </div>
        </div>

      </Layout>
    )
  }

  renderTableHeader = () => {
    return (
      <tr key="2" id="head_table">
        <td>STT</td>
        <td>Mã sản phẩm</td>
        <td>Khối lượng</td>
        <td>Thời gian quét</td>
      </tr>
    );
  }

  renderAllProduct = () => {
    var arrRows = [];
    if (this.state.record) {
      for (let i = 0; i < this.state.record.count; i++) {
        arrRows.push(this.renderRowProduct(this.state.record.data[i], i));
      }
    }
    return arrRows;
  }

  renderRowProduct = (data, index) => {
    const time = data.createdAt ? `${moment(data.createdAt).format('HH:mm:SS  --- DD/MM/YYYY')}` : 'Không rõ';
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{data.id}</td>
        <td>{data.weight}kg</td>
        <td>{time}</td>
      </tr>
    );
  }

} // class Page end
