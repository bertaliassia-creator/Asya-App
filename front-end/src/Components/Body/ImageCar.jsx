import React from 'react'
import "./ImageCar.css"

function ImageCar() {
  return (
    <div className="imageCar">

      <h1 id="title">
        WELCOME TO <span style={{color:"#007bff"}}>SENS</span> CARS
      </h1>
      <h2 class="simple-title">"Make The Better Move"</h2>
      <div className="img_container">
        <img 
        src="https://i.pinimg.com/1200x/aa/c9/76/aac976470dddd8538326acc060ea8fb3.jpg" 
        alt="car"
        id="img_cover"
        />
      </div>

    </div>
  )
}

export default ImageCar