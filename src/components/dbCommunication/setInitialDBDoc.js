import { getDoc, setDoc, doc } from "firebase/firestore";
import moment from "moment";

const setInitialDBDoc = async (initialDocRef, currentDocRef) => {
    console.log(currentDocRef[2])
    let date = moment(currentDocRef[2], 'L').clone().startOf('day').toDate()
    console.log(date)
    const docSnap = await getDoc(doc(...initialDocRef))
        const data = docSnap.data();
        data.date = date;
        await setDoc(doc(...currentDocRef), data);
    return data;
}
 
export default setInitialDBDoc;