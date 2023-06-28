import "./App.css"
import React, { useState, useEffect } from "react"
import store from './app/store'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { HotKeys } from "react-hotkeys";
import { format, tick, maxdim, renderTab, getSubTabs, changeColor, autobuy } from "./extra/mini"
import { StoryPopup } from "./extra/StoryPopup"
import { updateCurrency } from "./slices/currency"
import { updateInChallenge } from "./slices/inchallenge"
import { updateMaxDim } from "./slices/maxdim"
import { buyDim } from "./tabs/dimensions/Dimension"
import { message } from "./tabs/challenges/Challenge"

function reset() {
  const types = ["S", "como", "comoDust", "sigma"]

  const dims = Object.fromEntries(
    [...Array(24).keys()].map(x => [x+1, {bought: 0, total: 0}])
  )
  const dimObj = Object.fromEntries(
    types.map(x => [x, dims])
  )
  localStorage.setItem("dimensions", JSON.stringify(dimObj))

  const currencyObj = Object.fromEntries(
    types.map(x => [x, Number(x === "S") * 2])
  )
  localStorage.setItem("currency", JSON.stringify(currencyObj))
  localStorage.setItem("started", true)
  localStorage.setItem("tickspeed", 50)
  localStorage.setItem("story", 0)
  localStorage.setItem("inchallenge", JSON.stringify({"grand gravity": 1}))

  const colors = {
    s1 : "#22aeff",
    s2 : "#9200ff",
    s3 : "#fff800",
    s4 : "#98f21d",
    s5 : "#d80d76",
    s6 : "#ff7fa4",
    s7 : "#729ba1",
    s8 : "#ffe3e2",
    s9 : "#ffc931",
    s10 : "#fb98dc",
    s11 : "#ffe000",
    s12 : "#5975fd",
    s13 : "#ff953f",
    s14 : "#1222b5"
  }
  localStorage.setItem("colors", JSON.stringify(colors))

  const prestige = {
    grandGravity: {
      count: 0,
      challenges: []
    } 
  }
  localStorage.setItem("prestige", JSON.stringify(prestige))

  let objekts = {
    atom: {
      "first class": {}
    }
  }
  for (var i = 1; i <= 8; i++) {
    objekts["atom"]["first class"][i] = []
  }
  localStorage.setItem("objekts", JSON.stringify(objekts))

  const times = ["grand gravity"]
  const timesObj = Object.fromEntries(
    times.map(x => [x, Date.now()])
  )
  localStorage.setItem("times", JSON.stringify(timesObj))

  let autobuyers = {
    S: {} 
  }
  for (i = 1; i <= 8; i++) {
    autobuyers.S[i] = Date.now()
  }
  localStorage.setItem("autobuyers", JSON.stringify(autobuyers))
}

function App() {
  /* initialising */
  let started = localStorage.getItem("started")
  if (started === null) {
    reset() 
  }

  const [currentTab, setCurrentTab] = useState(0)
  const [subTab, setSubTab] = useState(0)

  const tickspeed = JSON.parse(localStorage.getItem("tickspeed"))
  const tabs = ["dimensions", "challenges", "objekts", "story", "settings", "help", "about"]

  const currency = useSelector((state) => state.currency.value)
  const inChallenge = useSelector((state) => state.inChallenge.value)
  const renderDim = useSelector((state) => state.maxDim.value)
  const dispatch = useDispatch()

  /* ticks */
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(updateCurrency(JSON.parse(localStorage.getItem("currency"))))
      tick(tickspeed)
      dispatch(updateInChallenge(JSON.parse(localStorage.getItem("inchallenge"))))
      dispatch(updateMaxDim(maxdim()))
      let colors = JSON.parse(localStorage.getItem("colors"))
      for (const color in colors) {
        changeColor(color, colors[color])
      }
      localStorage.setItem("last played", Date.now())

      autobuy()
    }, 100)

    return () => {
      clearInterval(intervalId);
    };
  
  }, [currency, dispatch, tickspeed])

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
      setCurrentTab((currentTab === 0) ? (tabs.length - 1) : (currentTab - 1))
    },
    next_tab: event => {
      setCurrentTab((currentTab === tabs.length - 1) ? 0 : (currentTab + 1))
    },
    prev_subtab: event => {
      setSubTab((subTab === 0) ? (getSubTabs(currentTab).length - 1) : (subTab - 1))
    },
    next_subtab: event => {
      setSubTab((subTab === getSubTabs(currentTab).length - 1) ? 0 : (subTab + 1))
    },
    max: event => {
      let limit = 8
      if (inChallenge["grand gravity"] === 4) {
        limit = 6
      }
      for (var i = limit; i > 0; i--) {
        buyDim("S", i, true)
      }
    }
  }

  for (let i = 0; i < 24; i++) {
    let j = structuredClone(i)
    keyMap[j + 1 + "one"] = "1234567890-=qwertyuiop[]"[j]
    keyMap[j + 1 + "max"] = "shift+"+"1234567890-=qwertyuiop[]"[j]
    handlers[j + 1 + "one"] = () => {buyDim("S", j + 1, false)}
    handlers[j + 1 + "max"] = () => {buyDim("S", j + 1, true)}
  }
 
  let currencyString = <h2> </h2>
  if (!currentTab && subTab === 1) {
    currencyString = <h2 className="top">you have {format(currency.como)} como and {format(currency.comoDust)} comodust.</h2>
  } else {
    currencyString = <h2 className="top">you have {format(currency.S)} S.</h2>
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
  if (inChallengesList.length) {
    inChallengesString = <h3>you are in {inChallengesList.join(" and ")}.</h3>
  } else {
    inChallengesString = <h3>you are not in any challenges.</h3>
  }
  

  /* main structure */
  return (
  <HotKeys keyMap={keyMap} handlers={handlers} allowChanges={true}>
    <div className="marquee"></div>
    <div className="top">
      <h1>generation.SSS</h1>
      { currencyString }
      { inChallengesString }
      { challengeMessages ? challengeMessages : "" }
    </div>

    <StoryPopup />

    <div className="tabs"> {
      [...Array(tabs.length).keys()].map((i) => {
        return <button className={`s${i+1}`} onClick={() => setCurrentTab(i)}>{tabs[i]}</button>
      })
    } </div>

    <div className="subtabs"> {
      [...Array(getSubTabs(currentTab).length).keys()].map((i) => {
        return <button className={`s${i+tabs.length+1}`} onClick={() => setSubTab(i)}>{getSubTabs(currentTab)[i]}</button>
      })
    } </div>

    <div id="main">
      {renderTab(currentTab, subTab, renderDim)}
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
