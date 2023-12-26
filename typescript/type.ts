type F = {
    name: 'parse',
    (s: string): number,
    new(n: number): number,
}


function firstElement<T>(params: Array<T>): T | undefined {
    return params[0];
}

declare function lastElement<T>(params: T[]): T | undefined;


type Trans<Input, Output> = {
    (t: Input): Output
}

function map<T, K>(args: T[], func: Trans<T, K>): K[] {
    return args.map(func);
}

type User = {
    id: number;
    kind: string;
};

function makeCustomer<T extends User>(u: T): T {
    // Error（TS 编译器版本：v4.4.2）
    // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
    // '{ id: number; kind: string; }' is assignable to the constraint of type 'T', 
    // but 'T' could be instantiated with a different subtype of constraint 'User'.
    return {
        id: u.id,
        kind: 'customer'
    } as T
}

function f(a: string | number, b: string | number) {
    if (typeof a === 'string' || typeof b === 'string') {
        return a + ':' + b; // no error but b can be number!
    } else {
        return a + b; // error as b can be number | string
    }
}

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b') // Ok


function minimumLength<Type extends { length: number }>(
    obj: Type,
    minimum: number
): Type {
    if (obj.length >= minimum) {
        return obj;
    } else {
        return obj;
    }
}


function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
    return arr1.concat(arr2);
}

const arr = combine<string | number>([1, 2, 3], ["hello"]);


declare function ff(x?: number): void;
// cut
// All OK
ff();
ff(10);
ff(undefined);

declare function len(s: string): number;
declare function len(s: string | Array<number>): number;
declare function len(arr: any[]): number;

len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);

interface Person {
    name: string;
    age: number;
}

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

let writablePerson: Person = {
    name: "Person McPersonface",
    age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'


declare function getReadOnlyStringArray(): ReadonlyStringArray;

interface ReadonlyStringArray {
    readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = getReadOnlyStringArray();

// myArray[2] = "Mallory";


interface BasicAddress {
    name?: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
    unit: string;
}

let x: readonly string[] = [];
let y: string[] = [];

let point: [number, number] = [3, 4];

function distanceFromOrigin([x, y]: [number, number]) {
    return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);