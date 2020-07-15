// Taken from https://github.com/luciopaiva/heapify/blob/master/heapify.mjs

// Tweaked to not allow dupes and to be stable

// this is just to make it clear that we are using a 1-based array; changing it to zero won't work without code changes
const ROOT_INDEX = 1

export class PriorityQueue<T> {
  private length = 0

  private readonly keys: T[]
  private readonly priorities: { priority: number; count: number }[]
  private insertCount = 0

  private readonly insertedItems: Set<T> = new Set()

  constructor(private _capacity = 64) {
    this.keys = Array(_capacity + ROOT_INDEX)
    this.priorities = Array(_capacity + ROOT_INDEX)
  }

  get capacity() {
    return this._capacity
  }

  public clear() {
    this.length = 0
  }

  /**
   * Bubble an item up until its heap property is satisfied.
   */
  private bubbleUp(index: number) {
    const key = this.keys[index]
    const priority = this.priorities[index]

    while (index > ROOT_INDEX) {
      // get its parent item
      const parentIndex = index >>> 1
      const currPriority = this.priorities[parentIndex]
      if (
        currPriority.priority < priority.priority ||
        (currPriority.priority === priority.priority &&
          currPriority.count < priority.count)
      ) {
        break // if parent priority is smaller, heap property is satisfied
      }
      // bubble parent down so the item can go up
      this.keys[index] = this.keys[parentIndex]
      this.priorities[index] = currPriority

      // repeat for the next level
      index = parentIndex
    }

    // we finally found the place where the initial item should be; write it there
    this.keys[index] = key
    this.priorities[index] = priority
  }

  /**
   * Bubble an item down until its heap property is satisfied.
   */
  private bubbleDown(index: number) {
    const key = this.keys[index]
    const priority = this.priorities[index]

    const halfLength = ROOT_INDEX + (this.length >>> 1) // no need to check the last level
    const lastIndex = this.length + ROOT_INDEX
    while (index < halfLength) {
      const left = index << 1
      if (left >= lastIndex) {
        break // index is a leaf node, no way to bubble down any further
      }

      // pick the left child
      let childPriority = this.priorities[left]
      let childKey = this.keys[left]
      let childIndex = left

      // if there's a right child, choose the child with the smallest priority
      const right = left + 1
      if (right < lastIndex) {
        const rightPriority = this.priorities[right]
        if (rightPriority.priority < childPriority.priority) {
          childPriority = rightPriority
          childKey = this.keys[right]
          childIndex = right
        }
      }

      if (
        childPriority.priority > priority.priority ||
        (childPriority.priority === priority.priority &&
          childPriority.count > priority.count)
      ) {
        break // if children have higher priority, heap property is satisfied
      }

      // bubble the child up to where the parent is
      this.keys[index] = childKey
      this.priorities[index] = childPriority

      // repeat for the next level
      index = childIndex
    }

    // we finally found the place where the initial item should be; write it there
    this.keys[index] = key
    this.priorities[index] = priority
  }

  /**
   * @param {*} key the identifier of the object to be pushed into the heap
   * @param {Number} priority 32-bit value corresponding to the priority of this key
   */
  public push(key: T, priority: number) {
    if (this.insertedItems.has(key)) {
      return
    }
    this.insertedItems.add(key)
    if (this.length === this._capacity) {
      throw new Error("Heap has reached capacity, can't push new items")
    }
    const pos = this.length + ROOT_INDEX
    this.keys[pos] = key
    this.priorities[pos] = {
      priority,
      count: this.insertCount
    }
    this.insertCount++
    this.bubbleUp(pos)
    this.length++
  }

  public pop() {
    if (this.length === 0) {
      return undefined
    }
    const key = this.keys[ROOT_INDEX]

    this.length--

    if (this.length > 0) {
      this.keys[ROOT_INDEX] = this.keys[this.length + ROOT_INDEX]
      this.priorities[ROOT_INDEX] = this.priorities[this.length + ROOT_INDEX]

      this.bubbleDown(ROOT_INDEX)
    }

    this.insertedItems.delete(key)

    return key
  }

  public peekPriority() {
    return this.priorities[ROOT_INDEX]
  }

  public peek() {
    return this.keys[ROOT_INDEX]
  }

  get size() {
    return this.length
  }

  toString() {
    if (this.length === 0) {
      return '(empty queue)'
    }

    const result = Array(this.length - ROOT_INDEX)
    for (let i = 0; i < this.length; i++) {
      result[i] = this.priorities[i + ROOT_INDEX]
    }
    return `[${result.join(' ')}]`
  }
}
