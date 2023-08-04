import { upgradeLines } from "../../extra/lines.js"
import { format, invert } from "../../extra/mini.js"

function buy(type, num) {
  const currency = JSON.parse(localStorage.getItem("currency"))
  const upgrades = JSON.parse(localStorage.getItem("upgrades"))
  const thisUpgrade = upgrades[type][num-1]
  currency.como -= 24 ** (thisUpgrade * num)
  upgrades[type][num-1]++
  localStorage.setItem("currency", JSON.stringify(currency))
  localStorage.setItem("upgrades", JSON.stringify(upgrades))
}

function Upgrade({ type, num }) {
  const currency = JSON.parse(localStorage.getItem("currency"))
  const upgrades = JSON.parse(localStorage.getItem("upgrades"))
  const thisUpgrade = upgrades[type][num-1]
  const affordable = currency.como >= 24 ** (thisUpgrade * num)
  const transparency = affordable ? "translucent" : ""
  const color = affordable ? "white" : ""
  const primes = [2, 3, 5, 7, 11, 13, 17, 19]
  return (
    <button 
      className={`s${num} medium ${transparency}`} 
      onClick={() => {if (affordable) buy(type, num)}}
      onMouseEnter={(element) => invert(element, true, affordable)}
      onMouseLeave={(element) => invert(element, false, affordable)}
    >
      <h4 className={`s${num} ${color} noborder transparent lower`}>{upgradeLines[type][num-1]}</h4>
      <h5 className={`s${num} ${color} noborder transparent lower`}>×{format(primes[num-1] ** thisUpgrade)} → ×{format(primes[num-1] ** (thisUpgrade + 1))}</h5>
      <h5 className={`s${num} ${color} noborder transparent lower`}>{format(24 ** (thisUpgrade * num))} como</h5>
    </button>
  )
}

export default Upgrade
