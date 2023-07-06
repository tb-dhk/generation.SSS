function Accordion({ num, head, body }) {
  return (
    <div className="chapter">
      <button className={`accordion s${num + 1}`} onClick={() => {openPanel(num)}}>{head}</button>
      <div className="story panel" id={`ch${num}`}>
        <ReactMarkdown className={`s${num + 1}`} children={body} id="accordion" />
      </div>
    </div>
  )}
