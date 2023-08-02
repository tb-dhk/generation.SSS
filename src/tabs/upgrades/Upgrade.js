import upgrades from "../../extra/lines.js"

const invert = (element, truth) => {
  let button = element.currentTarget
  if (truth) {
    button.classList.remove("translucent")
    for (let c in button.children) {
      if (typeof button.children[c] === "object") {
        button.children[c].classList.remove("white")
      }
    }
  } else {
    button.classList.add("translucent")
    for (let c in button.children) {
      if (typeof button.children[c] === "object") {
        button.children[c].classList.add("white")
      }

    }
  }
}

function Upgrade({ type, num }) {
  return (
    <button className={`s${num} medium translucent`} onMouseEnter={(element) => invert(element, true)} onMouseLeave={(element) => invert(element, false)}>
      <h4 className={`s${num} white noborder transparent lower`}>name</h4>
      <h5 className={`s${num} white noborder transparent lower`}>description</h5>
      <h5 className={`s${num} white noborder transparent lower`}>price</h5>
    </button>
  )
}

export default Upgrade
