//COMPONENTS
import Navbar from './components/Navbar'

//REACT ROUTER
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//PAGES
import AddOrder from './pages/AddOrder';
import ViewInventory from './pages/ViewInventory';
import ViewOrders from './pages/ViewOrders';
import Order from './pages/Order';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" exact={true} element={<AddOrder/>}></Route>
        <Route path="/viewinvt" element={<ViewInventory/>}></Route>
        <Route path="/vieworders" element={<ViewOrders/>}></Route>
        <Route path="/order/:id" element={<Order/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
