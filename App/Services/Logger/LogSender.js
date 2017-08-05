import { getRealm } from '../RealmFactory'

export const insertToLogQueue = (log) => {
  let realm = getRealm()
  let logQueue = realm.objects('logQueue')

  realm.write(() => {
    realm.create('logQueue', {logType: log.logType, log: log.log})
  })

  if (logQueue.length > 5) {
    console.log('logQueue full')
    sizeBasedLogSend(logQueue)
  }
}

export const sizeBasedLogSend = (logQueue) => {
  logSendAndflush(logQueue)
  updateLogSendingTime()
}

export const timeBasedLogSend = (logQueue) => {
  if (checkLogSendingTimeBySizeBased() < 5) {
    logSendAndflush(logQueue)
  }
}

export const logSendAndflush = (logQueue) => {
  let realm = getRealm()

  // logBundle fetching
  const logBundle = logQueue.map(x => Object.assign({}, x))
  console.log(logBundle)

  // logBundle sending
  console.log('log sending API called')

  // logQueue flushing
  realm.write(() => {
    realm.delete(logQueue)
  })
}

export const updateLogSendingTime = () => {

}

export const checkLogSendingTimeBySizeBased = () => {

}
