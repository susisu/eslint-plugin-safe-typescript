# `no-type-assertion`

Disallow type assertions like `x as T` and `<T>x`.

Because downcasting is allowed, type assertions are possibly unsafe.

``` ts
const obj = { foo: 42 } as { foo: number; bar: number };
obj.bar.toString(); // runtime error!
```

Although upcasting is still safe, you basically don't need to write type assertions for such cases.

## Examples

👎 Examples of incorrect code for this rule:

``` ts
const a = { foo: 42 } as { foo: number; bar: number };
const b = { foo: 42 } as never;
// The following expressions are actually safe, but reported as incorrect.
const c = { foo: 42 } as { foo: number };
const d = { foo: 42 } as {};
```

``` ts
const a = <{ foo: number; bar: number }>{ foo: 42 };
const b = <never>{ foo: 42 };
const c = <{ foo: number }>{ foo: 42 };
const d = <{}>{ foo: 42 };
```

👍 Examples of correct code for this rule:

``` ts
// `as const` is a special expression, and it's safe
const x = { foo: 42 } as const;
// `as unknown` is safe
const y = { foo: 42 } as unknown;
// `as any` is unsafe, but that is because of `any`, not `as`
const z = { foo: 42 } as any;
```

``` ts
const x = <const>{ foo: 42 };
const y = <unknown>{ foo: 42 };
const z = <any>{ foo: 42 };
```

## When Not To Use It

If you use type assertions to avoid type checking intentionally, you may disable this rule.
