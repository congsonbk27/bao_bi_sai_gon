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
  const sort = {}
  const where = {}
  if (startDate && endDate) {
    console.log({ endDate, startDate })
    where.$where = function () {
      const time = moment(this.createdAt)
      return time.isBetween(startDate, endDate.add(1, 'day'))
    }
  }
  if (sortField) sort[sortField] = sortOrder === 'ascend' ? -1 : 1
  const checkupInputs = await db.checkups
    .find(where)
    .skip(itemPerPage * (page - 1)).limit(itemPerPage)
    .sort(sort)

  const count = await db.checkups.count(where)

  // note that, there are no SUM function on NeDB now, that's shit
  let sum = 0
  const checkupInputsForSum = await db.checkupInputs
    .find(where)
  for (let i = 0; i < checkupInputsForSum.length; i++) {
    const item = checkupInputsForSum[i];
    if (item.weight) sum = parseFloat(item.weight) + sum
  }
  return {
    count,
    data: checkupInputs,
    sumAll: sum
  }
}

