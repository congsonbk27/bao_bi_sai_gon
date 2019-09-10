import db from './db'
import moment from 'moment'

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
  const where = {}
  if (startDate && endDate) {
    console.log({ endDate, startDate})
    where.$where = function () {
      const time = moment(this.createdAt)
      return time.isBetween(startDate, endDate.add(1, 'day'))
    }
  } 
  if (sortField) sort[sortField] = sortOrder === 'ascend' ? -1 : 1
  const scaleInputs = await db.scaleInputs
    .find(where)
    .skip(itemPerPage * (page - 1) ).limit(itemPerPage)
    .sort(sort)

  const count = await db.scaleInputs.count(where)

  // note that, there are no SUM function on NeDB now, that's shit
  let sum = 0
  const scaleInputsForSum = await db.scaleInputs
    .find(where)
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
