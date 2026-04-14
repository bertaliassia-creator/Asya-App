import logo from './logo.svg';
import './App.css';
import Header from './Components/Header/Header';
import Body from './Components/Body/Body';
import { Route, Routes } from 'react-router-dom';
import LogIn from './Components/Login/LogIn';
import Register from './Components/Login/Register';
import HomeUser from './Components/Pages/User/HomeUser';
import HomeAdmin from './Components/Pages/Admin/HomeAdmin';
import ProtectedRouteAdmin from './Components/ProtectedRouteAdmin';
import ProtectedRouteClient from './Components/ProtectedRouteClient';
import DashBoard from './Components/Pages/Admin/DashBoard';
import AjouterVoiture from './Components/Pages/Admin/AjouterVoiture';
import Reservation from './Components/Pages/Admin/Reservation';
import Clients from './Components/Pages/Admin/Clients';
import Statistiques from './Components/Pages/Admin/Statistiques';
import Profile from './Components/Pages/Admin/Profile';
import NosVoiture from './Components/Pages/Admin/NosVoiture';
import ModifierVoiture from './Components/Pages/Admin/ModifierVoiture';
import ModifierClient from './Components/Pages/Admin/ModifierClient';
import DashboardClient from './Components/Pages/User/DashboardClient';
import Voitures from './Components/Pages/User/Voitures';
import ReserverVoiture from './Components/Pages/User/ReserverVoiture';
import MesReservation from './Components/Pages/User/MesReservation';
import ProfileC from './Components/Pages/User/ProfileC';
import DetailsClient from './Components/Pages/Admin/DetailsClient';
import DetailsReservation from './Components/Pages/Admin/DetailsReservation';
import VoituresClient from './Voiture/VoituresClient';


function App() {
  return (
    <div>
     <Routes>
        <Route path='/' element={<><Header/><Body/></>} />
        <Route path='/logIn' element={<><Header/><LogIn/></>} />
        <Route path='/Register' element={<><Header/><Register/></>} />
         <Route path="/voiture" element={ <> <Header/><VoituresClient /></>} />

        <Route path='/client' element={
          <ProtectedRouteClient>
            <DashboardClient/>
          </ProtectedRouteClient>
        } >
          <Route path='Voitures' element={<Voitures/>} />
          <Route path='reservation/:voitureId' element={<ReserverVoiture/>} />
          <Route path='MesReservation' element={<MesReservation/>} />
          <Route path="/client/profile" element={<ProfileC />} />





        </Route>

        <Route path='/admin' element={
          <ProtectedRouteAdmin>
            <DashBoard/>
          </ProtectedRouteAdmin>
        }>
          {/* جميع المسارات داخل admin كـ relative */}
          <Route path='NosVoitures' element={<><NosVoiture/></>} />
          <Route path='AjouterVoiture' element={<AjouterVoiture/>} />
          <Route path='Reservation' element={<Reservation/>} />
          <Route path='Clients' element={<Clients/>} />
          <Route path='Statistiques' element={<Statistiques/>} />
          <Route path='Profile' element={<Profile/>} />
          <Route path="modifier/:id" element={<ModifierVoiture />} />
          <Route path="modifierProfile/:id" element={<ModifierClient />} />
            <Route path="DetailsClient/:id" element={<DetailsClient />} />
            <Route path="reservation/:id" element={<DetailsReservation />} />
           




        </Route>
      </Routes>
        
    </div>
  );
}

export default App;
