import { story } from './lines';

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
  const bought = JSON.parse(localStorage.getItem('dimensions'))[type][num.toString()].bought
  return 2 ** (num * (num + bought))
}

export function maxdim() {
  const dims = JSON.parse(localStorage.getItem('dimensions'));

  /* number of dimensions to render */
  for (let d = 1; d <= 24; d++) {
    if (!dims["S"][d.toString()].total) {
      return d
    }
  }
}

export function autostory() {
  const conds = [
    true,
    maxdim() === 1, 
    maxdim() === 2,
    maxdim() === 8,
  ]
   
  for (let i = 0; i < conds.length; i++) {
    if (!conds[i + 1]) {
      return story[i]
    }
  }

  return story.slice(-1)
}

export function tick(tickspeed) {
  const dims = JSON.parse(localStorage.getItem('dimensions'));
  const currency = JSON.parse(localStorage.getItem('currency'));

  for (const dim in dims) {
  
    const maxDim = maxdim()
    const boosts = (24 ** maxDim) * (maxDim ** maxDim)
    currency[dim] += Number(dims[dim]["1"].total) * boosts / 1000 * tickspeed

    for (const gen in dims[dim]) {
      if (gen < 24) {
        const boosts = (25/24) ** dims[dim][Number(gen).toString()].bought
        dims[dim][gen].total += Number(dims[dim][(Number(gen) + 1).toString()].total) * boosts / 1000 * tickspeed
      }
    }
  }

  localStorage.setItem('dimensions', JSON.stringify(dims))
  localStorage.setItem('currency', JSON.stringify(currency))

  return currency.S
}

export function switchTab(tab) {
   
}
