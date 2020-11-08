import { Suite } from 'benchmark'
import { nextTick, ref, watch } from 'vue'

import { bench } from '../bench'

// Doesn't work otherwise
// eslint-disable-next-line no-restricted-globals
const Benchmark = require('benchmark')

export function benchmarkWatch(): Suite {
  const suite = new Benchmark.Suite()

  bench(() => {
    return suite.add('create watcher', () => {
      const v = ref(100)
      watch(v, v => {})
    })
  })

  bench(() => {
    const v = ref(100)
    watch(v, v => {})
    let i = 0
    return suite.add(
      'update ref to trigger watcher (scheduled but not executed)',
      () => {
        v.value = i++
      }
    )
  })

  bench(() => {
    const v = ref(100)
    watch(v, v => {})
    let i = 0

    return suite.add(
      'update ref to trigger watcher (executed)',
      (deferred: any) => {
        v.value = i++
        nextTick(() => deferred.resolve())
      },
      { defer: true }
    )
  })

  return suite
}
