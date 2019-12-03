import moment from 'moment'
var fs = require('fs');

const pathLogger = $api.app.getAppPath() + '/log.txt';

const globalLogger = (strLog) => {
    var str = "\n" + moment().format('HH:mm:ss --- DD/MM/YYYY: ') + strLog;
    fs.appendFile(pathLogger, str, function (err) {
      if (err) { }
    });
  }

export default globalLogger