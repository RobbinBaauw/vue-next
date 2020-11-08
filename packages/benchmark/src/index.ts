import { benchmarkRef } from './ref'
import { benchmarkCategory, printBenchmarks } from './bench'

benchmarkCategory('ref', benchmarkRef)
printBenchmarks()
