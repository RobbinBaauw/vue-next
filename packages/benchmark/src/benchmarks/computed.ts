import { Suite } from 'benchmark'
import { computed, ComputedRef, Ref, ref } from 'vue'

import { bench } from '../bench'

// Doesn't work otherwise
// eslint-disable-next-line no-restricted-globals
const Benchmark = require('benchmark')

export function benchmarkComputed(): Suite {
  const suite = new Benchmark.Suite()

  bench(() => {
    return suite.add('create computed', () => {
      computed(() => 100)
    })
  })

  bench(() => {
    let i = 0
    const o = ref(100)
    return suite.add('write independent ref dep', () => {
      o.value = i++
    })
  })

  bench(() => {
    const v = ref(100)
    computed(() => {
      return v.value * 2
    })
    let i = 0
    return suite.add("write ref, don't read computed (never invoked)", () => {
      v.value = i++
    })
  })

  bench(() => {
    const v = ref(100)
    const c = computed(() => {
      return v.value * 2
    })
    c.value
    let i = 0
    return suite.add("write ref, don't read computed (invoked)", () => {
      v.value = i++
    })
  })

  bench(() => {
    const v = ref(100)
    const c = computed(() => {
      return v.value * 2
    })
    let i = 0
    return suite.add('write ref, read computed', () => {
      v.value = i++
      c.value
    })
  })

  bench(() => {
    const v = ref(100)
    const computeds = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      computeds.push(c)
    }
    let i = 0
    return suite.add(
      "write ref, don't read 1000 computeds (never invoked)",
      () => {
        v.value = i++
      }
    )
  })

  bench(() => {
    const v = ref(100)
    const computeds = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      c.value
      computeds.push(c)
    }
    let i = 0
    return suite.add("write ref, don't read 1000 computeds (invoked)", () => {
      v.value = i++
    })
  })

  bench(() => {
    const v = ref(100)
    const computeds: Array<ComputedRef> = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      c.value
      computeds.push(c)
    }
    let i = 0
    return suite.add('write ref, read 1000 computeds', () => {
      v.value = i++
      computeds.forEach(c => c.value)
    })
  })

  bench(() => {
    const refs: Array<Ref> = []
    for (let i = 0, n = 1000; i < n; i++) {
      refs.push(ref(i))
    }
    const c = computed(() => {
      let total = 0
      refs.forEach(ref => (total += ref.value))
      return total
    })
    let i = 0
    const n = refs.length
    return suite.add('1000 refs, 1 computed', () => {
      refs[i++ % n].value++
      c.value
    })
  })

  return suite
}
