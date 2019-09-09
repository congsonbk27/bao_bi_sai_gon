import  Datastore from 'nedb-promises'

const dbFactory = (appPath, fileName) => Datastore.create({
  filename: `${process.env.NODE_ENV === 'dev' ? '.' : appPath}/data/${fileName}`,
  timestampData: true,
  autoload: true
});

class Db {
  scaleInputs= null
  checkups= null

  constructor() {
    this.init()
  }

  init() {
    const appPath = $api.app.getAppPath()
    this.scaleInputs = dbFactory(appPath, 'scaleInputs.db')
    this.checkups = dbFactory(appPath, 'checkups.db')
  }
}

const dbInstance = new Db()
export default dbInstance
