import React, { useState, useEffect } from 'react'
import { autostory } from './StoryPopup'

function Story({ type, num }) {
  return (
    <div className={`s${num} challenge ${type}`}>
       
    </div>
  )
}

export default Story 
