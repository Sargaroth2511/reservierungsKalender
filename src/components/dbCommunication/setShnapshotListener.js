import { onSnapshot, collection, query, where } from "firebase/firestore";
import moment from "moment";

const setSnapshotListener = (dbRef, useReservationDocs) => {
    const [reservationDocs, setReservationDocs] = useReservationDocs
    const now = moment().clone().startOf('day').toDate()
    const reservationRef = collection(dbRef, 'reservations')
    const q = query(reservationRef, where('date', '>=', now))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(doc => {
            setReservationDocs(reservationDocs => {
                return {...reservationDocs, [doc.id] : doc.data()}
            })
        });
    });
    return function cleanup(){
        unsubscribe();
    };
};    
 
export default setSnapshotListener;