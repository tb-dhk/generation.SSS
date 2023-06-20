import ReactMarkdown from 'react-markdown'
import { story } from '../../extra/lines'

function openPanel(num) {
  const panel = document.getElementById(`ch${num}`)
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }}

function Story({ num }) {
  return (
    <div className="chapter">
      <button className={`accordion s${num + 1}`} onClick={() => {openPanel(num)}}>chapter {num}</button>
      <div className="story panel" id={`ch${num}`}>
        <ReactMarkdown className={`s${num + 1}`} children={story[num]} id="storytext" />
      </div>
    </div>
  )
}

export default Story 
