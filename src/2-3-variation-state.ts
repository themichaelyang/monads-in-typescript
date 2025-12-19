type Term = number | [Term, Term]

// type M a = State → (a, State)
// type State = Int

type M<A> = (state: State) => [A, State]
type State = number

// eval            :: Term → M Int
// eval(Con a) x   = (a, x)
// eval(Div t u) x = let (a, y) = eval t x in
//                   let (b, z) = eval u y in
//                   (a ÷ b, z + 1)

function evaluate(term: Term): M<number> {
  if (typeof term == 'number') {
    return (x) => [term, x]
  } else {
    return (x) => {
      let [t, u] = term
      let [a, y] = evaluate(t)(x)
      let [b, z] = evaluate(u)(y)

      return [Math.floor(a / b), z + 1]
    }
  }
}

let answer: Term = [[1972, 2], 23]
console.log(evaluate(answer)(0))
