import { getUniqueID, getVersion } from 'react-native-device-info'
import moment from 'moment'

import { getAccountId } from '../Auth'

export const visitLogGenerator = (visitAccountId, logType) => {
  let logQueueType = 'visitLogQueue'

  const accountId = getAccountId()
  const datetime = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss.SSSZ').toString()
  const ip = getUniqueID()
  const type = logType
  const version = getVersion()

  const log = {
    logQueueType: logQueueType,
    log: {
      accountId,
      datetime,
      ip,
      type,
      version,
      visitAccountId
    }
  }

  return log
}

export const logGenerator = (contentMeta, index, screenType, logType) => {
  let logQueueType = null

  if (screenType === 'explore') {
    const log = exLogGenerator(contentMeta, index, screenType, logType)
    return log
  }
  if (logType === 'Impression') {
    logQueueType = 'impLogQueue'
  } else {
    logQueueType = 'viewLogQueue'
  }

  const accountId = getAccountId()
  const episodeIdx = contentMeta[index].currentCenterIndex
  const contentId = contentMeta[index].contentRefs[episodeIdx].props.content.id
  const datetime = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss.SSSZ').toString()
  const episodeId = contentMeta[index].contentRefs[episodeIdx].props.content.episodeId
  const feedIdx = index
  const ip = getUniqueID()
  const type = logType
  const version = getVersion()

  const log = {
    logQueueType: logQueueType,
    log: {
      accountId,
      contentId,
      datetime,
      episodeId,
      episodeIdx,
      feedIdx,
      ip,
      screenType,
      type,
      version
    }
  }

  return log
}

const exLogGenerator = (contentMeta, index, screenType, logType) => {
  const exLogBundle = []
  const accountId = getAccountId()
  const datetime = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss.SSSZ').toString()
  const feedIdx = index
  const episode = contentMeta[index].props.episode

  for (let contentIndex in episode.contents) {
    if (contentIndex >= 2) {
      break
    }
    const contentId = episode.contents[contentIndex].id
    const episodeId = episode.contents[contentIndex].episodeId
    const episodeIdx = parseInt(contentIndex)
    const ip = getUniqueID()
    const type = logType
    const version = getVersion()

    const exLog = {
      logQueueType: 'impLogQueue',
      log: {
        accountId,
        contentId,
        datetime,
        episodeId,
        episodeIdx,
        feedIdx,
        ip,
        screenType,
        type,
        version
      }
    }
    exLogBundle.push(exLog)
  }

  return exLogBundle
}
