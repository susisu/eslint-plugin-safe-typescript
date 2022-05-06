# `no-object-assign`

Disallow the use of `Object.assign()`.

The possible usage of the [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method one of the following cases:

1. To copy an object.
2. To mutate an object by assigning properties.

For the first case, [the object spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) is always the better choice.

For the second case, it is possibly unsafe because `Object.assign()` mutates the object without knowing its type.
For example, it may mutate properties that are marked as `readonly`, or internal properties that should not be exposed.

## Examples

👎 Examples of incorrect code for this rule:

``` ts
Object.assign({}, x);
Object.assign(x, y);
```

👍 Examples of correct code for this rule:

``` ts
Object.assign;
```

## When Not To Use It

If you really want to mutate an object, disable this rule.
