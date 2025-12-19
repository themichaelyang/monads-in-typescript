// Note to reader: I take some liberties in translating to Typescript,
// trying to prioritize clarity and essence over literal meaning.
//
// For example, I prefer structural typing and use of existing types
// over nominal typing if possible, to closer match how actual Typescript
// might be written. We also won't curry everything.
//
// Typescript is also more restrictive of self-referential types.
//
// In the following, I flatten Raise<Exception extends string> and
// Return<A> into A and Error, respectively.

type Term = number | [Term, Term]

// data M a       = Raise Exception | Return a
// type Exception = String
type M<A> = Error | A

// eval :: Term → M Int
// eval (Con a) = Return a
// eval (Div t u) = case eval t of
//                    Raise e → Raise e
//                    Return a →
//                      case eval u of
//                        Raise e → Raise e
//                        Return b →
//                          if b == 0
//                            then Raise “divide by zero”
//                            else Return (a ÷ b)

function evaluate(term: Term): M<number> {
  if (typeof term == 'number') {
    return term
  } else {
    let [t, u] = term
    let eval_t = evaluate(t)

    if (eval_t instanceof Error) {
      return eval_t
    } else {
      let a = eval_t
      let eval_u = evaluate(u)

      if (eval_u instanceof Error) {
        return eval_u
      } else {
        let b = eval_u

        if (b == 0) {
          return new Error("divide by zero")
        } else {
          return Math.floor(a / b)
        }
      }
    }
  }
}

let answer: Term = [[1972, 2], 23]
console.log(evaluate(answer))

let error: Term = [1, 0]
console.log(evaluate(error))
