import { Suite } from 'benchmark'
import { computed, nextTick, ref, watch, watchEffect } from 'vue'

import { bench } from '../bench'

// Doesn't work otherwise
// eslint-disable-next-line no-restricted-globals
const Benchmark = require('benchmark')

export function benchmarkMix(): Suite {
  const suite = new Benchmark.Suite()

  bench(() => {
    const v = ref(100)
    const c = computed(() => v.value * 2)
    const c2 = computed(() => c.value * 2)
    const v2 = ref(10)

    watch(c2, v => {
      v2.value = v
    })

    watchEffect(() => {
      c.value + v2.value
    })

    return suite.add(
      'mix of dependent refs, computed, watch and watchEffect',
      (deferred: any) => {
        v.value += 50
        nextTick(() => deferred.resolve())
      },
      { defer: true }
    )
  })

  return suite
}
