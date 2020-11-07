import Benchmark, { Event, Suite } from 'benchmark'

export interface BenchmarkResult {
  name: string
  category: string
  code: string
  opsPerSecond: number
  deviation: number
  samples: number
}

const benchmarkFunctions: Map<Benchmark, string> = new Map()
export function bench(cb: () => Suite) {
  const suite = (cb() as any) as Benchmark[]
  const benchmark = suite[suite.length - 1]
  benchmarkFunctions.set(benchmark, cb.toString())
}

const benchmarks: BenchmarkResult[] = []
export function benchmarkCategory(category: string, cb: () => Suite) {
  cb()
    .on('cycle', (event: Event) => {
      const target = event.target

      const code = benchmarkFunctions.get((target as any) as Benchmark)
      const stats = target.stats

      const benchmarkResult: BenchmarkResult = {
        // The currently used version of Prettier & the build tools
        // don't support the ?? syntax yet :(
        name: target.name ? target.name : 'unknown',
        category: category,
        code: code ? code : 'unknown',
        opsPerSecond: target.hz ? target.hz : -Infinity,
        deviation: stats ? stats.deviation : -Infinity,
        samples: stats ? stats.sample.length : -Infinity
      }

      benchmarks.push(benchmarkResult)
    })
    .run()
}

export function printBenchmarks() {
  console.log(JSON.stringify(benchmarks))
}
