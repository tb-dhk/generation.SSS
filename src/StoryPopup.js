import { autostory } from './mini'

export function StoryPopup() {
  const chapter = localStorage.getItem('story')
  if (chapter !== autostory()) {
    return (
      <div>
        <h3>slay!</h3>
      </div>
    )
  }
}
