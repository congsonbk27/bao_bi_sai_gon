import { notification } from 'antd';
import _ from 'lodash'
import './notify_message.less'

class Notify {
    constructor() {
      this.configNotification()
    }

    configNotification = () => {
        notification.config({
            placement: 'topRight',
            bottom: 50,
            duration: 1,
        });
    }

    openNotification = (str) => {
      notification.error({
        className: "js_notify",
        message: 'Thông Báo: ',
        description:
            str,
        onClick: () => {
        },
      })
    };
}

var notify = new Notify();

export default notify;