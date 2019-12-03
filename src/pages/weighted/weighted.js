import React from 'react'
import { Popconfirm, Statistic, Card, Row, Col, Table } from 'antd';
import Layout from 'src/components/layout/layout'
import page from 'src/constants/page.const'
import scaleReader from 'src/utils/scaleReader'
import moment from 'moment'
import notify from '../../utils/notify_message'
import '../checkup/style.less'
import shortid from 'shortid'
import ExportExcellButton from './scale_excel'

const columnsConfig = [
  {
    title: 'STT',
    dataIndex: 'index',
    width: '10%',
  },
  {
    title: 'Mã sản phẩm',
    dataIndex: 'theid',
    render: time => typeof time == 'string' || typeof time == 'number' ? time : '',
    width: '20%',
  },
  {
    title: 'Khối lượng',
    dataIndex: 'weight',
    render: weight => weight ? `${weight} kg` : 'Không rõ',
    width: '20%',
  },
  {
    title: 'Ngày cân',
    dataIndex: 'createdAt',
    render: createdAt => createdAt ? `${moment(createdAt).format('HH:mm:ss --- DD/MM/YYYY')}` : 'Không rõ',
    width: '20%',
  },
  {
    title: 'Thao tác',
    dataIndex: 'time_scale',
    render: time_scale => time_scale ? `${time_scale}` : 'Không rõ',
    width: '20%',
  },
];

const ITEM_PER_PAGE = 1000;

export default class Weighted extends React.Component {
  constructor(props) {
    super(props)
    scaleReader.registerListener(this.onNewObject)
    this.state = {
      data: [],
      pagination: {
        pageSize: ITEM_PER_PAGE,
        current: 1
      },
      loading: false,
      newestObject: null,
      sumWeight: 0
    }
  }

  clearSession = () => {
    this.setState({
      data: [],
      pagination: {
        pageSize: ITEM_PER_PAGE,
        current: 1
      },
      loading: false,
      newestObject: null,
      sumWeight: 0
    })
    console.log('clearSession')
  }

  componentDidMount() {
  }

  onNewObject = async (newestObject) => {

    this.state.data.unshift(newestObject);
    let sum = 0;
    for (let i = 0; i < this.state.data.length; i++) {
      sum += this.state.data[i].weight;
    }

    const timeCreate = newestObject.createdAt;
    const time_scale = moment(timeCreate).format('HH:mm:ss --- DD/MM/YYYY');
    this.setState({
      data: this.state.data.map((object, i) => {
        return {
          ...object,
          index: i + 1,
          theid: `${$api.pad(object.time, 10)}${$api.pad(object.weight, 5)}`,
          time_scale: time_scale
        }
      }),
      newestObject,
      sumWeight: sum
    });

    console.log("phat hien sp moi: ", this.state.data);

  }

  render() {
    return (
      <Layout history={this.props.history} page={page.home}>
        <div style={{ background: 'white', padding: '30px' }}>
          <Row gutter={16}>
            <Col span={16} offset={4}>
              <Card>
                <Statistic
                  title="Đang cân"
                  value={this.state.newestObject ? this.state.newestObject.weight : 'Hãy đặt sản phẩm lên cân'}
                  precision={3}
                  valueStyle={{ color: '#3f8600', fontSize: '45px' }}
                  suffix={this.state.newestObject ? 'kg' : ''}
                />
              </Card>
            </Col>
          </Row>
          <br />
          <div className="groupHead">
            {/* <div className="name_group_1">Cân sản phẩm: </div> */}
            <div className="headTitle Left">
              <div className='title1'>Tổng khối lượng: <span>{this.state.sumWeight} kg </span> </div>
            </div>

            <div className="headTitle Right">
              <div className="but-function">
                <Popconfirm
                  title="Bạn chắc chắn muốn in tem tổng?"
                  onConfirm={this.confirm}
                  onCancel={this.cancel}
                  okText="Có"
                  cancelText="Không"
                >
                  <button>In tem tổng</button>
                </Popconfirm>
              </div>

              <div className="but-function">
                <ExportExcellButton prosProduct={this.state.data} ></ExportExcellButton>
              </div>

              <div className="but-function">
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa phiên làm việc?"
                  onConfirm={this.clearSession}
                  onCancel={this.cancel}
                  okText="Có"
                  cancelText="Không"
                >
                  <button>Kết thúc ca</button>
                </Popconfirm>
              </div>


            </div>
          </div>
          <br />
          <br />
          <div> <h3>Sản phẩm vừa cân</h3> </div>
          <Row gutter={16}>
            <Table
              bordered
              columns={columnsConfig}
              rowKey={record => record._id ? record._id : Math.random()}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
              rowClassName={(record, index) => (index % 2) ? 'odd' : 'even'}
            />
          </Row>
          <br />
        </div>
      </Layout>
    )
  }
  confirm = (e) => {
    // notify.openNotification("Ban chon yes");
    // notify.openNotification("So San Pham da can: " + this.state.data.length);
    // notify.openNotification("Tong khoi luong da can: " + this.state.sumWeight);
    const ANCHOR = new moment('09-09-2019');
    const time = Math.abs(moment().diff(ANCHOR, 'second'));
    const newObject = { weight: this.state.sumWeight, time: time, id: shortid.generate() }

    scaleReader.printBarcode(newObject)
    // this.setState({
    //   arrWeight: [],
    //   products: [],
    //   sum: 0
    // });
  }
  cancel = (e) => {
    notify.openNotification("Ban chon No");
    // message.error('Click on No');
  }




} // class Weighted end
