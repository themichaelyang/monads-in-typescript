// We'll adapt this representation: https://blog.salrahman.com/posts/2024/11/monads-in-javascript
//
// Our Monads are structural, rather than nominal, so we can chain Monads of different types, unlike
// in the paper where star and bind are restricted to type M (but polymorphic over the inner generic)
//
// Again, we won't curry our "star"/bind function.

type Monad<A> = {
  star: <B>(this: Monad<A>, fn: (value: A) => Monad<B>) => Monad<B>
}
type Unit<A> = (a: A) => Monad<A>

// m ⋆ λa.n
// Typescript: m.star((a) => n(a))
type Term = number | [Term, Term]

// This is a template; need to fill in unit and star based on the evaluator.
let unit: Unit<number> = undefined as any as Unit<number>

// eval            :: Term → M Int
// eval(Con a)     = unit a
// eval(Div t u)   = eval t ⋆ λa.eval u ⋆ λb.unit(a ÷ b)
function evaluate(term: Term): Monad<number> {
  if (typeof term == 'number') {
    return unit(term)
  } else {
    let [t, u] = term
    return evaluate(t).star(a => evaluate(u).star(b => unit(Math.floor(a / b))))
  }
}
