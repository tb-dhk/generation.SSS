import ReactMarkdown from 'react-markdown'
import { story } from '../../extra/lines'
import Accordion from '../misc/Accordion'

function openPanel(num) {
  const panel = document.getElementById(`ch${num}`)
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }}

function Story({ num }) {
  return <Accordion num={num} head={"chapter " + num} body={story[num]} />
}

export default Story 
