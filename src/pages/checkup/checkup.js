import React from 'react'
import { Button } from 'antd'
import Layout from '../../components/layout/layout'
import page from '../../constants/page.const'
import './style.less'
import ExportExcellButton from './test'
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
        { no: 0, id: "0", weight: 0, total: 0 }
      ],
      sum: 0
    }
  }

  render() {
    const { params: { config }, history } = this.props
    return (
      <Layout history={history} page={page.checkup}>

      <Panner></Panner>


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

  renderRowProduct = (product) => {
    return (
      <tr key={product.id}>
        <td>{product.no}</td>
        <td>{product.id}</td>
        <td>{product.weight}kg</td>
        <td>{product.total}kg</td>
      </tr>
    );
  }


  ScanCode = () => {
    let buffer = '';
    document.addEventListener('keypress', event => {
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
        var strId = data.substring(0, 9);
        for (let i = 0; i < numProduct; i++) {
          if (strId == this.state.products[i].id) {
            return;
          }
        }
        //check and convert weight to kg
        var strWeight = data.substring(9, 15);
        var weight = parseInt(strWeight) / 1000; //convert eight: g -> kg
        if (isNaN(weight) == true) {
          return;
        }
        const oldArrWeight = this.state.arrWeight;
        oldArrWeight.unshift(weight);

        let sumWeight = 0;
        for (let i = 0; i < numProduct; i++) {
          sumWeight += this.state.arrWeight[i];
        }
        sumWeight = sumWeight.toFixed(3);
        const oldProducts = this.state.products;
        oldProducts.unshift({ no: numProduct, id: strId, weight: weight, total: sumWeight });

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






// renderTableData = () => {
//   return this.state.products.map((product, index) => {
//     const { no, id, weight, total, time } = product; //destructuring
//     return (
//       <tr key={id}>
//         <td>{no}</td>
//         <td>{id}</td>
//         <td>{weight} kg</td>
//         <td>{total} kg</td>
//       </tr>
//     );
//   });
// }


// renderList = () => {
//   const array = [];
//   for (let i = 0; i < this.state.arrId.length; i++) {
//     const id = this.state.arrId[i];
//     const weight = this.state.arrWeight[i];
//     array.push(<p> {i} - {id} - {weight}</p>);
//     <tr key={id}>
//       <td>{i}</td>
//       <td>{id}</td>
//       <td> {weight}</td>
//       {/* <td>{email}</td> */}
//     </tr>
//   }
//   return array
// }

// onChangeValue2 = (event) => {
//   if (event && event.target) {
//     this.setState({
//       value2: event.target.value
//     })
//   }
// }

// myFunction = (event) => {
//   console.log(event);
//   var x = event.target.value;         // Get the Unicode value
//   console.log("x = " + x);

//   var scanCode;
//   var paperRoll = {};
//   if (x == 13) {
//     scanCode = document.getElementById("ScanCode").value;
//     document.getElementById("demo").value = scanCode;
//     document.getElementById("ScanCode").value = "";
//     paperRoll = decoder(scanCode);
//     if (isNaN(paperRoll.weight) != true) {
//       add_paperRoll_to_row(paperRoll);
//     }
//   }
//   event.preventDefault();
// }

// decoder = (scanCode) => {
//   var paperRoll = {};
//   paperRoll.id = scanCode.substring(0, 4);
//   paperRoll.time = scanCode.substring(4, 8);
//   paperRoll.weight = parseInt(scanCode.substring(8, 12));
//   return paperRoll;
// }
// //add row
// add_paperRoll_to_row = (paperRoll) => {

//   var table = document.getElementById("customers");
//   var table_len = (table.rows.length);

//   var row = table.insertRow(table_len);

//   var cell_no = row.insertCell(0);
//   cell_no.innerHTML = "" + table_len;

//   var cell_id = row.insertCell(1);
//   cell_id.innerHTML = "" + paperRoll.id;

//   var cell_time = row.insertCell(2);
//   cell_time.innerHTML = "" + paperRoll.time;

//   var cell_weight = row.insertCell(3);
//   cell_weight.innerHTML = "" + paperRoll.weight + " kg";

//   var old_weight = parseInt(table.rows[table_len - 1].cells[4].innerHTML);
//   if (isNaN(old_weight)) {
//     old_weight = 0;
//   }

//   var cell_total = row.insertCell(4);
//   cell_total.innerHTML = "" + (old_weight + paperRoll.weight) + " kg";
// }
// delete_row = (no) => {
//   document.getElementById("row" + no + "").outerHTML = "";
// }

