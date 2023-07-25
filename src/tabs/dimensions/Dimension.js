import React, { useState, useEffect } from 'react'
import { format, price } from '../../extra/mini'

export function buyDim(type, num, max) {
  const dims = JSON.parse(localStorage.getItem('dimensions'))
  const thisDim = dims[type]["S" + num.toString()]
  const currencies = JSON.parse(localStorage.getItem('currency'))
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))

  function buyone() {
    thisDim.bought += 1
    if (!thisDim.total) {
      thisDim.total = 1
    } else {
      thisDim.total += 1
    }
    dims[type]["S" + num.toString()] = thisDim
    currencies[type] -= price(type, num)

    if (inChallenge["grand gravity"] === 3) {
      for (var i = 1; i < num; i++) {
        let dim = dims[type]["S" + i]
        dim.total = dim.bought
        dims[type]["S" + i] = dim
      }
    }

    localStorage.setItem('dimensions', JSON.stringify(dims))
    localStorage.setItem('currency', JSON.stringify(currencies))  
  }

  if (max) {
    while (currencies[type] >= price(type, num)) {
      buyone()
    }
  } else {
    if (currencies[type] >= price(type, num)) {
      buyone()
    }
  }

}

const invert = (element, truth) => {
  let button = element.target
  if (truth) {
    button.classList.add("invert")
    button.classList.add("not-current")
  } else {
    button.classList.remove("invert")
    button.classList.remove("not-current")
  }
}

function Dimension({ type, num, tickspeed }) {
  const prestige = JSON.parse(localStorage.getItem('prestige'))
  const autobuyers = JSON.parse(localStorage.getItem('autobuyers'))
  const objekts = JSON.parse(localStorage.getItem('objekts'))
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
  const sacrifice = JSON.parse(localStorage.getItem('sacrifice'));
  const ggc6 = JSON.parse(localStorage.getItem('ggc6'))
  const currencies = JSON.parse(localStorage.getItem('currency'))

  let members = false 
  try {
    members = JSON.parse(localStorage.getItem('settings')).members
  } catch {}

  useEffect(() => {
    const intervalId = setInterval(() => {
      const dims = JSON.parse(localStorage.getItem('dimensions'));
      let thisDim = {total: 0, bought: 0}
      if (num) {
        thisDim = dims[type]["S" + num.toString()];
      }
      setTotal(thisDim.total);
      setBought(thisDim.bought);
    }, tickspeed);

    return () => {
      clearInterval(intervalId);
    };
  })

  const [total, setTotal] = useState(0)
  const [bought, setBought] = useState(0)

  if (num){
    const objs = objekts.Atom01["S" + num].filter(c => { return c.toString()[0] === "1" })

    let boosts = (25 / 24) ** bought

    for (let c in prestige) {
      if (prestige[c].challenges.includes(num)) {
        boosts **= 9 / 8
      }
    }

    let objektCount = 0
    for (let x in objekts.Atom01) {
      objektCount += objekts.Atom01[x].length
    }

    if (type === "S" && num === 8) {
      boosts *= Math.log(sacrifice) / Math.log(8) * ((25/24) ** objektCount)
    }

    if (inChallenge.grandGravity === 6) {
      boosts *= Number(ggc6[num - 1])
    }
    
    boosts = boosts > 1 ? boosts : 1 

    let enableAutobuy = true
    try {
      enableAutobuy = JSON.parse(localStorage.getItem("enableAutobuy"))
    } catch { }

    let autobuyer = "locked"

    if (inChallenge["grand gravity"] !== 3 && objekts.Atom01["S" + num].includes(100) && enableAutobuy) {
      try {
        autobuyer = 2 ** (9 - objs.length) - (Date.now() - autobuyers[type]["S" + num]) / 1000
        autobuyer = autobuyer < 0 ? 0 : autobuyer
        if (autobuyer < 1) {
          autobuyer = Math.floor(autobuyer * 1000) + "m"
        } else {
          autobuyer = Math.floor(autobuyer)
        }
        autobuyer += "s"
      } catch {
        console.log(type, autobuyers[type])
        autobuyer = ""
      }
    } else if (objekts.Atom01["S" + num].includes(100)) {
      autobuyer = "off"
    }

    let member = ""
    if (members) {
      const tripleS = ["SeoYeon", "HyeRin", "JiWoo", "ChaeYeon", "YooYeon", "SooMin", "NaKyoung", "YuBin"]
      member = tripleS[num-1]
    }
    return (
      <div className="dimension-container">
        <div className={`dimension`}>
          <div className={`s${num} name`}>S{num} {member}</div>
          <div className={`bonus`}>× {format(boosts)}</div>
          <div className={`amount`}>{format(total)} ({format(bought)})</div>
          <div className={`autobuy`}>{autobuyer}</div>
          <button 
            type="button" 
            className={`s${num} max`} 
            onMouseOver={(element) => invert(element, true)} 
            onMouseOut={(element) => invert(element, false)}
            onClick={() => buyDim(type, num, true)}
          >
            max
          </button>
          <button 
            type="button" 
            className={`s${num} price ${currencies[type] >= price(type, num) ? "" : "invert"}`} 
            onMouseOver={(element) => invert(element, currencies[type] >= price(type, num))} 
            onMouseOut={(element) => invert(element, currencies[type] < price(type, num))}
            onClick={() => buyDim(type, num, false)}
          >
            {format(price(type, num))} {type}
          </button>
        </div>
        <hr />
      </div>
    )
  } else {
    return (
      <div className="dimension-container">
        <div className={`dimension`}>
          <div className={`name`}>dimension</div>
          <div className={``}>boosts</div>
          <div className={`amount`}>total (bought)</div>
          <div className={`autobuy`}>autobuyer</div>
          <div className={`max`}>max</div>
          <div className={`price`}>price</div>
        </div>
        <hr />
      </div>
    )

  }
}

export default Dimension
