import { format, maxdim } from "../../extra/mini"

function doSacrifice() {
  let dimensions = JSON.parse(localStorage.getItem('dimensions'))
  let currency = JSON.parse(localStorage.getItem('currency'))
  for (let dim in dimensions.S) {
    if (dim !== "S8") {
      dimensions.S[dim].total = 0
    }
  }
  localStorage.setItem('dimensions', JSON.stringify(dimensions))
  localStorage.setItem('currency', JSON.stringify(currency))
  localStorage.setItem('sacrifice', JSON.stringify(currency.S))
}

function Sacrifice() {
  let sacrifice = Number(JSON.parse(localStorage.getItem("sacrifice")))
  if (!sacrifice) {
    sacrifice = 1
  }
  let dimensions = JSON.parse(localStorage.getItem("dimensions"))
  let currency = JSON.parse(localStorage.getItem("currency"))
  let objekts = JSON.parse(localStorage.getItem("objekts"))
  let upgrades = JSON.parse(localStorage.getItem("upgrades"))
  let sacrificeUpgrade = 3 ** upgrades["grand gravity"][1]

  let objektCount = 0
  for (let x in objekts.Atom01) {
    objektCount += objekts.Atom01[x].length
  }

  let currentBonus = Math.log(sacrifice) / Math.log(8)
  currentBonus = currentBonus > 1 ? currentBonus : 1
  currentBonus *= (25/24) ** objektCount
  const newBonus = (Math.log(Number(currency.S)) / Math.log(8)) * ((25/24) ** objektCount)

  if (Number(dimensions.S.S8.total) > 0 && Number(currency.S) > sacrifice * 2) {
    return <div className={`big sacrifice s${maxdim()}`}>
      <h4 className={`s${maxdim()}`}>you can now sacrifice!</h4>
      <h5 className={`s${maxdim()}`}>you currently have a sacrifice bonus of {format(currentBonus) * sacrificeUpgrade}.</h5>
      <h5 className={`s${maxdim()}`}>when you sacrifice, your S8 dimensions will be boosted by {format(newBonus) * sacrificeUpgrade} (increase of {format(newBonus / currentBonus)}), but all other dimensions will be reset to 0.</h5>
      <button className="round-corners challengebutton" onClick={doSacrifice}>sacrifice</button>
    </div>
  }
}

export default Sacrifice
