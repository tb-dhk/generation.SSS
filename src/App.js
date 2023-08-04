import "./App.css"
import store from './app/store'
import genSSS from './images/generation-sss.jpeg'

import React, { useState, useEffect } from "react"
import { Provider, useSelector, useDispatch } from 'react-redux'
import { HotKeys } from "react-hotkeys";

import { format, reset, tick, sLimit, renderTab, getTabs, getSubTabs, changeColor, clearAlerts, buyMax } from "./extra/mini"

import { StoryPopup } from "./tabs/story/StoryPopup"
import { Alert } from "./tabs/misc/Alert"
import { buyDim } from "./tabs/dimensions/Dimension"
import { message } from "./tabs/challenges/Challenge"

import { updateCurrency } from "./slices/currency"
import { updateInChallenge } from "./slices/inchallenge"

function App() {
  /* initialising */
  let started = localStorage.getItem("started")
  if (started === null) {
    reset()
  }

  const [currentTab, setCurrentTab] = useState(0)
  const [subTab, setSubTab] = useState(0)

  const tickspeed = JSON.parse(localStorage.getItem("tickspeed"))
  const tabs = getTabs() 

  const currency = useSelector((state) => state.currency.value)
  const inChallenge = useSelector((state) => state.inChallenge.value)
  const dispatch = useDispatch()
  let alerts = JSON.parse(localStorage.getItem("alerts"))
  const prestige = JSON.parse(localStorage.getItem('prestige'))

  try {
    JSON.parse(localStorage.getItem("upgrades"))
  } catch {
    localStorage.setItem("upgrades", JSON.stringify({"grand gravity": [0, 0, 0, 0, 0, 0, 0, 0]}))
  }

  const [lastTick, setLastTick] = useState(Date.now())

  /* ticks */
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(updateCurrency(JSON.parse(localStorage.getItem("currency"))))
      tick(Date.now() - lastTick)
      setLastTick(Date.now())
      dispatch(updateInChallenge(JSON.parse(localStorage.getItem("inchallenge"))))
      let colors = JSON.parse(localStorage.getItem("colors"))
      for (const color in colors) {
        changeColor(color, colors[color], currentTab, tabs.length + subTab)
      }
      localStorage.setItem("last played", Date.now())
      clearAlerts()
    }, tickspeed)

    return () => {
      clearInterval(intervalId);
    };

  }, [lastTick, currency, dispatch, tickspeed, alerts, currentTab, subTab, tabs.length])

  /* keybinds */
  const keyMap = {
    prev_tab: "up",
    next_tab: "down",
    prev_subtab: "left",
    next_subtab: "right",
    max: "m"
  }

  const handlers = {
    prev_tab: event => {
      changeTab((currentTab === 0) ? (tabs.length - 1) : (currentTab - 1))
    },
    next_tab: event => {
      changeTab((currentTab === tabs.length - 1) ? 0 : (currentTab + 1))
    },
    prev_subtab: event => {
      changeSubTab((subTab === 0) ? (getSubTabs(currentTab).length - 1) : (subTab - 1))
    },
    next_subtab: event => {
      changeSubTab((subTab === getSubTabs(currentTab).length - 1) ? 0 : (subTab + 1))
    },
    max: event => {
      buyMax(subTab) 
    }
  }

  for (let i = 0; i < 24; i++) {
    let j = structuredClone(i)
    keyMap[j + 1 + "one"] = "1234567890-=qwertyuiop[]"[j]
    keyMap[j + 1 + "max"] = "shift+" + "1234567890-=qwertyuiop[]"[j]
    handlers[j + 1 + "one"] = () => { buyDim("S", j + 1, false) }
    handlers[j + 1 + "max"] = () => { buyDim("S", j + 1, true) }
  }

  let currencyString = " "
  let comoDustMult = " "
  if (!currentTab && subTab === 1) {
    currencyString = `you have ${format(currency.como)} como and ${format(currency.comoDust)} comodust.`
    comoDustMult = `your comodust is boosting S production by ${format(currency.comoDust ** (1 / 8))}.`
  } else if (currentTab === 2) {
    currencyString = `you have ${format(currency.como)} como.`
  } else {
    currencyString = `you have ${format(currency.S)} S.`
  }

  let perSecond = JSON.parse(localStorage.getItem("perSecond"))
  try {
    perSecond = (currentTab === 0 && currency.S < sLimit()) ? ` (${format(Object.values(perSecond)[subTab])} ${Object.keys(perSecond)[subTab] === "comoDust" ? "comodust" : Object.keys(perSecond)[subTab]}/s)` : ""
  } catch {
    perSecond = ""
  }

  let inChallengesList = []
  let challengeMessages = []
  for (let challenge in inChallenge) {
    if (inChallenge[challenge]) {
      inChallengesList.push(`${challenge} challenge ${inChallenge[challenge]}`)
      challengeMessages.push(<h4>{message(challenge, inChallenge[challenge])}</h4>)
    }
  }

  let inChallengesString = <h3> </h3>
  if (prestige.grandGravity.count) {
    if (inChallengesList.length) {
      inChallengesString = <h3>you are in {inChallengesList.join(" and ")}.</h3>
    } else {
      inChallengesString = <h3>you are not in any challenges.</h3>
    }
  }

  function changeTab(i) {
    setCurrentTab(i)
    changeSubTab(0)
    const tabDivs = document.querySelectorAll("button.tab")
    for (let j in tabDivs) {
      let item = tabDivs[j]
      if (typeof item === "object") {
        if (item.classList.contains(`s${i+1}`)) {
          item.classList.add("invert")
          item.classList.add("current")
        } else { 
          item.classList.remove("current")
          if (item.classList.contains("invert")) {
            item.classList.remove("invert")
          }
        }
      }
    }
  }

  function changeSubTab(i) {
    setSubTab(i)
    const subTabDivs = document.querySelectorAll("button.subtab")
    for (let j in subTabDivs) {
      let item = subTabDivs[j]
      if (typeof item === "object") {
        if (item.classList.contains(`s${i+tabs.length+1}`)) {
          item.classList.add("invert")
          item.classList.add("current")
        } else {
          item.classList.remove("current")
          if (item.classList.contains("invert")) {
            item.classList.remove("invert")
          }
        }
      }
    }
  }

  const invert = (element, truth) => {
    let button = element.target
    if (truth) {
      if (!Array.from(button.classList).includes("current")) {
        button.classList.add("invert")
        button.classList.add("not-current")
      }
    } else {
      if (Array.from(button.classList).includes("not-current")) {
        button.classList.remove("invert")
        button.classList.remove("not-current")
      }
    }
  }

  let ntab = currentTab 
  if (!prestige.grandGravity.count && currentTab) {
    ntab += 3
  }

  const subTabs = getSubTabs(ntab)

  alerts = Object.keys(alerts).map(a => {alerts[a].id = a; return alerts[a]})
  alerts.sort((a, b) => (a.time < b.time) ? 1 : -1)

  /* main structure */
  return (
    <HotKeys keyMap={keyMap} handlers={handlers} allowChanges={true} id="hotkeys">
      <div className={Object.keys(alerts).length ? "alerts" : ""}>
        {
          Object.keys(alerts).map(a => {
            console.log("alerts", a)
            return <Alert alertId={alerts[a].id} message={alerts[a].message} />
          })
        }
      </div>

      <div className="top">
        <img className="title" alt="main logo" src={genSSS} />
        <h2 className="top">{currencyString + perSecond}</h2>
        <h3>{comoDustMult}</h3>
        {inChallengesString}
        {challengeMessages ? challengeMessages : ""}
      </div>

      <StoryPopup />

      <div className="tabs"> {
        [...Array(tabs.length).keys()].map((i) => {
          return <button 
            className={`tab s${i + 1} ${!i ? "invert current" : ""}`} 
            onMouseOver={(element) => invert(element, true)} 
            onMouseOut={(element) => invert(element, false)} 
            onClick={() => changeTab(i)}
          >
            {tabs[i]}
          </button>
        })
      } </div>

      <div className="subtabs"> {
        [...Array(subTabs.length).keys()].map((i) => {
          return <button 
            className={`subtab s${i + tabs.length + 1} ${!i ? "invert current" : ""}`}
            onMouseOver={(element) => invert(element, true)} 
            onMouseOut={(element) => invert(element, false)} 
            onClick={() => changeSubTab(i)}
          >
            {subTabs[i]}
          </button>
        })
      } </div>

      <div id="main">
        {renderTab(currentTab, subTab)}
      </div>

    </HotKeys>)
}

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default AppWrapper
