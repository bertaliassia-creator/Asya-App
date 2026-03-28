import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

function ErrorAlert(props) {
    const msg = props.msg 
  return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <FontAwesomeIcon icon={faCircleXmark} className="me-2" />
      <div>
        {msg}
      </div>
    </div>
  )
}

export default ErrorAlert