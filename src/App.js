//COMPONENTS
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AuthRouter from './components/AuthRouter'

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
import Changepassword from './pages/Changepassword';

// MUI SHITS
import {  ThemeProvider } from '@mui/styles';
import {  createTheme } from '@mui/system';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar/>
        <AuthRouter>
          <Routes>
            <Route path="/" exact={true} element={<LoginPage/>}></Route>
            <Route path="/viewinvt" element={<ViewInventory/>}></Route>
            <Route path="/viewallorders" element={<ViewAllOrders/>}></Route>
            <Route path="/myprofile/:id" element={<Profile/>}></Route>
            <Route path="/changepassword/:token" element={<Changepassword/>}></Route>
            <Route path="/deliveries" element={<Delivery/>}></Route>
            <Route path="/order/:id" element={<Order/>}></Route>
            <Route path="/order/:orderId/:orderItemId" element={<OrderItem/>}></Route>
            <Route path="/viewinvt/:id" element={<Product/>}></Route>
            <Route path="/home" element={<ViewOrders/>}></Route>
            <Route path="/users" element={<User/>}></Route>
            <Route path="/user/:id" element={<UserDeets/>}></Route>
            <Route path="/verify/:token" element={<VerifyingPage/>}></Route>
            <Route path="*" element={<DefaultPage/>} />
          </Routes>
        </AuthRouter>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
