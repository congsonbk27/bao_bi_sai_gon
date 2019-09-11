import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const dataSet1 = [
    {
        name: "Johson",
        amount: 30000,
        sex: 'M',
        is_married: true
    },
    {
        name: "Monika",
        amount: 355000,
        sex: 'F',
        is_married: false
    },
    {
        name: "John",
        amount: 250000,
        sex: 'M',
        is_married: false
    },
    {
        name: "Josef",
        amount: 450500,
        sex: 'M',
        is_married: true
    }
];

const dataSet2 = [
    {
        name: "Johnson",
        total: 25,
        remainig: 16
    },
    {
        name: "Josef",
        total: 25,
        remainig: 7
    }
];

export default class Download extends React.Component {
    render() {
        var products = this.props.prosProduct;
        var arrItems = [];
        if (products) {
            for (let i = 0; i < products.length; i++) {
                arrItems[i] = {};
                arrItems[i].no = products[i].no;
                arrItems[i].id = products[i].id;
                arrItems[i].weight = products[i].weight;
                arrItems[i].total = products[i].total;
            }
        }
        console.log('Hvnbvnbvbnvnb', arrItems)
        return (
            <ExcelFile filename="Báo_cáo.xls">
                <ExcelSheet data={arrItems} name="Leaves">
                    <ExcelColumn label="NO" value="no" />
                    <ExcelColumn label="ID" value="id" />
                    <ExcelColumn label="Weight" value="weight" />
                    <ExcelColumn label="Total" value="total" />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}