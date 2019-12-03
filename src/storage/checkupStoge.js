import db from './db'
import moment from 'moment'
import _ from 'lodash'

export const createCheckupInput = async ({ id, weight }) => {
  const checkupInput = await db.checkups.insert({
    id,
    weight
  })
  return checkupInput;
}

export const find_data_from_database = async (startDate, endDate) => {
  const where = {};

  if (startDate && endDate) {
    where.$where = function () {
      const time = moment(this.createdAt).format('YYYY-MM-DD')
      const timeResult = moment(time).isBetween(startDate, endDate, 'day');
      return timeResult
    }
  }
  const checkupWhere = await db.checkups.find(where);
  // note that, there are no SUM function on NeDB now, that's shit
  let sum = 0;
  let count = checkupWhere.length;
  for (let i = 0; i < count; i++) {
    const item = checkupWhere[i];
    if (item.weight) sum = parseFloat(item.weight) + sum;
  }
  return {
    count: count,
    data: checkupWhere,
    sumAll: sum
  }
}
 
export const getDataCheckups = async ({ itemPerPage, page, sortField, sortOrder, startDate, endDate }) => {
  const sort = {};
  const where = {};
  if (startDate && endDate) {
    where.$where = function () {
      const time = moment(this.createdAt).format('YYYY-MM-DD');
      const timeResult = moment(time).isBetween(startDate, endDate, 'day');
      return timeResult
    }
  }

  if (sortField) sort[sortField] = sortOrder === 'ascend' ? -1 : 1;
  console.log("--> DB sortField: ", sortField);
  const checkups = await db.checkups
    .find(where)
    // .skip(itemPerPage * (page - 1)).limit(itemPerPage)
    .sort(sort)

  const count = await db.checkups.count(where);

  // note that, there are no SUM function on NeDB now, that's shit
  let sum = 0;
  const checkupsForSum = await db.checkups.find(where);
  for (let i = 0; i < checkupsForSum.length; i++) {
    const item = checkupsForSum[i];
    if (item.weight) sum = parseFloat(item.weight) + sum
  }
  return {
    count,
    data: checkups,
    sumAll: sum
  }
}

