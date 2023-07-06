export const import(str) {
  const object = JSON.parse(atob(str))
  for (let key in object) {
    localStorage.setItem(key, JSON.stringify(object[key]))
  }
}

export const export(str) {
  const object = btoa(JSON.stringify(localStorage))
}
