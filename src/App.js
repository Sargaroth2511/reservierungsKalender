import { BrowserRouter, Routes, Route } from "react-router-dom";
import Reservations from "./pages/reservations";
import Orders from "./pages/orders";

import Home from "./pages/home";


function App(props) {
  return (  
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route index element={<Home/>}/>
      <Route path="reservations" element={<Reservations db={props.db} />}/>
      <Route path="orders" element={<Orders db={props.db} />}/>
    </Routes>
    </BrowserRouter>
  
  );
}

export default App;
