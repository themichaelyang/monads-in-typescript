// 2.1 Variation zero: The basic evaluator

// data Term = Con Int | Div Term Term
type Term = number | [Term, Term]

// eval          :: Term → Int
// eval(Con a)   = a
// eval(Div t u) = eval t ÷ eval u
function evaluate(term: Term): number {
  if (typeof term == 'number') {
    return term
  } else {
    let [t, u] = term
    return Math.floor(evaluate(t) / evaluate(u))
  }
}
// answer, error :: Term
// answer = (Div (Div (Con 1972 ) (Con 2 )) (Con 23 ))
let answer: Term = [[1972, 2], 23]
console.log(evaluate(answer))

// error = (Div (Con 1)(Con 0))
let error: Term = [1, 0]
console.log(evaluate(error))
