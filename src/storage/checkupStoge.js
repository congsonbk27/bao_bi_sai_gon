import db from './db'
import moment from 'moment'

export const createCheckupInput = async ({
  id,
  weight
}) => {
  const checkupInput = await db.checkups.insert({
    id,
    weight
  })
  return checkupInput;
}

export const getCheckupInput = async ({ itemPerPage, page, sortField, sortOrder, startDate, endDate }) => {
  console.log("--> Start Date: ", startDate);
  console.log("--> End Date: ", endDate);

  const allDataInDatabase = await db.checkups.find();
  console.log("--> allDataInDatabase: ", allDataInDatabase);

  const sort = {};
  const where = {};
  if (startDate && endDate) {
    where.$where = function () {
      const time = moment(this.createdAt)
      return time.isBetween(startDate, endDate.add(1, 'day'));
    }
  }

  const checkupWhere = await db.checkups.find(where);


  console.log("--> checkupWhere: ", checkupWhere);
  //return checkupWhere;

  if (sortField) sort[sortField] = sortOrder === 'ascend' ? -1 : 1
  const checkupInputs = await db.checkups
    .find(where)
    .skip(itemPerPage * (page - 1)).limit(itemPerPage)
    .sort(sort)
  console.log("--> checkupInputs: ", checkupInputs);



  // return checkupWhere;

  // note that, there are no SUM function on NeDB now, that's shit
  let sum = 0
  const checkupInputsForSum = await db.checkups.find(where);
  for (let i = 0; i < checkupInputsForSum.length; i++) {
    const item = checkupInputsForSum[i];
    if (item.weight) sum = parseFloat(item.weight) + sum;
    // console.log("--->sum: ", sum);
  }
  console.log("--> checkupInputsForSum: ", checkupInputsForSum);
  // console.log("--->Count: ", count);
  // console.log("--->Count: ", count);
  // console.log("--->Count: ", count);
  return {
    count,
    data: checkupInputs,
    sumAll: sum
  }
}

