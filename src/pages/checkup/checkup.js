import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import Layout from '../../components/layout/layout'
import page from '../../constants/page.const'
import './style.less'
import ExportExcellButton from './button_export_excel'
import { createCheckupInput } from "../../storage/checkupStoge"
import { Popconfirm, message } from 'antd'
import notify from '../../utils/notify_message'
import ioHookManager from '../../utils/ioHook'

var fs = require('fs');
const pathLogger = $api.app.getAppPath() + '/log.txt';

var list = []

export default class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      arrWeight: [],
      products: [],
      sum: 0
    }
    this.stateCopy = this.state
  }

  componentDidMount() {
    ioHookManager.registerListener(this.eventHandler);
    this.clearSession()
  }

  componentWillUnmount() {
    this.clearSession();
  }

  render() {
    const { params: { config }, history } = this.props;
    return (
      <Layout history={history} page={page.checkup}>
        <br />
        <div className="groupHead">
          <div className="name_group_1">Kiểm kê sản phẩm: </div>
          <div className="headTitle Left">
            <div className='title1'>Tổng khối lượng đã quét: <span>{this.state.sum} kg </span> </div>
          </div>
          <div className="headTitle Right">

            <div className="but-function">
              <Popconfirm
                title="Bạn chắc chắn muốn xóa phiên làm việc?"
                onConfirm={this.clearSession}
                onCancel={this.cancel}
                okText="Có"
                cancelText="Không"
              >
                <button > Xóa phiên</button>
              </Popconfirm>
            </div>


            <div className="but-function">
              <ExportExcellButton prosProduct={this.state.products} ></ExportExcellButton>
            </div>


          </div>
        </div>
        <br />
        <br />
        <div className="groupHead2">
          <div className="name_group_2">Danh sách sản phẩm: </div>
          <div className="content_table">
            <br />
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
    if (this.state.products) {
      for (let i = 0; i < this.state.products.length; i++) {
        arrRows.push(this.renderRowProduct(this.state.products[i]));
      }
    }
    return arrRows;
  }

  renderRowProduct = (product) => {
    return (
      <tr key={product.id}>
        <td>{product.no}</td>
        <td>{product.id}</td>
        <td>{product.weight}kg</td>
        <td>{product.time}</td>
      </tr>
    );
  }

  globalLogger = (strLog) => {
    var str = "\n" + moment().format('HH:mm:ss --- DD/MM/YYYY: ') + strLog;
    fs.appendFile(pathLogger, str, function (err) {
      if (err) { }
    });
  }

  clearSession = () => {
    const newState = {
      arrWeight: [],
      products: [],
      sum: 0
    }
    this.stateCopy = newState;
    this.setState(newState);
    list = []
    console.log('clearSession')
  }

  cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  }

  buff = "";

  eventHandler = (event) => {
    var key = parseInt(event.keychar);
    var char = String.fromCharCode(key);
    var data = "";
    if (key != 13) {
      if (char) this.buff += char;
    }
    else {
      data = this.buff;
      this.buff = "";
      var strFilter = data.substring(0, 3);
      if (strFilter !== "999") {
        this.globalLogger('Mã sản phẩm không hợp lệ!');
        notify.openNotification("Mã sản phẩm không hợp lệ!");
        return;
      }
      //check unique ID
      var check = { value: data.toUpperCase() };
      const isExisted = _.find(list, check)
      if (isExisted) {
        this.globalLogger('Mã sản phẩm bị trùng: ' + check.value);
        notify.openNotification('Mã sản phẩm bị trùng: ' + check.value);
        return
      }
      list.push(check);
      // console.log(list)
      var strId = data.substring(3, 16).toUpperCase();
      // calculated numProduct
      var numProduct = this.stateCopy.products.length;
      //check and convert weight to kg
      var strWeight = data.substring(12, 16);
      var weight = parseFloat(strWeight) / 10; //convert weight: g -> kg
      if (isNaN(weight) == true) {
        this.globalLogger('Mã sản phẩm không hợp lệ!');
        notify.openNotification('Mã sản phẩm không hợp lệ!');
        return;
      }
      // add data (id + weight) to data base
      var recordA = {};
      try {
        recordA = createCheckupInput({ id: strId, weight });
      }
      catch (error) {
        this.globalLogger('Lưu dữ liệu vào cơ sở dữ liệu bị lỗi: ' + error.message);
        notify.openNotification('Lưu dữ liệu vào cơ sở dữ liệu bị lỗi: ' + error.message);
      }
      numProduct++;

      //read time_save from database
      const time_save = moment().format('HH:mm:ss --- DD/MM/YYYY')

      //add weight to arrWeight
      var oldArrWeight = this.stateCopy.arrWeight;
      oldArrWeight.unshift(weight);
      //calculated sumWeight
      let sumWeight = 0;
      for (let i = 0; i < numProduct; i++) {
        sumWeight += this.stateCopy.arrWeight[i];
      }
      sumWeight = sumWeight.toFixed(1);
      //add product to this.stateCopy.products
      var oldProducts = this.stateCopy.products;
      oldProducts.unshift({
        no: numProduct,
        id: strId,
        weight: weight,
        total: sumWeight,
        time: time_save
      });
      const newState = {
        arrWeight: oldArrWeight,
        products: oldProducts,
        sum: sumWeight
      }
      this.stateCopy = newState
      this.setState(newState);
    }
  }
}

