import fileDownload from 'js-file-download'

export function impt() {
  let str = prompt("enter your save.")
  if (String(str) !== "null") {
    str = Array.prototype.filter.call(str, n => n !== "\\").join("")
    let decoded = window.atob(str)
    const object = JSON.parse(decoded)
    for (let key in object) {
      localStorage.setItem(key, JSON.stringify(object[key]))
    }
  }
}

export function expt() {
  let alerts = JSON.parse(localStorage.getItem("alerts"))
  
  let saveToFile = false
  try {
    saveToFile = JSON.parse(localStorage.getItem("settings"))["save to file"]
  } catch {}

  let object = {}
  for (let key in localStorage) {
    if (typeof localStorage[key] !== "function") {
      object[key] = JSON.parse(localStorage[key])
    }
  }

  let encoded = btoa(JSON.stringify(object))
  navigator.clipboard.writeText(encoded)

  alerts["export" + Date.now()] = {
    message: "copied to clipboard",
    time: Date.now()
  }
  localStorage.setItem("alerts", JSON.stringify(alerts))

  if (saveToFile) {
    console.log(encoded)
    fileDownload(encoded, `generation.SSS_${Date.now()}.txt`)
  }
}
