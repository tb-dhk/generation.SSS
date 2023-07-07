import close from '../../images/close.png'

function erasePopup(id) {
  let alerts = JSON.parse(localStorage.getItem('alerts'))
  document.getElementById('alert-'+id).style.display = "none"
  delete alerts[id]
  localStorage.setItem('alerts', JSON.stringify(alerts))
}

export function Alert({ alertId, message }) {
  return (
    <div id={"alert-" + alertId}>
      <button className="close" onClick={() => {erasePopup(alertId)}}>
        <img className="icon" src={close} alt="close"/>
      </button>
      <p>{message}</p>
    </div>
  )
}
