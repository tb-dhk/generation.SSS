export const import(str) {
  const object = JSON.parse(str)
  for (let key in object) {
    localStorage.setItem(key, JSON.stringify(object[key]))
  }
}
