export function impt() {
  let str = prompt("enter your save.")
  str = Array.prototype.filter.call(str, n => n !== "\\")
  if (str !== null) {
    try {
      const object = JSON.parse(atob(str))
      for (let key in object) {
        localStorage.setItem(key, JSON.stringify(object[key]))
      }
    } catch {}
  }
}

export function expt() {
  const object = btoa(JSON.stringify(localStorage))
  navigator.clipboard.writeText(object)
}
