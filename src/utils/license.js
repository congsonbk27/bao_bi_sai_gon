
import { machineId } from 'node-machine-id';
import md5 from 'md5';

export function generateSecretToken() {
  return '9689'
}

export async function getRequestActivationCode() {
  const id = await machineId();
  return md5(id)
}

export async function checkLicense(answerCode) {
  const id = await getRequestActivationCode();
  const secret = generateSecretToken()
  return md5(`${id}${secret}`) === answerCode
}
