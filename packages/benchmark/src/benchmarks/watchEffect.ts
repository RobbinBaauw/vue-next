import { Suite } from 'benchmark'
import { nextTick, ref, watchEffect } from 'vue'

import { bench } from '../bench'

// Doesn't work otherwise
// eslint-disable-next-line no-restricted-globals
const Benchmark = require('benchmark')

export function benchmarkWatchEffect(): Suite {
  const suite = new Benchmark.Suite()

  bench(() => {
    return suite.add('create watchEffect', () => {
      watchEffect(() => {})
    })
  })

  bench(() => {
    const v = ref(100)
    watchEffect(() => {
      v.value
    })
    let i = 0
    return suite.add(
      'update ref to trigger watchEffect (scheduled but not executed)',
      () => {
        v.value = i++
      }
    )
  })

  bench(() => {
    const v = ref(100)
    watchEffect(() => {
      v.value
    })
    let i = 0
    return suite.add(
      'update ref to trigger watchEffect (executed)',
      (deferred: any) => {
        v.value = i++
        nextTick(() => deferred.resolve())
      },
      { defer: true }
    )
  })

  return suite
}
