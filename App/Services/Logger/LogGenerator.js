import { getAccountId } from '../Auth'
import moment from 'moment'

export const impressionLogGenerator = (contentMeta, index, panel) => {
  if (panel === 'explore') {
    const log = exImpressionLogGenerator(contentMeta, index, panel)
    return log
  }
  const viewableContentCenterIndex = contentMeta[index].currentCenterIndex.toString()

  const logTime = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss').toString()
  const userId = getAccountId().toString()
  const contentIndex = index.toString()
  const contentId = contentMeta[index].contentRefs[viewableContentCenterIndex].props.content.id.toString()
  const episodeId = contentMeta[index].contentRefs[viewableContentCenterIndex].props.content.episodeId.toString()
  const type = contentMeta[index].contentRefs[viewableContentCenterIndex].props.content.type.toString()
  const path = contentMeta[index].contentRefs[viewableContentCenterIndex].props.content.path.toString()

  const log = {
    logType: 'impression',
    log: {
      logTime,
      userId,
      contentIndex,
      contentId,
      episodeId,
      type,
      path,
      panel
    }
  }

  return log
}

const exImpressionLogGenerator = (contentMeta, index, panel) => {
  const logTime = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss').toString()
  const userId = getAccountId().toString()
  const contentIndex = index.toString()
  const exLogBundle = []

  for (let content in contentMeta[index].props.episode.contents) {
    const contentId = contentMeta[index].props.episode.contents[content].id.toString()
    const episodeId = contentMeta[index].props.episode.contents[content].episodeId.toString()
    const type = contentMeta[index].props.episode.contents[content].type.toString()
    const path = contentMeta[index].props.episode.contents[content].path.toString()

    const exLog = {
      logType: 'impression',
      log: {
        logTime,
        userId,
        contentIndex,
        contentId,
        episodeId,
        type,
        path,
        panel
      }
    }
    exLogBundle.push(exLog)
  }

  return exLogBundle
}
