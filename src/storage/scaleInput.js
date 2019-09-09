import db from './db'

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

export const getScaleInputs = async () => {
  const scaleInputs = await db.scaleInputs.find({})
  return { scaleInputs }
}
