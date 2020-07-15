import { ErrorCodes, callWithErrorHandling } from './errorHandling'
import { isArray } from '@vue/shared'
import {PriorityQueue} from "./priorityqueue";

export interface Job {
  (): void
  id?: number
}

export type PostFlushCb = Function & {
  order?: number
}

const queue: (Job | null)[] = []
const postFlushCbs: PriorityQueue<Function> = new PriorityQueue()
const p = Promise.resolve()

let isFlushing = false
let isFlushPending = false

const RECURSION_LIMIT = 100
type CountMap = Map<Job | Function, number>

export function nextTick(fn?: () => void): Promise<void> {
  return fn ? p.then(fn) : p
}

export function queueJob(job: Job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

export function invalidateJob(job: Job) {
  const i = queue.indexOf(job)
  if (i > -1) {
    queue[i] = null
  }
}

export function queuePostFlushCb(cb: PostFlushCb | PostFlushCb[]) {
  if (!isArray(cb)) {
    postFlushCbs.push(cb, cb.order ?? 0)
  } else {
    const n = cb.length
    for (let i = 0; i < n; i++) {
      postFlushCbs.push(cb[i], cb[i].order ?? 0)
    }
  }
  queueFlush()
}

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    nextTick(flushJobs)
  }
}

export function flushPostFlushCbs(seen?: CountMap) {
  if (postFlushCbs.size) {
    if (__DEV__) {
      seen = seen || new Map()
    }
    while (postFlushCbs.size) {
      const cb = postFlushCbs.pop()!
      if (__DEV__) {
        checkRecursiveUpdates(seen!, cb)
      }
      cb()
    }
  }
}

const getId = (job: Job) => (job.id == null ? Infinity : job.id)

function flushJobs(seen?: CountMap) {
  isFlushPending = false
  isFlushing = true
  let job
  if (__DEV__) {
    seen = seen || new Map()
  }

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child so its render effect will have smaller
  //    priority number)
  // 2. If a component is unmounted during a parent component's update,
  //    its update can be skipped.
  // Jobs can never be null before flush starts, since they are only invalidated
  // during execution of another flushed job.
  queue.sort((a, b) => getId(a!) - getId(b!))

  while ((job = queue.shift()) !== undefined) {
    if (job === null) {
      continue
    }
    if (__DEV__) {
      checkRecursiveUpdates(seen!, job)
    }
    callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
  }
  flushPostFlushCbs(seen)
  isFlushing = false
  // some postFlushCb queued jobs!
  // keep flushing until it drains.
  if (queue.length || postFlushCbs.size) {
    flushJobs(seen)
  }
}

function checkRecursiveUpdates(seen: CountMap, fn: Job | Function) {
  if (!seen.has(fn)) {
    seen.set(fn, 1)
  } else {
    const count = seen.get(fn)!
    if (count > RECURSION_LIMIT) {
      throw new Error(
        'Maximum recursive updates exceeded. ' +
          "You may have code that is mutating state in your component's " +
          'render function or updated hook or watcher source function.'
      )
    } else {
      seen.set(fn, count + 1)
    }
  }
}
