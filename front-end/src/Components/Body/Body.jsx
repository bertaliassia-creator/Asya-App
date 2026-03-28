import React from 'react'
import ImageCar from './ImageCar'
import Services from './Services'
import PourquoiNousChoisir from './PourquoiNousChoisir'
import About from './About'
import Contact from './Contact'
import Footer from './Footer'

function Body() {
  return (
    <div>
      <ImageCar/>
      <Services/>
      <PourquoiNousChoisir/>
      <About/>
      <Contact/>
      <Footer/>
    </div>
  )
}

export default Body
