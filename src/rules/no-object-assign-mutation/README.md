# `no-object-assign-mutation`

Disallow mutations using `Object.assign()`.

One possible use case of [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) is to mutate an object by assigning properties.

However, mutations using `Object.assign()` is possibly unsafe, because it mutates the object without knowing its type.
For example, it may mutate properties that are marked as `readonly`, or internal properties that are not exposed.

## Examples

👎 Examples of incorrect code for this rule:

``` ts
Object.assign(x, y);
```

👍 Examples of correct code for this rule:

``` ts
Object.assign({}, x);
Object.assign(x);
```

Although the above code is correct, [the object spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) is always a better choice.
You can enable [`prefer-object-spread`](https://eslint.org/docs/latest/rules/prefer-object-spread) to enforce the object spread syntax.

## When Not To Use It

If you really want to mutate an object, disable this rule.
