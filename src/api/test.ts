//TS type gymnastics || TS 体操

//if Array
type isArray<T> = T extends any[] ? true : false

type a = isArray<[1, 2, 3]> // true
type b = isArray<'hello'> // false

//K在O里返回O[K]，否则返回undefined
type getProp<K, O> = K extends keyof O ? O[K] : never
//一样的
type getName<User> = 'name' extends keyof User ? User['name'] : never

//遍历思路：使用递归
type Loop<List> = List extends [infer First, ...infer Rest] ? Loop<Rest> : never

//实现map
type Mapp<List> = List extends [infer First, ...infer Rest] ? [{ name: First }, ...Mapp<Rest>] : []

type mappTest = Mapp<[1, 2, 3]>

//实现filter
type myFilter<List> = List extends [infer First, ...infer Rest]
  ? First extends number
    ? [First, ...myFilter<Rest>]
    : [...myFilter<Rest>]
  : []

type filterTest = myFilter<[1, 2, 3, 'hello', 'world']> //[1, 2, 3]

//从一个数组里面取前N个作为output
type Take<Tuple, N, Output extends any[] = []> = Tuple extends [infer First, ...infer Rest]
  ? Output['length'] extends N
    ? Output
    : Take<Rest, N, [...Output, First]>
  : Output

type takeTest = Take<[1, 2, 3, 4], 3> //1, 2, 3

//自己实现myPick
type myPick<Object, range extends keyof Object> = {
  [P in range]: Object[P]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

type myPickTest = myPick<Todo, 'title' | 'completed'>

//自己写一个readOnly
type MyReadOnly<T> = {
  readonly [P in keyof T]: T[P]
}

//元祖转换为对象
type TupleToObject<T extends readonly any[]> = {
  [key in T[number]]: key
}

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
type result = TupleToObject<typeof tuple> // expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

//第一个元素
type First<T extends any[]> = T extends [infer First, ...infer Rest] ? First : []

type arr1 = ['a', 'b', 'c']
type head1 = First<arr1> // 应推导出 'a'

//获取数组长度
type Length<T extends any[]> = T['length']

type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']
type spaceXLength = Length<spaceX> // expected 5

//从联合类型 T 中排除 U 中的类型，来构造一个新的类型
//联合类型会把条件表达式应用到每一个联合类型中的类型项里
type MyExclude<T, U extends T> = T extends U ? never : T

type excludeTest = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'

//假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。
// 在 TS 中，我们用 Promise 中的 T 来描述这个 Promise 返回的类型。
// 请你实现一个类型，可以获取这个类型。
//Promise里面也可能是promise
type MyAwaited<T extends Promise<unknown>> =
  T extends Promise<infer X> ? (X extends Promise<unknown> ? MyAwaited<X> : X) : never

type ExampleType = Promise<string>
type Result = MyAwaited<ExampleType> // string

//实现一个 IF 类型，它接收一个条件类型 C ，一个判断为真时的返回类型 T ，以及一个判断为假时的返回类型 F。 C 只能是 true 或者 false， T 和 F 可以是任意类型。
type If<C, T, F> = C extends true ? T : F

type A = If<true, 'a', 'b'> // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'

//在类型系统里实现 JavaScript 内置的 Array.concat 方法，
// 这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。
type Concat<a1 extends readonly any[], a2 extends readonly any[]> = [...a1, ...a2]

type concatTest = Concat<[1], [2]> // expected to be [1, 2]

//在类型系统里实现 JavaScript 的 Array.includes 方法，这个类型接受两个参数，返回的类型要么是 true 要么是 false。
type Includes<T extends readonly unknown[], U> = T extends [infer First, ...infer Rest]
  ? First extends true
    ? true
    : Includes<Rest, U>
  : false

type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
type isPillarMen2 = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'> // expected to be `true`

//在类型系统里实现通用的 Array.push
type Push<T extends unknown[], U> = [...T, U]

type pushResult = Push<[1, 2], '3'> // [1, 2, '3']

//实现内置的 Parameters 类型，而不是直接使用它，可参考TypeScript官方文档。
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer X) => any ? [...X] : []

const foo = (arg1: string, arg2: number): void => {}
type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
