function objekt(clss, memberMin, memberMax, serialMin, serialMax) {
  return (Math.floor(Math.random() * (memberMax - memberMin + 1)) + memberMin), clss.toString() + (Math.floor(Math.random() * serialMax - serialMin + 1) + serialMin).toString().padStart(2, '0'); 
} 

export function grandGravity() {
  let dimObj = JSON.parse(localStorage.getItem('dimensions'))
  const dims = Object.fromEntries(
    [...Array(24).keys()].map(x => [x+1, {bought: 0, total: 0}])
  )
  dimObj.S = dims
  localStorage.setItem('dimensions', JSON.stringify(dimObj))

  let objekts = JSON.parse(localStorage.getItem('objekts'))

  let no100 = []
  for (const member in objekts) {
    if (objekts[member] === []) {
      no100.append(member)
    }
  }

  if (no100 === []) {
    let [member, serial] = objekt(1, 1, 8, 1, 8)
    objekts[member].append(serial)
    objekts[member].sort()
  } else {
    objekts[no100[Math.floor(Math.random()*no100.length)]] = [100]
  }
  localStorage.setItem('objekts', JSON.stringify(objekts))

  let prestige = JSON.parse(localStorage.getItem('prestige'))
  let inChallenge = JSON.parse(localStorage.getItem('inchallenge'))
  if (inChallenge["grand gravity"]) {
    prestige.grandGravity.challenges.push(inChallenge["grand gravity"])
  }
  prestige.grandGravity.count += 1
  localStorage.setItem('prestige', JSON.stringify(prestige))

  inChallenge["grand gravity"] = 0
  localStorage.setItem('inchallenge', JSON.stringify(inChallenge))

  let currency = JSON.parse(localStorage.getItem('currency'))
  currency.S = 2
  currency.como += 2 ** prestige.grandGravity.count
  localStorage.setItem('currency', JSON.stringify(currency))

  let times = JSON.parse(localStorage.getItem('times'))
  times["grand gravity"] = Date.now()
  localStorage.setItem('times', JSON.stringify(times))
}
