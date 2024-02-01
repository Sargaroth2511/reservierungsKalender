import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/calendar/calendar";
import moment from "moment";
import "moment/locale/de";

import NavigationButton from "../components/navigationButton";
import ReservedItems from "../components/reservationList/reservedItems";
import ChangeRoute from "../components/functions/ChangeRoute";



const Reservations = (props) => {
  const [value, setValue] = useState(moment().locale("de"));
  const navigate = useNavigate();

  // let navigate = useNavigate();
  // const changeRoute = (e, path) => {
  //   console.log(e.target, path);
  //   navigate(path);
  // };

  return (
    <div className="container">
      <NavigationButton className='home-button' onClick={() => navigate("/")} text={"Home"} />
      <Calendar value={value} onChange={setValue} />
      <ReservedItems db={props.db} useDate={[value, setValue]} />
    </div>
  );
};

export default Reservations;
