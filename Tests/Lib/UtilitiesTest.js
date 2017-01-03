import test from 'ava'
import { convert2TimeDiffString } from '../../App/Lib/Utilities'

test('convert to time to time diff string', (t) => {
  const datetimeDiff10Sec = 10
  const datetime = new Date(new Date() - datetimeDiff10Sec)
  const datetimeDiffStr = convert2TimeDiffString(datetime.toISOString())
  t.true(datetimeDiffStr.endsWith('초전'))
})
