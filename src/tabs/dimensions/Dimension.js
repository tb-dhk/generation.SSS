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
  const dims = JSON.parse(localStorage.getItem('dimensions'))
  const thisDim = dims[type]["S" + num.toString()]
  const autobuyers = JSON.parse(localStorage.getItem('autobuyers'))
  const objekts = JSON.parse(localStorage.getItem('objekts'))
  const objs = objekts.Atom01["S" + num].filter(c => { return c.toString()[0] === "1" })
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
  const sacrifice = JSON.parse(localStorage.getItem('sacrifice'));
  const ggc6 = JSON.parse(localStorage.getItem('ggc6'))
  const currencies = JSON.parse(localStorage.getItem('currency'))

  let members = false 
  try {
    members = JSON.parse(localStorage.getItem('settings')).members
  } catch {}

  const [total, setTotal] = useState(thisDim.total)
  const [bought, setBought] = useState(thisDim.bought)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const dims = JSON.parse(localStorage.getItem('dimensions'));
      const thisDim = dims[type]["S" + num.toString()];
      setTotal(thisDim.total);
      setBought(thisDim.bought);
    }, tickspeed);

    return () => {
      clearInterval(intervalId);
    };
  })

  let boosts = (25 / 24) ** bought

  for (let c in prestige) {
    if (prestige[c].challenges.includes(num)) {
      boosts **= 9 / 8
    }
  }

  if (type === "S" && num === 8) {
    boosts *= Math.log(sacrifice) / Math.log(8)
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
      autobuyer = Math.floor(2 ** (9 - objs.length) - (Date.now() - autobuyers[type]["S" + num]) / 1000)
      autobuyer = autobuyer < 0 ? 0 : autobuyer
      autobuyer += "s"
    } catch {
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
        className={`s${num} price ${currencies.S >= price(type, num) ? "" : "invert"}`} 
        onMouseOver={(element) => invert(element, currencies.S >= price(type, num))} 
        onMouseOut={(element) => invert(element, currencies.S < price(type, num))}
        onClick={() => buyDim(type, num, false)}
      >
        {format(price(type, num))} {type}
      </button>
    </div>
  )
}

export default Dimension
