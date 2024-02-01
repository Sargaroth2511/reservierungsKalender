import "./orderStyles.scss"
import getOrderByDate, { getOrderByCustomer }  from "../dbCommunication/getOrders";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import React from "react";
import ReservationForm from "./../reservationList/reservationForm"; 
import Warning from "../reservationList/warning";
import setInitialDBDoc from "../dbCommunication/setInitialDBDoc";
import setSnapshotListener from "../dbCommunication/setShnapshotListener";


const OrderWindow = props => {
    const initial = {
        startDate: moment().clone().startOf('day').format('YYYY-MM-DD'),
        endDate:  moment().clone().startOf('day').add(7, 'd').format('YYYY-MM-DD'),
        customer: ''}
    const matchingOrders = useRef([])
    const docCounter = useRef(0)
    const [currentDoc, setCurrentDoc] = useState('')
    const [reservationDocs, setReservationDocs] = useState({})
    const [searchForm, setSearchForm] = useState(initial)
    const [showReservationForm, setShowReservationForm] = useState(null)
    const [warning, setWarning] = useState('')
    const date = useRef(moment().clone().startOf('day'))
    // const [date, setDate] = useState(moment().clone().startOf('day'))
    const reservedList = useRef(null)
    const docRef = [props.db, "reservations", date.current.format("L")];
    const initialDocRef = [props.db, "equipment", 'lentEquipment']

    // useSnapshotListener(initialDocRef, docRef, reservedList, date.current)
    useEffect(()=> {
        setSnapshotListener(props.db, [reservationDocs, setReservationDocs]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])




    // const updateOrders = async (start, end, param='date') => {
    //     const receivedOrders = await getOrderByDate(props.db, start, end)
    //     matchingOrders.current = receivedOrders
    //     if (matchingOrders.current.length !== 0) return setCurrentDoc(matchingOrders.current[0].data());
    //     else {
    //         setCurrentDoc('');
    //         setWarning('Es wurden keine Bestellungen gefunden');
    //     }                                      
    // }

    const updateOrders = receivedOrders => {
        matchingOrders.current = receivedOrders;
        if (matchingOrders.current.length !== 0) return setCurrentDoc(matchingOrders.current[0].data());
        else {
            setCurrentDoc('');
            setWarning('Es wurden keine Bestellungen gefunden');
        }   
    }


    useEffect(async() => {
        await getOrderByDate(props.db, searchForm.startDate, searchForm.endDate)
        .then(orders => updateOrders(orders))
    }, [])
    
    const onClickCounter = type => {
        if (type === 'prev' && docCounter.current > 0){
            docCounter.current--
            setCurrentDoc(matchingOrders.current[docCounter.current].data())
            console.log(matchingOrders.current[docCounter.current].id)
        } 
        else if (type === 'next' && docCounter.current+1 < matchingOrders.current.length){
            docCounter.current++
            setCurrentDoc(matchingOrders.current[docCounter.current].data())
            console.log(matchingOrders.current[docCounter.current].id)


        } 

    }

    const formatToLocalDate = timeStamp => {
        return new Date(timeStamp.seconds*1000).toLocaleDateString()
    }

    const getOrderedTrailer = () => {
        let orderedtrailer = [];
        Object.entries(currentDoc).map(([key, val]) => {
            key.includes('railer') && orderedtrailer.push(val)
        })
        return orderedtrailer
    }


    const handleInputChange = (e) => {
        let input = e.target.value;
        console.log(e.target.name)

        switch (e.target.name) {
            case 'begin':
                setSearchForm({...searchForm, startDate: moment(input).startOf('day').toDate()})
                break;
            case 'end':
                setSearchForm({...searchForm, endDate: moment(input).startOf('day').toDate()})
                break;
            case 'searchcustomer':
                console.log('test')
                setSearchForm({...searchForm, customer:input})
                
            break;
        
            default:
                break;
        }

    }

    const handleSearchFormSubmit = async e => {
        e.preventDefault();
        let start = moment(searchForm.startDate);
        let end = moment(searchForm.endDate);
        if (e.target.id === 'searchDate') {
            await getOrderByDate(props.db, start, end).then(orders =>{
                updateOrders(orders)
            })
        } else if (e.target.id === 'searchCustomer'){
            await getOrderByCustomer(props.db, searchForm.customer).then(orders =>{
                updateOrders(orders)
            })
        }
        
    }
        // const changeOrder = () => {
        //     let currentDoc = matchingOrders.current[docCounter.current].data();
        //     date.current = moment(currentDoc.startDate.toDate())
        //     console.log(currentDoc)
        //     console.log(reservationDocs)
        //     // console.log(matchingOrders.current[docCounter.current].data())
        //     setShowReservationForm(true)
        // }

        useEffect(()=> {
            if(showReservationForm){
                let currentDoc = matchingOrders.current[docCounter.current].data();
                setCurrentDoc(currentDoc)
                date.current = moment(currentDoc.startDate.toDate())
            }
            
        },[showReservationForm])
  



    return ( 
        <div className="order-window standard-box">
                    {showReservationForm ? 
            <ReservationForm
                useFormInput = {[currentDoc, setCurrentDoc]}
                setShowReservationForm = {setShowReservationForm}
                useWarning = {[warning, setWarning]}
                db={props.db}
                date = {date}
                reservationDocs={reservationDocs}
                currentID = {matchingOrders.current[docCounter.current].id}
            /> :
             null}  
            <div>
                <form onSubmit={e => handleSearchFormSubmit(e)} id='searchDate' className="search-form">
                <div>
                    <label htmlFor="begin">Von</label>
                    <input type="date" id="begin" name="begin"
                           value={moment(searchForm.startDate).format('YYYY-MM-DD')} 
                           onChange={(e)=>handleInputChange(e)}
                    />
                    <label htmlFor="end">bis</label>
                    <input type="date" id="end" name="end"
                           value={moment(searchForm.endDate).format('YYYY-MM-DD')} 
                           onChange={(e)=>handleInputChange(e)}
                    />
                <input type="submit" value='Suchen'/>

                </div>
                </form>
                <form onSubmit={e => handleSearchFormSubmit(e)} id='searchCustomer' className="search-form">
                <label htmlFor="searchcustomer">Nach Kunde suchen</label>
                    <input type="text" value={searchForm.customer}
                        id="searchcustomer"
                        name="searchcustomer"
                        onChange={(e) => handleInputChange(e)}
                        onFocus={(e) => { e.target.value = ''; }}
                    />
                    <input type="submit" value='Suchen'/>
                </form>
            </div>
               
            <div className="button-holder">
                <button onClick={() => onClickCounter('prev')}>-</button>
                <button onClick={() => onClickCounter('next')}>+</button>
            </div>
            <div className="order-holder">
                <div className="tag">Kunde:</div> 
                <div className="value">{currentDoc && currentDoc.customer}</div>
                <div className="tag">Liefertag:</div>
                <div className="value">{currentDoc.startDate && formatToLocalDate(currentDoc.startDate)}</div>
                <div className="tag">Abholtag:</div>
                <div className="value">{currentDoc.endDate && formatToLocalDate(currentDoc.endDate)}</div>
                {
                    currentDoc && getOrderedTrailer().map(trailer =>
                        <React.Fragment key={trailer+'field'}>
                        <div key={trailer} className='tag'>{trailer}</div>
                        <div key={trailer+'1'} className='value'>1</div>
                        </React.Fragment>
                    )
                }
                {
                    currentDoc.lentEquipment && Object.values(currentDoc.lentEquipment).map(e => {
                        return (
                        Object.entries(e).map(([type, number]) => {
                            return (
                            <React.Fragment key={type+'field'}>
                                <div key={type} className='tag' >{type}</div>
                                <div key={type+toString(number)} className='value'>{number}</div>
                            </React.Fragment>
                            )
                        }))
                    })
                }
            <button onClick={()=>setShowReservationForm(true)}>Bestellung ändern</button>
            <button>Bestellung löschen</button>
            </div>
            { warning &&<Warning text={warning}
                             setWarning={setWarning}
            />} 
           

        </div>
     );
}
 
export default OrderWindow;
