function Challenge({ type, num }) {
  return (
    <div className={`s${num} challenge ${type}`}>
      <h3 className={`s${num}`}>{type} challenge {num}</h3>
      <h4 className={`s${num}`}>description description</h4>
      <button className="challengebutton">start!</button>
    </div>
  )
}

export default Challenge 
