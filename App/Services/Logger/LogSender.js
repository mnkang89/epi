import API from '../Api'
import { getRealm } from '../RealmFactory'

const api = API.create()

export const insertToLogQueue = (log) => {
  let realm = getRealm()
  let logQueue = null
  const logQueueType = log.logQueueType

  logQueue = realm.objects(logQueueType)

  realm.write(() => {
    realm.create(logQueueType, {log: log.log})
  })

  if (logQueue.length > 5) {
    console.log(logQueueType + ' : logQueue full')
    sizeBasedLogSend(logQueueType, logQueue)
  }
}

export const sizeBasedLogSend = (logQueueType, logQueue) => {
  logSendAndflush(logQueueType, logQueue)
  updateLogSendingTime()
}

export const timeBasedLogSend = (logQueueType, logQueue) => {
  if (checkLogSendingTimeBySizeBased() > 5) {
    logSendAndflush(logQueueType, logQueue)
  }
}

export const logSendAndflush = (logQueueType, logQueue) => {
  let realm = getRealm()

  // logBundle fetching
  const logBundle = logQueue.map(x => Object.assign({}, x.log))
  const JSONbody = JSON.stringify(logBundle)

  // logBundle sending
  if (logQueueType === 'visitLogQueue') {
    const result = api.postVisitLogs(JSONbody)
    console.log(result)
  } else if (logQueueType === 'impLogQueue') {
    const result = api.postImpLogs(JSONbody)
    console.log(result)
  } else if (logQueueType === 'viewLogQueue') {
    const result = api.postViewLogs(JSONbody)
    console.log(result)
  } else {
    // loginlog
  }

  // logQueue flushing
  realm.write(() => {
    realm.delete(logQueue)
  })
}

export const updateLogSendingTime = () => {

}

export const checkLogSendingTimeBySizeBased = () => {

}
