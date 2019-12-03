import db from './db'
import moment from 'moment'
import _ from 'lodash'

export const createScaleInput = async ({
  id,
  time,
  weight
}) => {
  const scaleInput = await db.scaleInputs.insert({
    id,
    time,
    weight
  })
  return scaleInput
}

export const getScaleInputs = async ({ itemPerPage, page, sortField, sortOrder, startDate, endDate }) => {
  const sort = {}

  var startDateCloned = "";
  if (!startDate) {
    startDateCloned = moment("1970-01-01", "YYYY-MM-DD");
  }
  else {
    startDateCloned = _.cloneDeep(startDate).subtract(1, 'day').format('YYYY-MM-DD')
  }

  var endDateCloned = "";
  if (!endDate) {
    endDateCloned = moment("2070-01-01", "YYYY-MM-DD");
  }
  else {
    endDateCloned = _.cloneDeep(endDate).add(1, 'day').format('YYYY-MM-DD');
  }

  const where = {};
  where.$where = function () {
    const timetest = moment(this.createdAt).format('YYYY-MM-DD')
    const timeResult = moment(timetest).isBetween(startDateCloned, endDateCloned, 'day');
    return timeResult;
  }

  if (sortField) sort[sortField] = sortOrder === 'ascend' ? -1 : 1
  const scaleInputs = await db.scaleInputs
    .find(where)
    .skip(itemPerPage * (page - 1)).limit(itemPerPage)
    .sort(sort)

  const count = await db.scaleInputs.count(where)

  // note that, there are no SUM function on NeDB now, that's shit
  let sum = 0;
  const scaleInputsForSum = await db.scaleInputs.find(where);
  for (let i = 0; i < scaleInputsForSum.length; i++) {
    const item = scaleInputsForSum[i];
    if (item.weight) sum = parseFloat(item.weight) + sum
  }
  return {
    count,
    data: scaleInputs,
    sumAll: sum
  }
}
