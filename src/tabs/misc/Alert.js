import close from '../../images/close.png'

export function Alert({ message }) {
  return (
    <div id="story">
      <button className="close" onClick={() => {}}>
        <img className="icon" src={close} alt="close"/>
      </button>
      <p>{message}</p>
    </div>
  )
}
