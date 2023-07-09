export function impt() {
  let str = prompt("enter your save.")
  str = Array.prototype.filter.call(str, n => n !== "\\")
  if (str !== null) {
    try {
      let decoded = window.atob(str)
      console.log(decoded)
      const object = JSON.parse(decoded)
      for (let key in object) {
        console.log(key)
        console.log(object[key])
        localStorage.setItem(key, JSON.stringify(object[key]))
      }
    } catch { }
  }
}

export function expt() {
  const object = btoa(JSON.stringify(localStorage))
  navigator.clipboard.writeText(object)
}
