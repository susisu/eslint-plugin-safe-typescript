# `no-unsafe-object-property-overwrite`

Disallow possibly unsafe overwrites of object properties.

[The object spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) enumerates and copies an object's own properties, but it may contain properties that do not appear in the object's type.

For example, suppose we have a type `Data`, and `DataWithMetadata` that extends `Data`.

``` ts
type Data = {
  foo: number;
  bar: number;
};

type DataWithMetadata = Data & {
  metadata: string;
};

function withMetadata(data: Data, metadata: string): DataWithMetadata {
  return { metadata, ...data };
}

const dataA = { foo: 0, bar: 1 };
// metaA = "xxx"
const metaA: string = withMetadata(dataA, "xxx").metadata;
```

This seems pretty good.
However, the definition of `withMetadata()` is actually unsafe, because it allows overwriting `metadata` with the properties of `data`.

``` ts
const dataB = { foo: 0, bar: 1, metadata: 666 };
// metaB = 666
const metaB: string = withMetadata(dataB, "xxx").metadata;
```

To fix the function, use the spread syntax at the beginning of the object literal.

``` ts
function withMetadata(data: Data, metadata: string): DataWithMetadata {
  // Write `...data` first so that it will not overwrite `metadata`.
  return { ...data, metadata };
}
```

The same applies to [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

``` ts
function withMetadata(data: Data, metadata: string): DataWithMetadata {
  // Don't do `Object.assign({ metadata }, data)`
  return Object.assign({ ...data }, { metadata });
}
```

## Examples

👎 Examples of incorrect code for this rule:

``` ts
declare const x: { foo: number; bar: number };

({ a: 0, ...x, b: 1 });
({ a: 0, b: 1, ...x });
({ a: 0, b: 1, ...{ ...x, c: 1, d: 2 } });

Object.assign({ a: 0 }, x, { b: 1 });
Object.assign({ a: 0, b: 1 }, x);
Object.assign({ a: 0, b: 1 }, { ...x, c: 1, d: 2 });
```

👍 Examples of correct code for this rule:

``` ts
declare const x: { foo: number; bar: number };

({ ...x });
({ ...x, a: 0, b: 1 });
({ a: 0, b: 1, ...{ c: 2, d: 3, ...{ e: 4, f: 5 } } });

Object.assign(x);
Object.assign(x, { a: 0, b: 1 });
Object.assign({ a: 0, b: 1 }, { c: 2, d: 3, ...{ e: 4, f: 5 } });

declare const anyValue: any;

({ a: 0, b: 1, ...anyValue });
Object.assign({ a: 0, b: 1 }, anyValue);

declare const countsA: { [key: string]: number };
declare const countsB: { [key: string]: number };

({ ...countsA, ...countsB });
```

## Options
### `allowIndexSignatures`

default = `true`

When set to `true`, allows object spreads in any position if the object's type has only [index signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) like `{ [key: string]: number }`.

If the type has index signatures, object spreads are safe in most cases, while there are still some cases where it becomes unsafe.
For example:

``` ts
const countsA: { [key: string]: number } = {
  foo: 1,
  bar: 2,
};

const x = {
  baz: 3,
  metadata: "xxx",
};
const y: { baz: number } = x;
const countsB: { [key: string]: number } = y;

// counts["metadata"] = "xxx" but its type is number
const counts: { [key: string]: number } = { ...countsA, ...countsB };
```

👎 Examples of incorrect code for the `{ "allowIndexSignatures": false }` option:

``` ts
declare const countsA: { [key: string]: number };
declare const countsB: { [key: string]: number };

({ ...countsA, ...countsB });
```

## When Not To Use It

If you don't care about this kind of type safety, disable this rule.

If it is ensured that the object does not contain unknown properties i.e. all the properties appear in its type, you can safely disable this rule for that specific case.
