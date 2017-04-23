const poolSize = 4
const taskQueue = []
const taskPool = []
const taskCheckIntervalInMillis = 100

const jobMap = new Map()

export const getExecutor = () => {
  const jobId = 'job' + '-' + taskQueue.length + new Date().valueOf()
  const job = new Map()
  console.tron.log('job id ' + jobId)
  job.set('state', null)
  jobMap.set(jobId, job)
  taskQueue.push(jobId)

  const promise = new Promise(function (resolve, reject) {
    const intervalId = setInterval(() => {
      if (jobMap.has(jobId)) {
        const jb = jobMap.get(jobId)
        if (jb.get('state') === true) {
          window.clearInterval(intervalId)
          resolve('done')
        } else if (jb.get('state') === false) {
          window.clearInterval(intervalId)
          reject('error')
        }
      } else {
        window.clearInterval(intervalId)
        reject('error')
      }
    }, taskCheckIntervalInMillis)
  })

  return promise
}

const init = () => {
  setInterval(() => {
    if (!(taskPool.length >= poolSize)) runTasks()
  }, taskCheckIntervalInMillis)
}

export default init

const runTasks = () => {
  const tpSize = taskPool.length
  if (!(tpSize >= poolSize)) {
    for (var i = 0; i < poolSize - tpSize; i++) {
      runJob()
    }
  }
}

// recursive run job
const runJob = () => {
  const jobId = taskQueue.shift()
  if (jobId == null) return
  taskPool.push(jobId)
  console.tron.log(jobId)
  jobMap.get(jobId).set('state', true)
}

export const jobDone = () => {
  return taskPool.shift()
}
