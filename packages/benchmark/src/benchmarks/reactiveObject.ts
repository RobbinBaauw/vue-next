import { Suite } from 'benchmark'
import { computed, ComputedRef, reactive } from 'vue'

import { bench } from '../bench'

// Doesn't work otherwise
// eslint-disable-next-line no-restricted-globals
const Benchmark = require('benchmark')

export function benchmarkReactiveObject(): Suite {
  const suite = new Benchmark.Suite()

  bench(() => {
    return suite.add('create reactive obj', () => {
      reactive({ a: 1 })
    })
  })

  bench(() => {
    let i = 0
    const r = reactive({ a: 1 })
    return suite.add('write reactive obj property', () => {
      r.a = i++
    })
  })

  bench(() => {
    const r = reactive({ a: 1 })
    computed(() => {
      return r.a * 2
    })
    let i = 0
    return suite.add(
      "write reactive obj, don't read computed (never invoked)",
      () => {
        r.a = i++
      }
    )
  })

  bench(() => {
    const r = reactive({ a: 1 })
    const c = computed(() => {
      return r.a * 2
    })
    c.value
    let i = 0
    return suite.add(
      "write reactive obj, don't read computed (invoked)",
      () => {
        r.a = i++
      }
    )
  })

  bench(() => {
    const r = reactive({ a: 1 })
    const c = computed(() => {
      return r.a * 2
    })
    let i = 0
    return suite.add('write reactive obj, read computed', () => {
      r.a = i++
      c.value
    })
  })

  bench(() => {
    const r = reactive({ a: 1 })
    const computeds = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return r.a * 2
      })
      computeds.push(c)
    }
    let i = 0
    return suite.add(
      "write reactive obj, don't read 1000 computeds (never invoked)",
      () => {
        r.a = i++
      }
    )
  })

  bench(() => {
    const r = reactive({ a: 1 })
    const computeds = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return r.a * 2
      })
      c.value
      computeds.push(c)
    }
    let i = 0
    return suite.add(
      "write reactive obj, don't read 1000 computeds (invoked)",
      () => {
        r.a = i++
      }
    )
  })

  bench(() => {
    const r = reactive({ a: 1 })
    const computeds: Array<ComputedRef> = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return r.a * 2
      })
      computeds.push(c)
    }
    let i = 0
    return suite.add('write reactive obj, read 1000 computeds', () => {
      r.a = i++
      computeds.forEach(c => c.value)
    })
  })

  bench(() => {
    const reactives: Array<Record<any, any>> = []
    for (let i = 0, n = 1000; i < n; i++) {
      reactives.push(reactive({ a: i }))
    }
    const c = computed(() => {
      let total = 0
      reactives.forEach(r => (total += r.a))
      return total
    })
    let i = 0
    const n = reactives.length
    return suite.add('1000 reactive objs, 1 computed', () => {
      reactives[i++ % n].a++
      c.value
    })
  })

  return suite
}
