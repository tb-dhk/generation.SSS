import ReactMarkdown from 'react-markdown'
import { maxdim } from '../../extra/mini'
import close from '../../images/close.png'
import { story } from '../../extra/lines'

function erasePopup(id) {
  document.getElementById(id).style.display = "none"
  const chapter = localStorage.getItem('story')
  localStorage.setItem('story', chapter + 1)
}

export function autostory() {
  const md = maxdim()
  const dims = JSON.parse(localStorage.getItem('dimensions'))
  
  const conds = [
    true,
    md >= 1 && dims.S["S1"].total > 0, 
    md >= 2,
    md >= 8,
  ]
   
  for (let i = 0; i < conds.length; i++) {
    if (!conds[i + 1]) {
      return [i, story[i]]
    }
  }

  return [story.length - 1, story.slice(-1)]
}

export function StoryPopup() {
  const chapter = localStorage.getItem('story')
  const story = autostory()[1]

  if (chapter <= autostory()[0]) {
    return (
      <div id="story" className="popup">
        <button className="close" onClick={() => erasePopup("story")}>
          <img className="icon" src={close} alt="close"/>
        </button>
        <ReactMarkdown children={story} id="storytext" />
      </div>
    )
  }
}
