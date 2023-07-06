import ReactMarkdown from 'react-markdown'
import { maxdim } from '../../extra/mini'
import close from '../../images/close.png'
import { story } from '../../extra/lines'

function erasePopup(id) {
  document.getElementById(id).style.display = "none"
  const chapter = localStorage.getItem('story')
  localStorage.setItem('story', parseInt(chapter) + 1)
}

export function autostory() {
  const md = maxdim()
  const dims = JSON.parse(localStorage.getItem('dimensions'))
  const prestige = JSON.parse(localStorage.getItem('prestige'))
  
  const conds = [
    true,
    md >= 1 && dims.S["S1"].total > 0, 
    md >= 2,
    parseInt(dims.S.S8.total) > 0,
    parseInt(prestige.grandGravity.count) > 0
  ]
   
  for (let i = conds.length - 1; i >= 0; i--) {
    if (conds[i]) {
      return [i, story[i]]
    }
  }

  return [story.length - 1, story.slice(-1)]
}

export function StoryPopup() {
  const chapter = parseInt(localStorage.getItem('story'))
  const story = autostory()[1]
  console.log(chapter, autostory()[0])

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
  return <div>nostory, {maxdim()}</div>
}
