import { format } from './mini'

function arrayIsEmpty(array) {
  if (!Array.isArray(array)) {
    return false;
  }
  if (array.length === 0) {
    return true;
  }
  return false;
}

export function grandGravity(giveObjekt = true, finishChallenge = true, newMessage = "") {
  localStorage.setItem('sacrifice', JSON.stringify(1))

  let dimObj = JSON.parse(localStorage.getItem('dimensions'))
  for (let s in dimObj.S) {
    dimObj.S[s] = {
      bought: 0,
      total: 0
    }
  }
  for (let c in dimObj.como) {
    dimObj.como[c].total = dimObj.como[c].bought
  }
  localStorage.setItem('dimensions', JSON.stringify(dimObj))

  let prestige = JSON.parse(localStorage.getItem('prestige'))

  if (giveObjekt) {
    let objekts = JSON.parse(localStorage.getItem('objekts'))

    let no100 = []
    for (const member in objekts.Atom01) {
      if (arrayIsEmpty(objekts.Atom01[member])) {
        no100.push(member)
      }
      objekts.Atom01[member] = [...new Set(objekts.Atom01[member])]
    }

    let gainedObjekt = ""

    if (arrayIsEmpty(no100)) {
      let leftMembers = []
      for (let member in objekts.Atom01) {
        if (objekts.Atom01[member].length < 9) {
          leftMembers.push(member)
        } else {
          console.log(member, objekts.Atom01[member])
        }
      }
      if (!arrayIsEmpty(leftMembers)) {
        const member = leftMembers[Math.floor(Math.random(leftMembers.length))]
        let leftObjekts = []
        for (let i in [...Array(9).keys()]) {
          if (!objekts.Atom01[member].includes(parseInt(i) + 100)) {
            leftObjekts.push(parseInt(i) + 100)
          }
        }
        const serial = leftObjekts[Math.floor(Math.random(leftObjekts.length))]
        gainedObjekt = member + " " + serial
        objekts.Atom01[member].push(parseInt(serial))
        objekts.Atom01[member].sort()
      }
    } else {
      const member = no100[Math.floor(Math.random() * no100.length)]
      objekts.Atom01[member] = [100]
      gainedObjekt = member + " 100"
    }
    localStorage.setItem('objekts', JSON.stringify(objekts))

    newMessage = `you got ${format(2 ** prestige.grandGravity.count)} como and a ${gainedObjekt} objekt.`
  }

  if (finishChallenge) {
    let inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
    if (inChallenge["grand gravity"]) {
      prestige.grandGravity.challenges.push(inChallenge["grand gravity"])
    }
    prestige.grandGravity.count += 1
    localStorage.setItem('prestige', JSON.stringify(prestige))

    inChallenge["grand gravity"] = 0
    localStorage.setItem('inchallenge', JSON.stringify(inChallenge))
  }

  let currency = JSON.parse(localStorage.getItem('currency'))
  currency.S = 2
  currency.como += 2 ** prestige.grandGravity.count
  if (finishChallenge) {
    currency.comoDust = 0
  }
  localStorage.setItem('currency', JSON.stringify(currency))

  let times = JSON.parse(localStorage.getItem('times'))
  times["grand gravity"] = Date.now()
  localStorage.setItem('times', JSON.stringify(times))

  let alerts = JSON.parse(localStorage.getItem('alerts'))
  alerts['grand-gravity-' + prestige.grandGravity.count] = {
    message: newMessage,
    time: Date.now()
  }
  localStorage.setItem('alerts', JSON.stringify(alerts))
}
