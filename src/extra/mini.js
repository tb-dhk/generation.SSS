import ProgressBar from "@ramonak/react-progress-bar";

import Dimension from '../tabs/dimensions/Dimension'
import Sacrifice from '../tabs/dimensions/Sacrifice'
import Challenge from '../tabs/challenges/Challenge'
import Upgrade from '../tabs/upgrades/Upgrade'
import Story from '../tabs/story/Story'
import ObjektGrid from '../tabs/objekt/ObjektGrid'
import ColorInput from '../tabs/settings/ColorInput'
import Accordion from '../tabs/misc/Accordion'

import { help, about, milestones } from './lines'
import { impt, expt } from './save'
import { buyDim } from '../tabs/dimensions/Dimension'
import { autostory } from '../tabs/story/StoryPopup'
import { grandGravity } from '../extra/prestige'

export function format(num) {
  num = Math.round(num * 1000) / 1000
  const str = num.toString()
  if (num >= 1000) {
    let sciNot = num.toExponential(3).replace("+", "").split("e")
    sciNot[-1] = format(parseInt(sciNot[-1]))
    return sciNot.join("e")
  } else {
    return str
  }
}
export function price(type, num) {
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'));
  const dims = JSON.parse(localStorage.getItem('dimensions'))[type]
  let index = num.toString()
  if (num[0] !== "S") {
    index = "S" + index
  }
  const thisDim = dims[index]
  const bought = thisDim.bought
  const base = (inChallenge["grand gravity"] === 5 && type === "S") ? 3 : 2
  return base ** ((num * (num + bought)))
}

export function maxdim(currency = "S", strict = false) {
  const dims = JSON.parse(localStorage.getItem('dimensions'));

  /* number of dimensions to render */
  for (let d = 1; d <= 24 - Number(strict); d++) {
    if ((!strict && !dims[currency]["S" + d].total) || (strict && !dims[currency]["S" + (d + 1)].total)) {
      return d
    }
  }
}

export function sLimit() {
  if (maxdim("como", true) <= 4) {
    return 24 ** 24 
  } else if (maxdim("como", true) <= 8) {
    return 24 ** (6 * maxdim("como", true))
  } else {
    return 24 ** 48
  }
}

