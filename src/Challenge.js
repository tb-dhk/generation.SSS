import { format } from "./mini"

const challenges = {
  "grand gravity": [
    ["first grand gravity", "reach 24^24 for the first time."],
    ["generation (smol ver.)", "S1 generator is heavily weakened but gets an exponentially increasing bonus."],
    ["termination", "buying a generator automatically erases all lower tier generators."],
    ["triplequarterS", "S7 and S8 generators are unavailable."],
    ["it's gold? or white?", "all generator costs change base from 2 to 3."],
    ["dimension shift", "all generators get a random multiplier from x0.24 to 8."],
    ["two-system generation", "each generator produces the generator two tiers below. if not available, produces S."],
    ["two-system generation\n(DIMENSION ver.)", "each generator produces the nearest lower-tier generator in the same subunit. if not available, produces S."]
  ]
}

function enterChallenge(type, num) {
  if (!(type === "grand gravity" && num === 1)) {
    let currency = JSON.parse(localStorage.getItem('currency'))
    currency.S = 2
    if (type === "grand gravity" && num === 5) {
      currency.S *= 2
    }
    currency.comoDust = 0
    localStorage.setItem('currency', JSON.stringify(currency))

    let dimObj = JSON.parse(localStorage.getItem('dimensions'))
    const dims = Object.fromEntries(
      [...Array(24).keys()].map(x => [x+1, {bought: 0, total: 0}])
    )
    dimObj.S = dims
    localStorage.setItem('dimensions', JSON.stringify(dimObj))

    let inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
    inChallenge[type] = num
    localStorage.setItem("inchallenge", JSON.stringify(inChallenge))

    let times = JSON.parse(localStorage.getItem('times'))
    times["grand gravity"] = Date.now()
    localStorage.setItem('times', JSON.stringify(times))

    if (type === "grand gravity" && num === 6) {
      let ggc6 = []
      for (var i = 0; i < 8; i++) {
        ggc6.push(0.24 * ((100/3) ** Math.random()))
      }
      localStorage.setItem('ggc6', JSON.stringify(ggc6))
    }
  }
}

function Challenge({ type, num }) {
  return (
    <div className={`s${num} challenge ${type}`}>
      <h3 className={`s${num}`}>{challenges[type][num-1][0]}</h3>
      <h4 className={`s${num}`}>{challenges[type][num-1][1]}</h4>
      <button className="challengebutton" onClick={() => enterChallenge(type, num)}>start!</button>
    </div>
  )
}

export function message(type, num) {
  const times = JSON.parse(localStorage.getItem('times'));

  switch (type) {
    case "grand gravity":
      switch (num) {
        case 2:
          let mult = (24 ** ((Date.now() - times["grand gravity"])/1000000)) * 1/24
          return `S production x${format(mult)}`
        default:
          return ""
      }
    default:
      return ""
  }
}

export default Challenge 
