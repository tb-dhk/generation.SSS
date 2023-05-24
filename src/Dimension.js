import React, { useState, useEffect } from 'react'
import { format, price } from './mini'

function Dimension({ type, num, tickspeed }) {
  const dims = JSON.parse(localStorage.getItem('dimensions'))
  const thisDim = dims[type][num.toString()]
  const [total, setTotal] = useState(thisDim.total)
  const [bought, setBought] = useState(thisDim.bought)
  
  function buyDim(max) {
    const currencies = JSON.parse(localStorage.getItem('currency'))

    function buyone() {
      thisDim.bought += 1
      thisDim.total += 1
      dims[type][num.toString()] = thisDim
      currencies[type] -= price(type, num)
      localStorage.setItem('dimensions', JSON.stringify(dims))
      localStorage.setItem('currency', JSON.stringify(currencies))
    }

    if (max) {
      while(true) {
        if (currencies[type] >= price(type, num)) {
          buyone()
        } else {
          break;
        }
      }
    } else {
      if (currencies[type] >= price(type, num)) {
          buyone()
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const dims = JSON.parse(localStorage.getItem('dimensions'));
      const thisDim = dims[type][num.toString()];
      setTotal(thisDim.total);
      setBought(thisDim.bought);
    }, tickspeed);

    return () => {
      clearInterval(intervalId);
    };
  })

  return (
    <div className={`s${num} dimension`}>
      <div className={`s${num} name`}>S{num}</div>
      <div className={`s${num} bonus`}>× {format((25/24) ** bought)}</div>
      <div className={`s${num} amount`}>{format(total)} ({format(bought)})</div>
      <button type="button" className={`s${num} max`} onClick={() => buyDim(true)}>max</button>
      <button type="button" className={`s${num} price`} onClick={() => buyDim(false)}>{format(price(type, num))} S</button>
    </div>
  )
}

export default Dimension
