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
  const currentBonus = (25 / 24) ** (sacrifice ** (1 / 24))
  const newBonus = (25 / 24) ** (Number(currency.S) ** (1 / 24))
  if (Number(dimensions.S.S8.total) > 0 && Number(currency.S) > sacrifice) {
    return <div className={`big sacrifice s${maxdim()}`}>
      <h3 className={`s${maxdim()}`}>you can now sacrifice!</h3>
      <h4 className={`s${maxdim()}`}>you currently have a sacrifice bonus of {format(currentBonus)}.</h4>
      <h4 className={`s${maxdim()}`}>when you sacrifice, you will have a sacrifice bonus of {format(newBonus)} (increase of {format(newBonus / currentBonus)}).</h4>
      <button className="round-corners" onClick={doSacrifice}>ass</button>
    </div>
  } else {
    return <div className={`big sacrifice s${maxdim()}`}>
      <h3 className={`s${maxdim()}`}>{"you can't sacrifice yet."}</h3>
      <h4 className={`s${maxdim()}`}>you currently have a sacrifice bonus of {format((25 / 24) ** (sacrifice ** (1 / 24)))}.</h4>
    </div>
  }
}

export default Sacrifice
