import './App.css'
import React, { useState, useEffect } from 'react'
import Dimension from './Dimension'
import { format, tick, maxdim, switchTab } from './mini'

function reset() {
  const types = ["S", "como", "sigma"]

  const dims = Object.fromEntries(
    [...Array(24).keys()].map(x => [x+1, {bought: 0, total: 0}])
  )
  const dimObj = Object.fromEntries(
    types.map(x => [x, dims])
  )
  localStorage.setItem('dimensions', JSON.stringify(dimObj))

  const currencyObj = Object.fromEntries(
    types.map(x => [x, Number(x === "S") * 2])
  )
  localStorage.setItem('currency', JSON.stringify(currencyObj))
  localStorage.setItem('started', true)
  localStorage.setItem('tickspeed', 50)
  localStorage.setItem('story', 0)
}

function App() {
  /* initialising */
  let started = localStorage.getItem('started')
  if (started === null) {
    reset() 
  }

  const [s, setS] = useState(2)
  const [renderDim, setRenderDim] = useState(2)
  const tickspeed = JSON.parse(localStorage.getItem('tickspeed'))

  /* ticks */
  useEffect(() => {
    const intervalId = setInterval(() => {
      setS(tick(tickspeed))
      setRenderDim(Math.min(maxdim(), 8))
    }, tickspeed)

    return () => {
      clearInterval(intervalId);
    };
  }) 

  const tabs = ["dimensions", "challenges", "story", "settings"]

  /* remove this when presitge is implemented*/
  
  /* main structure */
  return (
  <div>
    <div className="marquee"></div>
    <div id="top">
      <h1>generation.SSS</h1>
      <h2>you have {format(s)} S.</h2>
    </div>

    <div className="tabs">
      {
        [...Array(tabs.length).keys()].map((i) => {
          return <button className={`s${i+1}`} onClick={() => switchTab(tabs[i])}>{tabs[i]}</button>
        })
      }
    </div>
    
    {[...Array(renderDim).keys()].map(i =>{
      return <Dimension type="S" num={i+1} tickspeed={tickspeed} />
    })}

  </div>)
}

export default App
