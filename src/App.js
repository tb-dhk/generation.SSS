import './App.css'
import React, { useState, useEffect } from 'react'
import { format, tick, maxdim, renderTab, getSubTabs } from './mini'
import { StoryPopup } from './StoryPopup'

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
  const [currentTab, setCurrentTab] = useState(0)
  const [subTab, setSubTab] = useState(0)

  const tickspeed = JSON.parse(localStorage.getItem('tickspeed'))
  const tabs = ["dimensions", "challenges", "story", "settings", "about"]

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

  /* remove this when presitge is implemented*/
  
  /* main structure */
  return (
  <div>
    <div className="marquee"></div>
    <div id="top">
      <h1>generation.SSS</h1>
      <h2>you have {format(s)} S.</h2>
    </div>

    <StoryPopup />

    <div className="tabs"> {
      [...Array(tabs.length).keys()].map((i) => {
        return <button className={`s${i+1}`} onClick={() => setCurrentTab(i)}>{tabs[i]}</button>
      })
    } </div>

    <div className="subtabs"> {
      [...Array(getSubTabs(currentTab).length).keys()].map((i) => {
        return <button className={`s${i+6}`} onClick={() => setSubTab(i)}>{getSubTabs(currentTab)[i]}</button>
      })
    } </div>

    <div id="main">
      {renderTab(currentTab, subTab, renderDim)}
    </div>

  </div>)
}

export default App
