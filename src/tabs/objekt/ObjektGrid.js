import objektDic from "../../extra/objekts.js"

function ObjektGrid({ season, clss, startNumber, stopNumber }) {
  let objekts = JSON.parse(localStorage.getItem("objekts"))
  let formatNumber = (n => (n < 10 ? "0" : "") + n)

  return (
    <div className="objekt-grid" style={{ display: "grid", gridTemplateRows: `1fr repeat(${9}, 2fr)` }}>
      <div style={{ display: "grid", gridTemplateColumns: `1fr repeat(${9}, 2fr)` }}>
        <p> </p>
        {[...Array(stopNumber - startNumber + 1).keys()].map(n => {
          return <h4 className="objekt"><span className="label">{clss + formatNumber(n + startNumber)}</span></h4>
        })}
      </div>
      {[...Array(8).keys()].map(m => {
        return <div style={{ display: "grid", gridTemplateColumns: `1fr repeat(${9}, 2fr)` }}>
          <h4 className="objekt">S{m + 1}</h4>
          {[...Array(stopNumber - startNumber + 1).keys()].map(n => {
            let number = clss + formatNumber(n + startNumber)
            let obtained = objekts[season]["S" + (m + 1)].includes(parseInt(number))
            let style = { visibility: obtained ? "visible" : "hidden" }
            return <img className="objekt" src={objektDic[season]["S" + (m + 1)][number + "Z"]} alt="objekt" style={style} />
          })}
        </div>
      })}
    </div>
  )
}

export default ObjektGrid
