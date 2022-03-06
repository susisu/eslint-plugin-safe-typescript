# no-unsafe-object-enum-method

Disallow possibly unsafe property enumeration methods of `Object`.

`Object.keys()`, `Object.values()`, and `Object.entries()` enumerates an object's own properties, but it may contain properties that do not appear in the object's type.

Suppose we have a type `Counts` and a function that reads it.

``` ts
type Counts = {
  foo: number;
  bar: number;
  baz: number;
};

function myFunc(counts: Counts): void {
  const keys: string[] = Object.keys(counts);
  const values: number[] = Object.values(counts);
  const entries: [string, number][] = Object.entries(counts);
  // ...
}
```

You can call `myFunc()` with an object that has additional properties.

``` ts
const countsWithMetadata = {
  foo: 1,
  bar: 2,
  baz: 3,
  metadata: "xxx",
};
myFunc(countsWithMetadata);
```

Then the following problems will occur:

- `keys` contains `"metadata"`, but people usually don't pay attention to it.
- `values` contains `"xxx"`, but it is typed as `number[]`.
- `entries` contains `["metadata", "xxx"]`, but it is typed as `[string, number][]`.

To avoid these problems, enumerate only known properties of the object like below:

``` ts
const countKeys = ["foo", "bar", "baz"] as const;
type CountKey = typeof countKeys[number];
// The same type as before
type Counts = { [K in CountKey]: number };

function myFunc(counts: Counts): void {
  // Use only known keys of Counts i.e. countKeys
  const keys = countKeys;
  const values = countKeys.map(key => counts[key]);
  const entrie = countKeys.map(key => [key, counts[key]]);
  // ...
}
```

## Rule Details
This rule aims to disallow the possibly unsafe use of `Object.keys()`, `Object.values()`, and `Object.entries()`.

👎 Examples of incorrect code for this rule:

``` ts
declare const counts: { foo: number; bar: number; baz: number };

Object.keys(counts);
Object.values(counts);
Object.entries(counts);
```

👍 Examples of correct code for this rule:

``` ts
declare const anyValue: any;

Object.keys(anyValue);
Object.values(anyValue);
Object.entries(anyValue);

declare const nonPrimitiveValue: object;

Object.keys(nonPrimitiveValue);
Object.values(nonPrimitiveValue);
Object.entries(nonPrimitiveValue);

declare const dictionary: { [key: string]: number };

Object.keys(dictionary);
Object.values(dictionary);
Object.entries(dictionary);
```

## Options
### `allowIndexSignatures`
When set to `true`, allows `Object.keys()`, `Object.values()`, and `Object.entries()` if the object's type has an index signature like `{ [key: string]: number }` (default = `true`).

If the type has an index signature, enumerating properties is safe in most cases.
However, there are still some cases where it becomes unsafe.
For example:

``` ts
const countsWithMetadata = {
  foo: 1,
  bar: 2,
  baz: 3,
  metadata: "xxx",
};
const counts: { foo: number; bar: number; baz: number } = countsWithMetadata;
const dictionary: { [key: string]: number } = counts;

Object.keys(dictionary);
Object.values(dictionary);
Object.entries(dictionary);
```

👎 Examples of incorrect code for the `{ "allowIndexSignatures": false }` option:

``` ts
declare const dictionary: { [key: string]: number };

Object.keys(dictionary);
Object.values(dictionary);
Object.entries(dictionary);
```

## When Not To Use It
If you don't care about this kind of type safety, disable this rule.

If it is ensured that the argument object does not contain unknown properties i.e. all the properties appear in its type, you can safely disable this rule for that specific case.

