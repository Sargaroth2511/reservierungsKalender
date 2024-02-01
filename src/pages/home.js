import { useNavigate } from "react-router-dom";

import NavigationButton from "../components/navigationButton";

const Home = () => {
  let navigate = useNavigate();


  return (
      <div className="container">
        <div className="welcome-message">
        Ihr Fest-Mobiliar
        <h2>Checken Sie ihre Reservierungen</h2>
      </div>
      <NavigationButton className='navi-button' onClick={()=>navigate("reservations")} text={"Kalender"}/>
      <NavigationButton className='navi-button' onClick={()=>navigate("orders")} text={"Bestellungen"}/>
      </div>

  );
};

export default Home;
