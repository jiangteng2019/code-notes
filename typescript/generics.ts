function identity<Type>(arg: Type): Type {
    return arg
}
// 使用泛型函数
identity<string>('123')
identity(123)

let myIdentity: <Type>(arg: Type) => Type = identity

let myIdentity1: <Type extends string>(arg: Type) => Type = identity

myIdentity(1)

function getProperty<T, Key extends keyof T>(obj: T, key: Key) {
    return obj[key]
}

getProperty(window, 'name')

type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean
}
type FeatureFlags = {
    darkMode: () => void
    newUserProfile: () => void
}

type FeatureOptions = OptionsFlags<FeatureFlags>

type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property]
}

type LockedAccount = {
    readonly id: string
    readonly name: string
}

type UnlockedAccount = CreateMutable<LockedAccount>

type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property]
}

type MaybeUser = {
    id: string
    name?: string
    age?: number
}

type Users = Concrete<MaybeUser>

type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
}

interface Person {
    name: string
    age: number
    location: string
}

type LazyPerson = Getters<Person>

// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, 'kind'>]: Type[Property]
}

interface Circle {
    kind: 'circle'
    radius: number
}

type KindlessCircle = RemoveKindField<Circle>

type EventConfig<Events extends { kind: string }> = {
    [E in Events as E['kind']]: (event: E) => void
}

type SquareEvent = { kind: 'square'; x: number; y: number }
type CircleEvent = { kind: 'circle'; radius: number }

type Config = EventConfig<SquareEvent | CircleEvent>

type ExtractPII<Type> = {
    [Property in keyof Type]: Type[Property] extends { pii: true }
        ? true
        : false
}

type DBFields = {
    id: { format: 'incrementing' }
    name: { type: string; pii: true }
}

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>

type Predicate = (x: unknown) => boolean

type t = ReturnType<Predicate>

type Persons = { age: number; name: string; alive: boolean }
type I1 = Persons['age' | 'name']

type I2 = Persons[keyof Persons]

type AliveOrName = 'alive' | 'name'
type I3 = Persons[AliveOrName]

const MyArray = [
    { name: 'Alice', age: 15 },
    { name: 'Bob', age: 23 },
    { name: 'Eve', age: 38 },
]

type Person1 = (typeof MyArray)[number]
type Age = (typeof MyArray)[number]['age']
// Or
type Age2 = Person1['age']