export function tick(tickspeed) {
  const dims = JSON.parse(localStorage.getItem('dimensions'))
  const objekts = JSON.parse(localStorage.getItem('objekts'))
  const currency = JSON.parse(localStorage.getItem('currency'))
  const prestige = JSON.parse(localStorage.getItem('prestige'))
  const sacrifice = JSON.parse(localStorage.getItem('sacrifice'))
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
  const milestones = JSON.parse(localStorage.getItem('milestones'))
  const times = JSON.parse(localStorage.getItem('times'))
  const upgrades = JSON.parse(localStorage.getItem('upgrades'))
  const ggc6 = JSON.parse(localStorage.getItem('ggc6'))

  const generatedCurrency = {
    S: "S",
    como: "comoDust"
  }

  let perSecond = {}

  let objektCount = 0
  for (let x in objekts.Atom01) {
    objektCount += objekts.Atom01[x].length
  }

  for (const dim of ["S", "como"]) {
    const maxDim = maxdim()
    let boosts = 9/8 * dims[dim]["S1"].bought
    let defCurrencyGain = Number(dims[dim]["S1"].total) + ([7, 8].includes(inChallenge["grand gravity"]) ? Number(dims[dim]["S2"].total) : 0)
    defCurrencyGain *= boosts
    if (currency.comoDust) {
      defCurrencyGain *= currency.comoDust ** (1 / 8) * (11 ** upgrades["grand gravity"][4])
    }
    if (inChallenge["grand gravity"] === 2) {
      defCurrencyGain *= (24 ** ((Date.now() - times["grand gravity"]) / 1000000)) * 1 / 24
    } else if (inChallenge["grand gravity"] === 6) {
      defCurrencyGain *= ggc6[0]
    }

    for (let c in prestige) {
      if (prestige[c].challenges.includes(1) && defCurrencyGain >= 1) {
        defCurrencyGain *= 9 / 8 * (17 ** upgrades["grand gravity"][6])
      }
    }

    let base = 2
    let unit = 0
    if (dim === "como") {
      defCurrencyGain *= 19 ** upgrades["grand gravity"][7]
      base = 7
      unit = 3
    }

    defCurrencyGain *= base ** upgrades["grand gravity"][unit]

    perSecond[generatedCurrency[dim]] = defCurrencyGain
    currency[generatedCurrency[dim]] += defCurrencyGain * tickspeed / 1000
    if (currency[generatedCurrency[dim]] > sLimit() && dim === "S") {
      currency[generatedCurrency[dim]] = sLimit()
    }

    for (const genName in dims[dim]) {
      boosts = (maxDim ** maxDim)
      const gen = parseInt(genName.slice(1))
      if (gen < 24 && (gen <= maxdim() || dim !== "S")) {
        let boosts = (9/8) ** dims[dim]["S" + (gen + 1)].bought
        boosts *= base ** upgrades["grand gravity"][unit]
        if (dim === "S" && gen === 8 - 1) {
          const sacrificeBonus = Math.log(sacrifice) / Math.log(8) * (3 ** upgrades["grand gravity"][1])
          boosts *= sacrificeBonus > 1 ? sacrificeBonus : 1
          boosts *= (25/24) ** objektCount * (13 ** upgrades["grand gravity"][5])
        }
        let next = "S" + (gen + 1)
        if (dim === "S") {
          switch (inChallenge["grand gravity"]) {
            case 7:
              next = "S" + (gen + 2)
              break
            case 8:
              let list = [3, 5, 4, 6, 7, 0, 8, 0]
              if (gen <= 8) {
                next = "S" + list[gen - 1]
              }
              break
            default:
              next = "S" + (gen + 1)
          }
        }
        for (let c in prestige) {
          if (prestige[c].challenges.includes(gen + 1)) {
            boosts *= 9 / 8 * (17 ** upgrades["grand gravity"][6])
          }
        }
        for (let cat in milestones) {
          for (let row in milestones[cat]) {
            if (row[gen-1] === true) {
              boosts **= 9 / 8
            }
          }
        }
        if (inChallenge["grand gravity"] === 6) {
          boosts *= ggc6[gen]
        } 
        if (next !== "S25" && next !== "S0") {
          let defGain = Number(dims[dim][next].total) * boosts * tickspeed / 1000
          dims[dim][genName].total += defGain
        }
      }
      if (!dims[dim][genName].bought) {
        dims[dim][genName].bought = 0
      }
      if (!dims[dim][genName].total) {
        dims[dim][genName].total = dims[dim][genName].bought
      }
    }
  }

  localStorage.setItem('dimensions', JSON.stringify(dims))
  localStorage.setItem('currency', JSON.stringify(currency))
  localStorage.setItem('perSecond', JSON.stringify(perSecond))

  if (inChallenge["grand gravity"] !== 3) {
    autobuy()
  }

  updateMilestones()
}

export function autobuy() {
  const autobuyers = JSON.parse(localStorage.getItem('autobuyers'))
  const objekts = JSON.parse(localStorage.getItem('objekts'))
  const currency = JSON.parse(localStorage.getItem('currency'))
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))

  let enableAutobuy = true
  try {
    enableAutobuy = JSON.parse(localStorage.getItem("enableAutobuy"))
  } catch { }

  let dims = ["S", "como"]

  for (let j = 0; j < 1; j++) {
    if (j === 0 && currency.S < sLimit() && enableAutobuy) {
      for (let i in objekts.Atom01) {
        if (!(inChallenge["grand gravity"] === 4 && parseInt(i.slice(1)) > 6)) {
          let objs = objekts.Atom01[i].filter(c => c.toString()[0] === "1")
          const remaining = (Math.floor(2 ** (9 - objs.length) - (Date.now() - autobuyers[dims[j]][i]) / 1000))
          if (objekts.Atom01[i].includes(100) && (remaining < 0)) {
            buyDim(dims[j], parseInt(i.slice(1)), true)
            autobuyers[dims[j]][i] = Date.now()
          }
        }
      }
    }
  }

  localStorage.setItem('autobuyers', JSON.stringify(autobuyers))
}

