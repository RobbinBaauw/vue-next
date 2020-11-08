import Benchmark, { Event, Suite } from 'benchmark'

export interface BenchmarkResult {
  name: string
  category: string
  result: string
  opsPerSecond: number
  extraFields: Record<string, string>
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

      let code = benchmarkFunctions.get((target as any) as Benchmark)
      if (code) {
        code = '```ts\n' + code + '\n```'
      } else {
        code = 'unknown'
      }

      const stats = target.stats
      let opsPerSecond = target.hz ? target.hz : -Infinity
      let deviation = stats ? stats.deviation : -Infinity
      let samples = stats ? stats.sample.length : -Infinity

      const benchmarkResult: BenchmarkResult = {
        // The currently used version of Prettier & the build tools
        // don't support the ?? syntax yet :(
        name: target.name ? target.name : 'unknown',
        category: category,
        result: `${opsPerSecond.toFixed(2)} ops/sec, ±${deviation.toFixed(
          2
        )}%, ${samples} samples`,
        opsPerSecond,
        extraFields: {
          Code: code
        }
      }

      benchmarks.push(benchmarkResult)
    })
    .run()
}

export function printBenchmarks() {
  console.log(`Benchmark results: ${JSON.stringify(benchmarks)}`)
}
