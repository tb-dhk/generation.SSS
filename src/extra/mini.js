import Dimension from '../tabs/dimensions/Dimension'
import Challenge from '../tabs/challenges/Challenge'
import Story from '../tabs/story/Story'
import ObjektGrid from '../tabs/objekt/ObjektGrid'
import ColorInput from '../tabs/settings/ColorInput'
import Accordion from '../tabs/misc/Accordion'
import { help, about } from './lines'
import { impt, expt } from './save'
import { buyDim } from '../tabs/dimensions/Dimension'
import { autostory } from '../tabs/story/StoryPopup'
import { grandGravity } from '../extra/prestige'

export function format(num) {
  num = Math.round(num * 1000)/1000
  const str = num.toString()
  if (num >= 1000) {
    return num.toExponential(3).replace("+", "")
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

export function maxdim(currency="S") {
  const dims = JSON.parse(localStorage.getItem('dimensions'));

  /* number of dimensions to render */
  for (let d = 1; d <= 24; d++) {
    if (!dims[currency]["S"+d].total) {
      return d
    }
  }
}

export function tick(tickspeed) {
  const dims = JSON.parse(localStorage.getItem('dimensions'));
  const currency = JSON.parse(localStorage.getItem('currency'));
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'));
  const times = JSON.parse(localStorage.getItem('times'));
  const ggc6 = JSON.parse(localStorage.getItem('ggc6'));

  const generatedCurrency = {
    S: "S",
    como: "comoDust"
  }

  for (const dim of ["S", "como"]) {
    const maxDim = maxdim()
    const boosts = (maxDim ** maxDim)
    let defCurrencyGain = Number(dims[dim]["S1"].total) * boosts / 1000 * tickspeed
    if (currency.comoDust) {
      defCurrencyGain *= (currency.comoDust ** (1/24))
    }
    if (inChallenge["grand gravity"] === 2) {
      defCurrencyGain *= (24 ** ((Date.now() - times["grand gravity"])/1000000)) * 1/24
    } else if (inChallenge["grand gravity"] === 6) {
      defCurrencyGain *= ggc6[0]
    }
    currency[generatedCurrency[dim]] += defCurrencyGain
    if (currency[generatedCurrency[dim]] > 24**24 && dim === "S") {
      currency[generatedCurrency[dim]] = 24**24
    }
    
    for (const genName in dims[dim]) {
      const gen = parseInt(genName.slice(1))
      if (gen < 24 && gen <= maxdim()) {
        const boosts = (25/24) ** dims[dim][genName].bought
        let next = gen + 1
        switch (inChallenge["grand gravity"]) {
          case 7:
            next = "S" + (gen + 2)
            break
          case 8:
            let list = [3, 5, 4, 6, 7, 0, 8, 0]
            next = "S" + list[gen - 1]
            break
          default:
            next = "S" + (gen + 1)
        }
        if (next) {
          let defGain = Number(dims[dim][next].total) * boosts / 1000 * tickspeed
          if (inChallenge["grand gravity"] === 6) {
            defCurrencyGain *= ggc6[gen]
          }
          dims[dim][genName].total += defGain
        }
      }
    }
  }

  localStorage.setItem('dimensions', JSON.stringify(dims))
  localStorage.setItem('currency', JSON.stringify(currency))

  autobuy()
}

export function autobuy() {
  const autobuyers = JSON.parse(localStorage.getItem('autobuyers'))
  const objekts = JSON.parse(localStorage.getItem('objekts'))

  let dims = ["S", "como"]

  for (var j = 0; j < 1; j++) {
    for (var i in objekts.Atom01) {
      let objs = objekts.Atom01[i].filter(c => c.toString()[0] === "1")
      const remaining = (Math.floor(2 ** (9 - objs.length) - (Date.now() - autobuyers[dims[j]][i]) / 1000))
      if (objekts.Atom01[i].includes(100) && (remaining < 0)) {
        buyDim(dims[j], parseInt(i.slice(1)), true)
        autobuyers[dims[j]][i] = Date.now()
      }
    }
  }
  
  localStorage.setItem('autobuyers', JSON.stringify(autobuyers))
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

export function getSubTabs(tab) {
  const subTabs = [
    ["S", "como"],
    ["grand gravity"],
    ["single class", "double class"],
    ["part 1"],
    ["colors", "save"],
    Object.keys(help),
    Object.keys(about)
  ]
  return subTabs[tab]
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
        <p>get 24^24 S and perform a grand gravity to unlock this section!</p>
      </div>
    )
  }
}

export function renderTab(tab, subtab) {
  const tickspeed = JSON.parse(localStorage.getItem('tickspeed'))
  const currency = JSON.parse(localStorage.getItem('currency'))
  const inChallenge = JSON.parse(localStorage.getItem('inchallenge'))

  let renderDim = 8
  if (tab === 0) {
    renderDim = maxdim(getSubTabs(tab)[subtab])
  }

  let count = 0
  let subobj = {}

  function reset_colors() {
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
        s14 : "#1222b5",
        s15 : "#d51312"
      }
      localStorage.setItem('colors', JSON.stringify(colors))
  }

  switch(tab) {
    case 0:
      if (currency.S < 24**24) {
        let limit = 8
        if (inChallenge["grand gravity"] === 4) {
          limit = 6
        }
        return (
          <div>
            {[...Array(renderDim < limit ? renderDim : limit).keys()].map(i => {
              return <Dimension type={getSubTabs(tab)[subtab]} num={i+1} tickspeed={tickspeed} />
            })}
          </div>
        )
      } else {
        return (
          <div className="invert grandgrav">
            <h3 className="invert">boom!</h3>
            <h4 className="invert">too much S!</h4>
            <button className="grandgrav-button" onClick={grandGravity}>grand gravity!</button>
          </div>
        )
      }
    case 1:
      return lock(
        <div className="big-grid"> {
          [...Array(8).keys()].map(i => {
            return <Challenge type={getSubTabs(tab)[subtab]} num={i+1} />
          })
        } </div>
      )
    case 2:
      return lock(
        <div>
          <ObjektGrid season="Atom01" clss={subtab+1} startNumber={0} stopNumber={8} />
        </div>
      )
    case 3:
      return [...Array(autostory()[0]+1).keys()].map(i => {
        return <Story num={i} />
      }) 
    case 4:
      switch (subtab) {
        case 0:
          return (
            <div>
              {[...Array(24).keys()].map(i => {
                return (
                  <ColorInput s={i+1} />
                )
              })}
              <button onClick={reset_colors} className="big center">reset</button>
            </div>
          )
        case 1:
          return (
            <div className="big-grid">
              <button className="s1 big" onClick={impt}>import</button>
              <button className="s2 big" onClick={expt}>export</button>
            </div>
          )
        default:
          break
      }
      break 
    case 5: 
      subobj = help[Object.keys(help)[subtab]]
      return Object.keys(subobj).map(i => {
        count++
        return <Accordion num={count-1} head={i} body={subobj[i]} />
      })
    case 6:
      subobj = about[Object.keys(about)[subtab]]
      return Object.keys(subobj).map(i => {
        count++
        return <Accordion num={count-1} head={i} body={subobj[i]} />
      })
    default:
      return
  }
}

export function changeColor(className, color, currentTab, subTab) {
  if (/^#[0-9A-F]{6}$/i.test(color) || /^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    const items = document.querySelectorAll("." + className)

    const int = (color.length - 1) / 3
    const sep = [...Array(3).keys()].map((i) => {
      let val = parseInt(color.slice(i*int+1, i*int+int+1), 16)
      if (int === 2) {
        val /= 16
      }
      return val
    })
    const avg = sep.reduce(( p, c ) => p + c, 0) / sep.length

    items.forEach(item => {
      item.style.backgroundColor = color
      item.style.color = avg >= 8 ? "black" : "white"
    })

    try {
      if (parseInt(className.slice(1)) === currentTab + 1) {
        const currentTabDiv = document.querySelectorAll(`button.tab.${className}`)[0]
        currentTabDiv.style.backgroundColor = "black" 
        currentTabDiv.style.color = color
      }
    } catch {}

    try {
      if (parseInt(className.slice(1)) === subTab + 1) {
        const subTabDiv = document.querySelectorAll(`button.subtab.${className}`)[0]
        subTabDiv.style.backgroundColor = "black"
        subTabDiv.style.color = color
      }
    } catch {}
  }  
}