function updateMilestones() {
  const dimensions = JSON.parse(localStorage.getItem('dimensions'))
  const prestige = JSON.parse(localStorage.getItem('prestige'))
  const objekts = JSON.parse(localStorage.getItem('objekts'))
  const alerts = JSON.parse(localStorage.getItem('alerts'))

  let myMilestones = JSON.parse(localStorage.getItem('milestones'))
  if (!myMilestones) {
    myMilestones = {
      "grand gravity": [...Array(2).keys()].map(i => {
        return [...Array(8).keys()].map(j => {
          return false
        })
      })
    }
  }

  const conditions = {
    "grand gravity": [
      [
        dimensions.S.S1.total > 0, 
        dimensions.S.S8.total > 0,
        dimensions.como.S1.total > 0,
        dimensions.como.S8.total > 0,
        prestige.grandGravity.count > 0,
        prestige.grandGravity.count >= 24,
        prestige.grandGravity.challenges.length >= 4,
        prestige.grandGravity.challenges.length >= 8
      ],
      [...Array(8).keys()].map(i => {
        return objekts.Atom01["S"+(i+1)].length >= 9
      })
    ]
  }
  
  let newMilestones = []
  for (let key in myMilestones) {
    for (let row in myMilestones[key]) {
      for (let col in myMilestones[key][row]) {
        if (!myMilestones[key][row][col] && conditions[key][row][col]) {
          myMilestones[key][row][col] = true
          newMilestones.push(milestones[key][row][Object.keys(milestones[key][row])[col]].name)
        }
      }
    }
  }
  localStorage.setItem("milestones", JSON.stringify(myMilestones))

  for (let m in newMilestones) {
    alerts[`get-milestone-${newMilestones[m]}`] = {
      message: `you got a new milestone: ${newMilestones[m]}`,
      time: Date.now()
    }
  }

  localStorage.setItem("alerts", JSON.stringify(alerts))
}

export function clearAlerts() {
  const alerts = JSON.parse(localStorage.getItem('alerts'))

  for (let id in alerts) {
    if (Date.now() - parseInt(alerts[id].time) >= 15000) {
      delete alerts[id]
    }
  }

  localStorage.setItem('alerts', JSON.stringify(alerts))
}

export function getTabs() {
  const prestige = JSON.parse(localStorage.getItem('prestige'))
  if (prestige.grandGravity.count) {
    return ["dimensions", "challenges", "upgrades", "objekts", "milestones", "story", "settings", "help", "about"]
  } else {
    return ["dimensions", "milestones", "story", "settings", "help", "about"]
  }
}

export function getSubTabs(tab) {
  const prestige = JSON.parse(localStorage.getItem('prestige'))
  const subTabs = [
    ["S", "como"],
    ["grand gravity"],
    ["grand gravity"],    
    ["single class"],
    ["part 1"],
    ["save", "options", "colors"],
    Object.keys(help),
    Object.keys(about)
  ]
  if (!tab && !prestige.grandGravity.count) {
    return ["S"]    
  }
  return subTabs[tab]
}

export function getNextColor(tab) {
  return getTabs(tab).length + getSubTabs(tab).length
}

function lock(div) {
  let prestige = JSON.parse(localStorage.getItem('prestige'))
  let grandGravityCount = prestige.grandGravity.count
  if (grandGravityCount) {
    return div
  } else {
    return (
      <div class="locked">
        <h3>oops!</h3>
        <h4>this area is locked.</h4>
        <h5>get 24^24 S and perform a grand gravity to unlock this section!</h5>
      </div>
    )
  }
}

export function toggleAutobuy() {
  let autobuy = true
  try {
    autobuy = JSON.parse(localStorage.getItem("enableAutobuy"))
  } catch { }
  localStorage.setItem("enableAutobuy", JSON.stringify(!autobuy))
  console.log(!autobuy)
}

function toggleSetting(k) {
  const settings = JSON.parse(localStorage.getItem('settings'))
  settings[k] = !settings[k]
  localStorage.setItem('settings', JSON.stringify(settings))
}

export function buyMax(subTab) {
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))

  let limit = 8
  if (inChallenge["grand gravity"] === 4) {
    limit = 6
  }
  let dims = ["S", "como"]
  for (let i = limit; i > 0; i--) {
    buyDim(dims[subTab], i, true)
  }
}

export function buyUpgrade(type, num) {
  const currency = JSON.parse(localStorage.getItem("currency"))
  const upgrades = JSON.parse(localStorage.getItem("upgrades"))
  const thisUpgrade = upgrades[type][num-1]
  currency.como -= 24 ** (thisUpgrade * num)
  upgrades[type][num-1]++
  localStorage.setItem("currency", JSON.stringify(currency))
  localStorage.setItem("upgrades", JSON.stringify(upgrades))
  console.log("bought", type, num)
}

