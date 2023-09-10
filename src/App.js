//COMPONENTS
import Navbar from './components/Navbar'
import AuthRouter from './components/AuthRouter'

//REACT ROUTER
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//PAGES
import ViewInventory from './pages/ViewInventory';
import ViewOrders from './pages/ViewOrders';
import ViewAllOrders from './pages/ViewAllOrders';
import Order from './pages/Order';
import Product from './pages/Product';
import Delivery from './pages/Delivery';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <AuthRouter>
        <Routes>
          <Route path="/" exact={true} element={<LoginPage/>}></Route>
          <Route path="/viewinvt" element={<ViewInventory/>}></Route>
          <Route path="/viewallorders" element={<ViewAllOrders/>}></Route>
          <Route path="/deliveries" element={<Delivery/>}></Route>
          <Route path="/order/:id" element={<Order/>}></Route>
          <Route path="/viewinvt/:id" element={<Product/>}></Route>
          <Route path="/home" element={<ViewOrders/>}></Route>
        </Routes>
      </AuthRouter>
    </BrowserRouter>
  );
}

export default App;
