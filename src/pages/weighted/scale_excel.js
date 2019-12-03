import React from "react";
import ReactExport from "react-export-excel";
import moment from 'moment'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class Download extends React.Component {
    render() 
    {
        const products = this.props.prosProduct;

        const arrItems = [];
        if (products) {
            for (let i = 0; i < products.length; i++) {
                arrItems[i] = {};
                arrItems[i].no = products[i].index;
                arrItems[i].id = products[i].theid;
                arrItems[i].weight = products[i].weight;
                const timeCreate = products[i].createdAt;
                arrItems[i].time = moment(timeCreate).format('HH:mm:ss --- DD/MM/YYYY');
            }
        }
       const fileNameExport = `Báo_Cáo_Cân_${moment().format('DD-MM-YYYY---HH:mm')}`;
        return (
            <ExcelFile filename={fileNameExport}>
                <ExcelSheet data={arrItems} name="Leaves">
                    <ExcelColumn label="STT" value="no" />
                    <ExcelColumn label="Mã sản phẩm" value="id" />
                    <ExcelColumn label="Khối lượng" value="weight" />
                    <ExcelColumn label="Thời gian cân" value="time" />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}