import db from './db'
import moment from 'moment'

export const createCheckupInput = async ({ id, weight }) => {
  const checkupInput = await db.checkups.insert({
    id,
    weight
  })
  return checkupInput;
}

export const find_all_data_from_database = async () => {
  const allDataInDatabase = await db.checkups.find();
  let sum = 0;
  let count = allDataInDatabase.length;
  for (let i = 0; i < count; i++) {
    const item = allDataInDatabase[i];
    if (item.weight) sum = parseFloat(item.weight) + sum;
  }
  return {
    count: count,
    data: allDataInDatabase,
    sumAll: sum
  }
}

export const find_data_from_database = async (startDate, endDate) => {
  console.log("--> Start Date: ", startDate);
  console.log("--> End Date: ", endDate);
  const where = {};
  if (startDate && endDate) {
    where.$where = function () {
      const time = moment(this.createdAt).format('YYYY-MM-DD')
      const fuck = moment(time).isBetween(startDate, endDate, 'day');
      console.log(time, startDate, endDate, fuck)
      return fuck
    }
  }

  const checkupWhere = await db.checkups.find(where);
  console.log("--> checkupWhere: ", checkupWhere);

  // note that, there are no SUM function on NeDB now, that's shit
  let sum = 0;
  let count = checkupWhere.length;
  for (let i = 0; i < count; i++) {
    const item = checkupWhere[i];
    if (item.weight) sum = parseFloat(item.weight) + sum;
  }
  console.log("--> sum: ", sum);

  return {
    count: count,
    data: checkupWhere,
    sumAll: sum
  }
}

