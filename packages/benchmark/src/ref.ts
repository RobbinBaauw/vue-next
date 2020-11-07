import { Suite } from 'benchmark'
import { ref } from 'vue'

import { bench } from './bench'

// Doesn't work otherwise
// eslint-disable-next-line no-restricted-globals
const Benchmark = require('benchmark')

export function benchmarkRef(): Suite {
  const suite = new Benchmark.Suite()

  bench(() => {
    return suite.add('create ref', () => {
      ref(100)
    })
  })

  bench(() => {
    let i = 0
    const v = ref(100)
    return suite.add('write ref', () => {
      v.value = i++
    })
  })

  bench(() => {
    const v = ref(100)
    return suite.add('read ref', () => {
      v.value
    })
  })

  bench(() => {
    let i = 0
    const v = ref(100)
    return suite.add('write/read ref', () => {
      v.value = i++
      v.value
    })
  })

  return suite
}
