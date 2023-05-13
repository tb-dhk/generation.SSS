import Dimension from './Dimension'

export function Dimensions(renderdim, tickspeed) {
  return (
    <div> 
      {
        [...Array(renderdim).keys()].map(i =>{
          console.log(i, renderdim, [...Array(renderdim).keys()])
          return <Dimension type="S" num={i+1} tickspeed={tickspeed} />
        })
      } 
    </div>
  )
}
