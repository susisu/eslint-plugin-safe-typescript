# `no-unsafe-object-property-check`

Disallow possibly unsafe property checks of object.

[The `in` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in) can narrow types, but it is not always safe.

For example, suppose we have a union type `Data` and a function that reads it.

```ts
type Data = { foo: number } | { bar: string };

function myFunc(data: Data): void {
  if ("foo" in data) {
    const foo: number = data.foo;
    // ...
  } else {
    const bar: string = data.bar;
    // ...
  }
}
```

Since the `in` operator narrows the type of `data`, we can access `data.foo` and `data.bar`.

However, you can call `myFunc()` like below, as the argument matches the `{ bar: string }` case.

```ts
const myData = { foo: "xxx", bar: "yyy" };
myFunc(myData);
```

It's clear that this does not work correctly, because `myData` is treated as `{ foo: number }` in the function.

To remedy this, you should define `Data` as a [discriminated (tagged) union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions), and use the tag to narrow the type of `data`.

```ts
type Data = { type: "foo"; value: number } | { type: "bar"; value: string };

function myFunc(data: Data): void {
  if (data.type === "foo") {
    const foo: number = data.value;
    // ...
  } else {
    const bar: string = data.value;
    // ...
  }
}
```

## Examples

👎 Examples of incorrect code for this rule:

```ts
declare const counts: { foo: number } | { bar: string };
"foo" in counts;
```

👍 Examples of correct code for this rule:

```ts
declare const anyValue: any;
"foo" in anyValue;

declare const nonPrimitiveValue: object;
"foo" in nonPrimitiveValue;

declare const dictionary: { [key: string]: number };
"foo" in dictionary;
```

## When Not To Use It

If you don't care about this kind of type safety, disable this rule.
