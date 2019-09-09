import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import "./panner.less"
import logo from './logo.jpg';

export default class panner extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="panner">
                <div className="logo_content">
                    <img src={logo} alt="Logo"></img>
                </div>
                <div className="company_description">
                    <div className="com_Name">
                        Công ty Cổ Phần Bao bì Sài Gòn (SAPACO)
                    </div>
                    <div className="com_Name_eng">
                        (SAIGOI PACKAGING JOINT - STOCK COMPANY)
                    </div>
                    <div className="com_Contact">
                        <p>Địa chỉ: Lô III-13, Đường CN13, KCN Tân Bình</p>
                        <p>Điện thoại: 028.3815.5581 - Fax: 028.3815.9726</p>
                        <p>Website: www.sapaco.com.vn- facebook.com/</p>
                    </div>
                </div>

            </div>
        );
    }

}