function ColorInput({ s }) {
  let colors = JSON.parse(localStorage.getItem('colors'))

  function handleChange(event) {
    const color = event.target.value
    if (/^#[0-9A-F]{6}$/i.test(color) || /^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      colors[`s${s}`] = color
      localStorage.setItem('colors', JSON.stringify(colors))
    } else {
    }
  }

  return (
    <div className={`s${s} colorinput ${s}`}>
      <label className={`s${s}`}>s{s}</label>
      <input type="text" placeholder={colors[`s${s}`]} onChange={handleChange}></input> 
    </div>
  )
}

export default ColorInput 
