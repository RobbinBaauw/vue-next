import { benchmarkRef } from './ref'
import { Event } from 'benchmark'

benchmarkRef()
  .on('cycle', (event: Event) => {
    // Output benchmark result by converting benchmark result to string
    console.log(String(event.target))
  })
  .run()