function buyMaxUpgrades(category) {
  let upgrades = JSON.parse(localStorage.getItem("upgrades"))
  let currency = JSON.parse(localStorage.getItem("currency"))
  let chosen = -1
  let min = currency.como
  const primes = [2, 3, 5, 7, 11, 13, 17, 19]
  while (true) {
    upgrades = JSON.parse(localStorage.getItem("upgrades"))
    currency = JSON.parse(localStorage.getItem("currency"))
    chosen = -1
    min = currency.como
    for (let i = 0; i < 8; i++) {
      if (24 ** ((i + 1) * upgrades[category][i]) < min) {
        min = 24 ** ((i + 1) * upgrades[category][i])
        chosen = i
      }
    }
    if (chosen === -1) {
      break
    } else {
      buyUpgrade(category, chosen + 1)
    }
  }
}

const colors = {
  s1: "#22aeff",
  s2: "#9200ff",
  s3: "#fff800",
  s4: "#98f21d",
  s5: "#d80d76",
  s6: "#ff7fa4",
  s7: "#729ba1",
  s8: "#ffe3e2",
  s9: "#ffc931",
  s10: "#fb98dc",
  s11: "#ffe000",
  s12: "#5975fd",
  s13: "#ff953f",
  s14: "#1222b5",
  s15: "#d51312"
}

