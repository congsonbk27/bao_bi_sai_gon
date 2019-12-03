import React from "react";
import ReactExport from "react-export-excel";
import moment from 'moment'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class Download extends React.Component {
    render() 
    {
        var products = this.props.prosProduct;
        var arrItems = [];
        if (products) {
            for (let i = 0; i < products.length; i++) {
                arrItems[i] = {};
                arrItems[i].no = products[i].no;
                arrItems[i].id = products[i].id;
                arrItems[i].weight = products[i].weight;
                arrItems[i].total = products[i].total;
                arrItems[i].time = products[i].time;
            }
        }
        const fileNameExport = `Báo_Cáo_Kiểm_Kê_${moment().format('DD-MM-YYYY---HH:mm')}`;
        return (
            <ExcelFile filename={fileNameExport}>
                <ExcelSheet data={arrItems} name="Leaves">
                    <ExcelColumn label="STT" value="no" />
                    <ExcelColumn label="Mã sản phẩm" value="id" />
                    <ExcelColumn label="Khối lượng" value="weight" />
                    <ExcelColumn label="Thời gian quét" value="time" />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}