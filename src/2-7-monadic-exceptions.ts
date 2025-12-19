// We swap the object type for a class interface to allow for
// a "this" reference in the star/bind method to keep it looking
// like an infix operator. We also add a second generic type for the
// actual type of the monad.
interface Monadic<A, V> {
  star<B>(f: (value: A) => Monadic<B, V>): Monadic<B, V>
  value: V
}

type Term = number | [Term, Term]

// data M a         = Raise Exception | Return a
// type Exception   = String
type Ma = Error | number

class M implements Monadic<number, Ma> {
  value: Ma

  constructor(value: Ma) {
    this.value = value
  }

  // unit   :: a → M a
  // unit a = Return a
  static unit(value: number): Monadic<number, Ma> {
    return new M(value)
  }

  // raise   :: Exception → M a
  // raise e = Raise e
  static raise(err: Error): Monadic<number, Ma> {
    return new M(err)
  }

  star(fn: (a: number) => Monadic<any, Ma>) {
    if (this.value instanceof Error) {
      return M.raise(this.value)
    } else {
      return fn(this.value)
    }
  }
}

function evaluate(term: Term): Monadic<number, Ma> {
  if (typeof term == 'number') {
    return M.unit(term)
  } else {
    let [t, u] = term
    return evaluate(t).star(a => evaluate(u).star(b => {
      if (b == 0) {
        return M.raise(new Error("division by zero"))
      } else {
        return M.unit(Math.floor(a / b))
      }
    }))
  }
}

let answer: Term = [[1972, 2], 23]
console.log(evaluate(answer).value)

let error: Term = [1, 0]
console.log(evaluate(error).value)
