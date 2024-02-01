import moment from "moment";
import ReservationForm from "./reservationForm"; 
import  Warning  from "./warning";
import setInitialDBDoc from "../dbCommunication/setInitialDBDoc";
import { useState, useEffect, useRef } from "react";
import "./reservationStyles.scss";
import setSnapshotListener from "../dbCommunication/setShnapshotListener";
import getExpiredDoc from "../dbCommunication/getExpiredDocs";
import checkForDBDoc from "../dbCommunication/checkForDBDocs";


const ReservedItems = (props) => {
    const dateState = props.useDate[0];

    const [reservationDocs, setReservationDocs] = useState({})
    const [showReservedList, setShowReservedList] = useState(null);
    const [formInput, setFormInput] = useState({})
    const [showReservationForm, setShowReservationForm] = useState(null)
    const [warning, setWarning] = useState(false);

    const reservedList = useRef(null)
    const date = useRef(dateState)

    useEffect(()=> {
        setSnapshotListener(props.db, [reservationDocs, setReservationDocs]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=> {
        const currentDoc = dateState.format('L')
        setShowReservedList(reservationDocs[currentDoc])
    },[dateState, reservationDocs])

    useEffect(() => {
        date.current = dateState;
        const currentDoc = dateState.format('L')
        if(moment(dateState).isBefore([], 'day')){
            getExpiredDoc(props.db, [reservationDocs, setReservationDocs], dateState)
            .then(()=> {
                setShowReservedList(reservationDocs[currentDoc])
            })
        }    
    },[dateState])

    useEffect(()=> {
        const initialForm = {
            customer: '',
            startDate: date.current.clone().startOf('day').toDate(),
            endDate: date.current.clone().startOf('day').add(1, 'day').toDate(),
        }
        setFormInput(initialForm)
    },[showReservationForm]) 

    const handleReservationClick = async () => {
        const docRef = [props.db, "reservations", dateState.format('L')];
        const initialDocRef = [props.db, "equipment", 'lentEquipment']
        await checkForDBDoc(docRef) ? setShowReservationForm(true) :
            await setInitialDBDoc(initialDocRef, docRef).then(data => {
                reservedList.current = data;
                setShowReservationForm(true)
            }).catch(() => setWarning(`Es konnte keine Verbindung zu Datenbank 
                                hergestellt werden. Versuch Sie es bitte Später erneut.`))
    }

    return (
        <div className="reservation-popup standard-box">
            {showReservationForm ? 
                <ReservationForm 
                    setShowReservationForm = {setShowReservationForm}
                    reservationDocs = {reservationDocs}
                    useFormInput = {[formInput, setFormInput]}
                    date = {date}
                    useWarning = {[warning, setWarning]}
                    db={props.db}
                />
                : null
            }     
            <h3>Reserviertes Mobiliar <span>{dateState.format("L")}</span></h3>
            <div className="reserved-items">
                <div>
                    <h4>Schankwagen</h4>
                    {showReservedList && typeof showReservedList === "object" ?
                        Object.entries(showReservedList.lentTrailer).map(([key, value]) => (
                            value !== 0 && <div key={key}>{key}</div>
                        )) 
                        : null
                    }
                </div>
                <div>
                    <h4>Anderes Mobiliar</h4>
                    {showReservedList && typeof showReservedList === "object" ?
                        Object.entries(showReservedList.lentEquipment).map(([key, value]) => (
                            value !== 0 && <div key={key}>{key}: {value}</div>
                        )) 
                        : null
                    }
                </div>
                <div className="fridgeTrailer">
                    <h4>Kühlwagen</h4>
                    {showReservedList && typeof showReservedList === "object" ?
                        Object.entries(showReservedList.lentFridgeTrailer).map(([key, value]) => (
                            value !== 0 && <div key={key}>{key}</div>
                        )) 
                        : null
                    }
                </div>
            </div>
            <button 
                onClick={()=>handleReservationClick()} 
                disabled={moment(dateState).isBefore([], 'day')}
                className="reservation-button">Reservieren?
            </button>
            {warning && 
                <Warning 
                    text={warning}
                    setWarning={setWarning}
                />
            }           
        </div>
    );
};

export default ReservedItems;