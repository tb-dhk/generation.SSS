import { story } from '../../extra/lines'
import Accordion from '../misc/Accordion'

function Story({ num }) {
  return <Accordion num={num} head={"chapter " + num} body={story[num]} />
}

export default Story 
