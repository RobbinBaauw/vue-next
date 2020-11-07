// Doesn't work otherwise
// eslint-disable-next-line no-restricted-globals
const Benchmark = require('benchmark')
import { ref } from 'vue'

export function benchmarkRef() {
  const suite = new Benchmark.Suite()

  {
    suite.add('create ref', () => {
      ref(100)
    })
  }

  {
    let i = 0
    const v = ref(100)
    suite.add('write ref', () => {
      v.value = i++
    })
  }

  {
    const v = ref(100)
    suite.add('read ref', () => {
      v.value
    })
  }

  {
    let i = 0
    const v = ref(100)
    suite.add('write/read ref', () => {
      v.value = i++
      v.value
    })
  }

  return suite
}