export function reset() {
  if (window.confirm("are you sure you want to reset? all your progress will be completely wiped.")) {
    localStorage.clear()

    const types = ["S", "como", "comoDust", "sigma"]

    const dims = Object.fromEntries(
      [...Array(24).keys()].map(x => ["S" + (x + 1), { bought: 0, total: 0 }])
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
    localStorage.setItem("inchallenge", JSON.stringify({ "grand gravity": 1 }))

    localStorage.setItem("colors", JSON.stringify(colors))

    const prestige = {
      grandGravity: {
        count: 0,
        challenges: []
      }
    }
    localStorage.setItem("prestige", JSON.stringify(prestige))

    let objekts = {
      Atom01: {}
    }
    for (var i = 1; i <= 8; i++) {
      objekts.Atom01["S" + i] = []
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
      autobuyers.S["S" + i] = Date.now()
    }
    localStorage.setItem("autobuyers", JSON.stringify(autobuyers))

    localStorage.setItem("alerts", JSON.stringify({start: {message: "press the '2 S' button to start!", time: Date.now() + 15000}}))

    localStorage.setItem("upgrades", JSON.stringify({"grand gravity": [0, 0, 0, 0, 0, 0, 0, 0]}))
    window.location.reload()
  }
}

export function invert(element, truth, affordable) {
  let button = element.currentTarget
  if (affordable) {
    if (truth) {
      button.classList.remove("translucent")
      for (let c in button.children) {
        if (typeof button.children[c] === "object") {
          button.children[c].classList.remove("white")
        }
      }
    } else {
      button.classList.add("translucent")
      for (let c in button.children) {
        if (typeof button.children[c] === "object") {
          button.children[c].classList.add("white")
        }
      }
    }
  }
}


export function renderTab(tab, subtab) {
  const tickspeed = JSON.parse(localStorage.getItem('tickspeed'))
  const currency = JSON.parse(localStorage.getItem('currency'))
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
  const objekts = JSON.parse(localStorage.getItem('objekts'))
  const prestige = JSON.parse(localStorage.getItem('prestige'))
  const upgrades = JSON.parse(localStorage.getItem('upgrades'))
  let settings = {}
  
  settings = JSON.parse(localStorage.getItem('settings'))
  if (!settings) {
    settings = {
      "save to file": true,
      members: false
    }
    localStorage.setItem('settings', JSON.stringify(settings))
  }

  let renderDim = 8
  if (tab === 0) {
    renderDim = maxdim(getSubTabs(tab)[subtab])
  }

  let count = 0
  let subobj = {}

  function reset_colors() {
    localStorage.setItem('colors', JSON.stringify(colors))
  }

  let ntab = tab
  if (!prestige.grandGravity.count && ntab) {
    ntab += 3
  }

  switch (ntab) {
    case 0:
      let limit = 8
      if (inChallenge["grand gravity"] === 4) {
        limit = 6
      }
      let progressBar = <div></div>
      if (!subtab) {
        progressBar = <ProgressBar
          className="progress-bar"
          completed={Number((Math.log(currency.S) / Math.log(sLimit()) * 100).toFixed(2))}
          bgColor={colors["s" + (maxdim())]}
          baseBgColor="white"
          transitionDuration="0.5s"
        />
      }
      let enableAutobuy = true
      try {
        enableAutobuy = JSON.parse(localStorage.getItem("enableAutobuy"))
      } catch { }

      let enableAutobuyButton = <div></div>
      if (!subtab) {
        enableAutobuyButton = <button className={`s${getNextColor(ntab) + 1} sub-header`} onClick={toggleAutobuy}>toggle autobuyers: {inChallenge["grand gravity"] === 3 ? "locked" : (enableAutobuy ? "on" : "off")}</button>
      }

      const gainedComo = 2 ** (prestige.grandGravity.count + 1) * (5 ** upgrades["grand gravity"][2]) * (Math.log(currency.S) / Math.log(24 ** 24))
      const grandGravDiv = (
        <button 
          className="s10 translucent prestige" 
          onClick={grandGravity}
          onMouseEnter={(element) => invert(element, true, true)}
          onMouseLeave={(element) => invert(element, false, true)}
        >
          <h4 className="s10 white noborder lower transparent">{currency.S < sLimit() ? "grand gravity" : "boom!"}</h4>
          <h5 className="s10 white noborder lower transparent">{currency.S < sLimit() ? "you can do a grand gravity now!" : "too much S!"}</h5>
          <h5 className="s10 white noborder lower transparent">when you grand gravity, you will lose all your dimensions and S for {format(gainedComo)} como.</h5>
        </button>
      )

      const prestigeGrid = <div className="prestige-grid">
        {!subtab && maxdim() >= 8 && currency.S < sLimit() ? <Sacrifice /> : <div></div>}
        {currency.S >= 24 ** 24 ? grandGravDiv : <div></div>}
      </div>


      const dimensions = (
        <div>
          {enableAutobuyButton}
          <button className={`s${getNextColor(ntab) + 2} sub-header`} onClick={() => {buyMax(subtab)}}>buy max</button>
          <div className="dimension-container">
            <Dimension type={getSubTabs(tab)[subtab]} num={0} tickspeed={tickspeed} />
          </div>
          {[...Array(renderDim < limit ? renderDim : limit).keys()].map(i => {
            return <Dimension type={getSubTabs(tab)[subtab]} num={i + 1} tickspeed={tickspeed} />
          })}
          {prestigeGrid}
          {progressBar}
        </div>
      )
    
      return <div>
        {!(currency.S >= sLimit() && !subtab) ? dimensions : prestigeGrid}
      </div>
    case 1:
      return lock(
        <div className="container label">
          <span className="sub-header">each challenge multiplies the production of the corresponding dimension by {format(1.125 * (17 ** upgrades["grand gravity"][6]))}.</span>
          <div className="big-grid"> {
            [...Array(8).keys()].map(i => {
              return <Challenge type="grand gravity" num={i + 1} />
            })
          } </div>
        </div>
      )
    case 2:
      return lock(
        <div className="container label">
          <button className={`s${getNextColor(ntab) + 1} sub-header`} onClick={() => buyMaxUpgrades("grand gravity")}>buy max</button>
          <div className="medium-grid"> {
            [...Array(8).keys()].map(i => {
              return <Upgrade type="grand gravity" num={i + 1} />
            })
          } </div>
        </div>
      )
    case 3:
      for (let x in objekts.Atom01) {
        count += objekts.Atom01[x].length
      }
      return lock(
        <div>
          <h4 className="label"><span>you have {count} objekt{count !== 1 ? "s" : ""}.</span></h4>
          <h5 className="label"><span>each 100 objekt unlocks an autobuyer, and each other objekt speeds up the corresponding autobuyer.</span></h5>
          <h5 className="label"><span>each objekt also multiplies your sacrifice boost by {format(1.041 * (13 ** upgrades["grand gravity"][5]))}.</span></h5>
          <ObjektGrid season="Atom01" clss={subtab + 1} startNumber={0} stopNumber={8} />
        </div>
      )
    case 4:
      let milestoneCompletion = JSON.parse(localStorage.getItem("milestones"))
      let count1 = 0
      let count2 = 0
      return <div className="milestone-grid grid"> {
        milestones["grand gravity"].map(row => {
          count1++
          count2 = 0
          return Object.keys(row).map(m => {
            count2++
            let style = {opacity: 0}
            if (milestoneCompletion["grand gravity"][count1-1][count2-1]) {
              style = {
                "background-color": "#00ff00",
                opacity: 0.25
              }
            }
            return <div className="milestone">
              <div className="milestone-indicator" style={style}></div>
              <div className="milestone-label">
                <h5 className="milestone-label-text">{`"${row[m].name}"`}</h5>
              </div>
              <div className="milestone-description">
                <h5 className="milestone-description-text">{row[m].description}</h5>
              </div>
              <img className="milestone-img" alt={`milestone for ${row[m].name}`} src={row[m].image} />
            </div>
          })
        })
      } </div>
    case 5:
      return [...Array(autostory()[0] + 1).keys()].map(i => {
        return <Story num={i} />
      })
    case 6:
      switch (subtab) {
        case 0:
          return (
            <div className="big-grid">
              <button className={`s${getNextColor(ntab) + 1} big`} onClick={impt}>import</button>
              <button className={`s${getNextColor(ntab) + 2} big`} onClick={expt}>export</button>
              <button className={`s${getNextColor(ntab) + 3} big`} onClick={reset}>hard reset</button>
            </div>
          )
        case 1:
          return (
            <div>
              {
                Object.keys(settings).map(k => {
                  count += 1
                  return <button className={`s${getNextColor(ntab) + count} sub-header`} onClick={() => toggleSetting(k)}>{k}: {settings[k] ? "on" : "off"}</button>
                })
              } 
            </div>
          )
        case 2:
          return (
            <div>
              {[...Array(24).keys()].map(i => {
                return (
                  <ColorInput s={i + 1} />
                )
              })}
              <button onClick={reset_colors} className="big center reset-colors">reset</button>
            </div>
          )
        default:
          break
      }
      break
    case 7:
      subobj = help[Object.keys(help)[subtab]]
      return Object.keys(subobj).map(i => {
        count++
        return <Accordion num={getNextColor(ntab) + count - 1} head={i} body={subobj[i]} />
      })
    case 8:
      subobj = about[Object.keys(about)[subtab]]
      return Object.keys(subobj).map(i => {
        count++
        return <Accordion num={getNextColor(ntab) + count - 1} head={i} body={subobj[i]} />
      })
    default:
      return
  }
}

// from http://www.w3.org/TR/WCAG20/#relativeluminancedef
function luminance(color) {
  let [R8bit, G8bit, B8bit] = color

  let RsRGB = R8bit/255;
  let GsRGB = G8bit/255;
  let BsRGB = B8bit/255;

  let R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
  let G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
  let B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

  // For the sRGB colorspace, the relative luminance of a color is defined as: 
  let L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  return L;
}

export function changeColor(className, color) {
  if (/^#[0-9A-F]{6}$/i.test(color) || /^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    const items = document.querySelectorAll("." + className)

    const int = (color.length - 1) / 3
    const sep = [...Array(3).keys()].map((i) => {
      let val = parseInt(color.slice(i * int + 1, i * int + int + 1), 16)
      return val
    })

    for (let i in items) {
      let item = items[i]
      if (typeof item === "object") {
        if (!item.classList.contains("noborder")) {
          item.style.border = `2px solid ${color}`
        }
        item.style.borderRadius = "5px"
        item.style.padding = "auto 5px"
        if (item.classList.contains("invert")) {
          item.style.backgroundColor = "black"
          item.style.color = color
        } else {
          if (item.classList.contains("translucent")) {
            item.style.backgroundColor = 'rgba(' + sep.join(',') + ', 0.25)'
          } else if (item.classList.contains("transparent")) {
            item.style.backgroundColor = 'rgba(' + sep.join(',') + ', 0)'
          } else {
            item.style.backgroundColor = color
          }
          let c = luminance(sep)
          const blackBackground = (c + 0.05) / (0 + 0.05) >= (1 + 0.05) / (c + 0.05)
          item.style.color = blackBackground ? "black" : "white"
        }
      }
    }
  }
}
