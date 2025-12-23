import { useAcceptInvitation } from '@/hooks/workshopHook'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const AcceptInvitation = () => {
    

      const {id} = useParams()
  const {mutate} = useAcceptInvitation()

  console.log(id)
   useEffect(() => {
  if (id) {
    mutate(id)
  }
}, [id])
  return (
    <div>AcceptInvitation</div>
  )
}

export default AcceptInvitation