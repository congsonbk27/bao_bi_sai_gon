import React from 'react'
import moment from 'moment'

import { Button } from 'antd'
import Layout from '../../components/layout/layout'
import page from '../../constants/page.const'
import './style.less'
import ExportExcellButton from './test'
import { createCheckupInput, getCheckupInput } from "../../storage/checkupStoge"
import Panner from './panner'


export default class Page extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)

    this.ScanCode()

    this.state = {
      value: "",
      arrId: [],
      arrWeight: [],
      products: [
        { no: 0, id: "0", weight: 0, total: 0, time: null }
      ],
      sum: 0
    }
  }

  render() {
    const { params: { config }, history } = this.props
    return (
      <Layout history={history} page={page.checkup}>

        {/* <Panner></Panner> */}

        <div className="groupHead">
          <div className="name_group_1">Kiểm kê sản phẩm: </div>

          <div className="headTitle Left">
            <div className='title1'>Tổng khối lượng đã quét: <span>{this.renderTotal()} kg </span> </div>
          </div>

          <div className="headTitle Right">
            <button onClick={this.clearSession}> Xóa phiên</button>
            <ExportExcellButton prosProduct={this.state.products} ></ExportExcellButton>
          </div>

        </div>
        <br />

        <div className="groupHead2">
          <div className="name_group_2">Danh sách sản phẩm: </div>
          <div className="content_table">
            <table id='products'>
              <tbody>
                {/* {this.renderRowHead()} */}
                {/* <tr>{this.renderRowHead()}</tr> */}
                <tr>{this.renderTableHeader()}</tr>
                {/* {this.renderRowTable()} */}
                {this.renderAllProduct()}
              </tbody>
            </table>
          </div>
        </div>

      </Layout>
    )
  }
  clearSession = () => {
    this.setState({
      products: [
        { no: 0, id: "0", weight: 0, total: 0 }
      ],
      sum: 0
    });
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

  renderRowHead = () => {
    return (
      <tr key="5">
        <td>STT</td>
        <td>ID</td>
        <td>Khối lượng</td>
        <td>Ngày giờ</td>
      </tr>
    );
  }

  renderRowProduct = (product) => {
    return (
      <tr key={product.id}>
        <td>{product.no}</td>
        <td>{product.id}</td>
        <td>{product.weight}kg</td>
        <td>{product.total}kg</td>
        <td>{product.time}</td>
      </tr>
    );
  }

  ScanCode = () => {
    let buffer = '';
    document.addEventListener('keypress', async (event) => {
      let data = buffer || '';
      if (event.key !== 'Enter') { // barcode ends with enter -key
        data += event.key;
        buffer = data;
      }
      else {
        buffer = '';
        console.log(data);          // ready barcode ready for a use
        let numProduct = this.state.products.length;
        //check unique ID
        var strId = data.substring(0, 13);
        strId = strId.toUpperCase();
        for (let i = 0; i < numProduct; i++) {
          if (strId == this.state.products[i].id) {
            return;
          }
        }
        //check and convert weight to kg
        var strWeight = data.substring(9, 13);
        var weight = parseInt(strWeight) / 10; //convert eight: g -> kg
        if (isNaN(weight) == true) {
          return;
        }
        // add data (id + weight) to data base
        console.log("strId: ", strId);
        console.log("weight: ", weight);
        var recordA = await createCheckupInput({ id: strId, weight });
        console.log("dataBase: ", recordA);
        const time_save = recordA && recordA.createdAt ? moment(recordA.createdAt).format('HH:mm:SS  --- DD/MM/YYYY') : 'Không rõ';

        const oldArrWeight = this.state.arrWeight;
        oldArrWeight.unshift(weight);



        let sumWeight = 0;
        for (let i = 0; i < numProduct; i++) {
          sumWeight += this.state.arrWeight[i];
        }
        sumWeight = sumWeight.toFixed(1);
        const oldProducts = this.state.products;
        oldProducts.unshift({ no: numProduct, id: strId, weight: weight, total: sumWeight, time: time_save });

        this.setState({
          arrWeight: oldArrWeight,
          products: oldProducts,
          sum: sumWeight
        });
      }
    });
  }
  renderTotal = () => {
    const array = [];
    const sum = this.state.sum;
    array.push(sum);
    return array
  }
  renderTableHeader = () => {
    let header = Object.keys(this.state.products[0])
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }
  renderRowTable = () => {
    const array = [];
    for (let i = 0; i < this.state.products.length; i++) {
      let no = this.state.products[i].no;
      let id = this.state.products[i].id;
      let weight = this.state.products[i].weight;
      let total = this.state.products[i].total;
      if (weight == 0) continue;
      array.push(
        <tr key={id}>
          <td>{no}</td>
          <td>{id}</td>
          <td> {weight}kg</td>
          <td>{total}kg</td>
        </tr>
      );
    }
    return array
  }
}

