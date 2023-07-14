import ReactMarkdown from 'react-markdown'

function openPanel(num) {
  const label = document.getElementById(`accordion-label-${num}`)
  const panel = document.getElementById(`accordion-panel-${num}`)
  if (panel.style.display === "block") {
    label.classList.remove("invert")
    panel.style.display = "none";
  } else {
    label.classList.add("invert")
    panel.style.display = "block";
  }
}

function Accordion({ num, head, body }) {
  return (
    <div className="chapter">
      <button className={`accordion-label s${num + 1}`} id={`accordion-label-${num}`} onClick={() => openPanel(num)}>{head}</button>
      <div className="story accordion-panel" id={`accordion-panel-${num}`} style={{display: "none"}}>
        <ReactMarkdown children={body} id="accordion" />
      </div>
    </div>
  )
}

export default Accordion
