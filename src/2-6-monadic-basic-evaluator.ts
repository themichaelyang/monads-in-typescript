type Monad<A> = {
  star: <B>(this: Monad<A>, fn: (value: A) => Monad<B>) => Monad<B>
  value: A
}
type Unit<A> = (a: A) => Monad<A>

// type M a = a
type M<A> = A

// This is a bit different than the paper; we need a wrapper object to store the value.
// We could store it in the closure of "star" only, but then we can't easily unwrap the value.
// without producing another monad.
//
// Again, see: https://blog.salrahman.com/posts/2024/11/monads-in-javascript
// unit       :: a → I a
// unit a     = a
const unit: Unit<number> = (a: number): Monad<M<number>> => ({
  // (⋆)      :: M a → (a → M b) → M b
  // a ⋆ k    = k a
	star: (f) => f(a),
	value: a
})

// m ⋆ λa.n
// Typescript: m.star((a) => n(a))
type Term = number | [Term, Term]

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

// answer, error :: Term
// answer = (Div (Div (Con 1972 ) (Con 2 )) (Con 23 ))
let answer: Term = [[1972, 2], 23]
console.log(evaluate(answer).value)

// error = (Div (Con 1)(Con 0))
let error: Term = [1, 0]
console.log(evaluate(error).value)
