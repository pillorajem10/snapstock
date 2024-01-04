//COMPONENTS
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AuthRouter from './components/AuthRouter'
import Footer from './components/Footer'

//REACT ROUTER
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//PAGES
import ViewInventory from './pages/ViewInventory';
import ViewOrders from './pages/ViewOrders';
import ViewAllOrders from './pages/ViewAllOrders';
import Order from './pages/Order';
import OrderItem from './pages/OrderItem';
import Product from './pages/Product';
import Delivery from './pages/Delivery';
import User from './pages/User';
import LoginPage from './pages/LoginPage';
import UserDeets from './pages/UserDeets';
import DefaultPage from './pages/DefaultPage';
import VerifyingPage from './pages/VerifyingPage';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import ForgotPassword from './pages/ForgotPassword';
import Changepassword from './pages/Changepassword';
import ContactUs from './pages/ContactUs';

// MUI SHITS
import {  ThemeProvider } from '@mui/styles';
import {  createTheme } from '@mui/system';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="grid-container">
          <header>
            <Navbar/>
          </header>
          <main className="grid">
            <Routes>

              {/* ROUTES OS PAGES THAT DOESNT NEED TO BE LOGGED IN */}
              <Route path="/" exact={true} element={<LoginPage/>} />
              <Route path="/about" element={<AboutUs/>} />
              <Route path="/services" element={<Services/>} />
              <Route path="/contactus" element={<ContactUs/>} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/changepassword/:token" element={<Changepassword/>} />
              <Route path="*" element={<DefaultPage/>} />

              {/* ROUTES OS PAGES THAT NEED TO BE LOGGED IN */}
              <Route path="/viewinvt" element={<AuthRouter><ViewInventory/></AuthRouter>} />
              <Route path="/myprofile/:id" element={<AuthRouter><Profile/></AuthRouter>} />
              <Route path="/deliveries" element={<AuthRouter><Delivery/></AuthRouter>} />
              <Route path="/order/:id" element={<AuthRouter><Order/></AuthRouter>} />
              <Route path="/order/:orderId/:orderItemId" element={<AuthRouter><OrderItem/></AuthRouter>} />
              <Route path="/viewinvt/:id" element={<AuthRouter><Product/></AuthRouter>} />
              <Route path="/home" element={<AuthRouter><ViewOrders/></AuthRouter>} />
              <Route path="/users" element={<AuthRouter><User/></AuthRouter>} />
              <Route path="/user/:id" element={<AuthRouter><UserDeets/></AuthRouter>} />
              <Route path="/viewallorders" element={<AuthRouter><ViewAllOrders/></AuthRouter>} />
              <Route path="/verify/:token" element={<AuthRouter><VerifyingPage/></AuthRouter>} />
            </Routes>
          </main>
          <footer className="footer"><Footer/></footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
