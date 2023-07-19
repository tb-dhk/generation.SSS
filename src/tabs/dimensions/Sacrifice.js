import { format, maxdim } from "../../extra/mini"

function doSacrifice() {
  let dimensions = JSON.parse(localStorage.getItem('dimensions'))
  let currency = JSON.parse(localStorage.getItem('currency'))
  for (let dim in dimensions.S) {
    dimensions.S[dim].total = dimensions.S[dim].bought
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
  let currentBonus = Math.log(sacrifice) / Math.log(8)
  currentBonus = currentBonus > 1 ? currentBonus : 1
  const newBonus = Math.log(Number(currency.S)) / Math.log(8)
  if (Number(dimensions.S.S8.total) > 0 && Number(currency.S) > sacrifice) {
    return <div className={`big sacrifice s${maxdim()}`}>
      <h5 className={`s${maxdim()}`}>you can now sacrifice!</h5>
      <h6 className={`s${maxdim()}`}>you currently have a sacrifice bonus of {format(currentBonus)}.</h6>
      <h6 className={`s${maxdim()}`}>when you sacrifice, your S8 generators will be boosted by {format(newBonus)} (increase of {format(newBonus / currentBonus)}).</h6>
      <button className="round-corners" onClick={doSacrifice}>sacrifice</button>
    </div>
  } else {
    let message = ""
    if (Number(currency.S) < sacrifice) {
      message = `you need ${format(sacrifice)} S to sacrifice.`
    } else if (Number(dimensions.S.S8.total) <= 0) {
      message = "you need one S8 generator to sacrifice."
    }
    return <div className={`sacrifice s${maxdim()}`}>
      <h3 className={`s${maxdim()}`}>{"you can't sacrifice yet."}</h3>
      <h4 className={`s${maxdim()}`}>you currently have a sacrifice bonus of {format(currentBonus)}.</h4>
      <h4 className={`s${maxdim()}`}>{message}</h4>
    </div>
  }
}

export default Sacrifice
