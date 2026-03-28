import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

function SingUpSuccess() {
  return (
    <div className="alert alert-success d-flex align-items-center" role="alert">
      <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
      <div>
        Inscription réussie !
      </div>
    </div>
  )
}

export default SingUpSuccess