import { collection, query, where, getDocs } from "firebase/firestore";
import moment from "moment";

const getExpiredDoc = async(dbRef, useReservationDocs, dateState) => {
    const date = moment(dateState).clone().startOf('day').toDate()
    // console.log(moment(date).clone().startOf('day').toDate())
    const [reservationDocs, setReservationDocs] = useReservationDocs;
    // const now = moment().clone().startOf('day').toDate()
    const reservationRef = collection(dbRef, 'reservations')
    const q = query(reservationRef, where('date', '==', date))
    const querySnapshot = await getDocs(q); 
        querySnapshot.forEach(doc => {
            setReservationDocs(reservationDocs => {
                return {...reservationDocs, [doc.id] : doc.data()}
            })
        });
};    
 
export default getExpiredDoc;