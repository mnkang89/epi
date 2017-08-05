import { getAccountId } from '../Auth'
import moment from 'moment'

export const impressionLogGenerator = (contentMeta, index, panel) => {
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
