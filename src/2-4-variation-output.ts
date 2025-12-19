type Term = number | [Term, Term]

// type M a = (Output, a)
// type Output = String

type M<A> = [Output, A]
type Output = string

// eval          :: Term → M Int
// eval(Con a)   = (line(Con a) a, a)
// eval(Div t u) = let (x, a) = eval t in
//                 let (y, b) = eval u in
//                 (x ++ y ++ line (Div t u) (a ÷ b), a ÷ b)
function evaluate(term: Term): M<number> {
  if (typeof term == 'number') {
    return [line(term, term), term]
  } else {
    let [t, u] = term

    let [x, a] = evaluate(t)
    let [y, b] = evaluate(u)

    return [`${x}${y}${line(term, Math.floor(a / b))}`, Math.floor(a / b)]
  }
}
// line          :: Term → Int → Output
// line t a      = “eval (” ++ showterm t ++ “) ⇐ ” + showint a + “↩︎”
// The function line generates one line of the output.
// Here showterm and showint convert terms and integers to strings,
// ++ concatenates strings, and “↩︎” represents the string consisting of a newline.
function line(term: Term, a: number): Output {
  return `evaluate(${ JSON.stringify(term) }) <= ${ a }\n`
}

let answer: Term = [[1972, 2], 23]
console.log(evaluate(answer)[0])

// Say that it was desired to modify the previous program to display
// the execution trace in the reverse order:
function evaluate_rev(term: Term): M<number> {
  if (typeof term == 'number') {
    return [line(term, term), term]
  } else {
    let [t, u] = term

    let [x, a] = evaluate_rev(t)
    let [y, b] = evaluate_rev(u)

    // line (Div t u) (a ÷ b) ++ y ++ x
    return [`${line(term, Math.floor(a / b))}${y}${x}`, Math.floor(a / b)]
  }
}

console.log(evaluate_rev(answer)[0])
