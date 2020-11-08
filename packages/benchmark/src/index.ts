import { benchmarkRef } from './benchmarks/ref'
import { benchmarkCategory, printBenchmarks } from './bench'
import { benchmarkComputed } from './benchmarks/computed'
import { benchmarkMix } from './benchmarks/mix'
import { benchmarkReactiveMap } from './benchmarks/reactiveMap'
import { benchmarkReactiveObject } from './benchmarks/reactiveObject'
import { benchmarkWatch } from './benchmarks/watch'
import { benchmarkWatchEffect } from './benchmarks/watchEffect'

benchmarkCategory('computed', benchmarkComputed)
benchmarkCategory('mix', benchmarkMix)
benchmarkCategory('reactiveMap', benchmarkReactiveMap)
benchmarkCategory('reactiveObject', benchmarkReactiveObject)
benchmarkCategory('ref', benchmarkRef)
benchmarkCategory('watch', benchmarkWatch)
benchmarkCategory('watchEffect', benchmarkWatchEffect)

printBenchmarks()
