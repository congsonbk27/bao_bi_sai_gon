import db from './db'
import md5 from 'md5'

export const PORT_SETTING_ID =  1
export const PASSWORD_SETTING_ID =  2
export const DEFAUT_PAGE_SETTING_ID =  3

export const DEFAUT_PAGE_VALUE_SCALE =  'Cân sản phẩm'
export const DEFAUT_PAGE_VALUE_CHECKUP =  'Kiểm kê'
export const DEFAUT_PAGE_VALUE_SETTINGS =  'Cài đặt'

export const createSetting = async ({
  setting_id,
  value
}) => {
  if (setting_id === PORT_SETTING_ID && await getPort()) return
  if (setting_id === PASSWORD_SETTING_ID && await getPassword()) return
  if (setting_id === DEFAUT_PAGE_SETTING_ID && await getDefaultPage()) return
  const setting = await db.settings.insert({
    setting_id,
    value
  })
  return setting
}

export const getPort = async () => {
  const where = { setting_id: PORT_SETTING_ID }
  const settings = await db.settings
    .find(where)
    .limit(1)
  return settings ? settings[0] : 'No port'
}

export const setPort = async (port) => {
  const where = { setting_id: PORT_SETTING_ID }
  const res = await db.settings
    .update(where, {$set: { value: port }}, {})
  return res
}

export const getPassword = async () => {
  const where = { setting_id: PASSWORD_SETTING_ID }
  const settings = await db.settings
    .find(where)
    .limit(1)
  return settings ? settings[0] : 'No password'
}

export const setPassword = async (password) => {
  const where = { setting_id: PASSWORD_SETTING_ID }
  const res = await db.settings
    .update(where, { $set: {value: md5(password) } }, {})
  return res
}

export const getDefaultPage = async () => {
  const where = { setting_id: DEFAUT_PAGE_SETTING_ID }
  const settings = await db.settings
    .find(where)
    .limit(1)
  return settings ? settings[0] : 'No DefaultPage'
}

export const setDefaultPage = async (defaultPage) => {
  const where = { setting_id: DEFAUT_PAGE_SETTING_ID }
  const res = await db.settings
    .update(where, { $set: { value: defaultPage } }, {})
  return res
}
