import { useNavigate } from "react-router-dom";
import NavigationButton from "../components/navigationButton";
import OrderWindow from "./../components/orders/orderWindow"
import "./../components/orders/orderStyles.scss"


const Orders = props => {
    const navigate = useNavigate();
    return ( 
    <div className="container">
      <NavigationButton className='home-button' onClick={() => navigate("/")} text={"Home"} />
      <h1>Bestellungen</h1>
      <button className="navi-button standard-box">Bestellung ändern</button>
      <button className="navi-button standard-box">Bestellung stornieren</button>
      <button className="navi-button standard-box">Bestellung anzeigen</button>
      <OrderWindow db={props.db} />
    </div> );
}
 
export default Orders;