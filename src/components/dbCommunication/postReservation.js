import { doc, setDoc, increment, collection, addDoc, getDoc } from "firebase/firestore";
import moment from "moment";
import getDates from "../reservationList/components/getDates";

const postReservation = async (dbRef, orderedItems, dates, type='add') => {
    console.log(orderedItems)
    let factor ;
    type === 'delete' ? factor = -1 : factor = 1;
    const allPromises = [];
    for (let i=0; i< dates.length; i++){
        const dateString = moment(dates[i]).clone().format('L')
        let ref = doc(dbRef, "reservations", dateString)
        if (type !== 'keep'){
            const promises = Object.entries(orderedItems).map(async([item, category]) => {
                if (item === 'lentEquipment'){
                    Object.entries(category).map(async([type, number]) => {
                        await setDoc(ref, {lentEquipment: {[type]: increment((factor*number))}}, {merge:true})
                        await setDoc(ref, {otherEquipment: {[type]: increment((factor*(-number)))}}, {merge:true})
                    })
                } else {
                    let dbCategory;
                    if (category.includes('trailer')){
                        dbCategory = 'lentTrailer'
                    } else if (category.includes('fridge')){
                        dbCategory = 'lentFridgeTrailer'
                    } else throw new Error('Category not found in Database')
                    await setDoc(ref, {[dbCategory]: {[item]: increment((factor*1)) }}, {merge:true})
                }
            })
            await Promise.all(promises)
            allPromises.push(promises)
        } else {
            await Promise.resolve();
            allPromises.push(Promise.resolve())
        }
    }
    return Promise.all(allPromises)
}

export const createOrder = async (dbRef, formInput, orderID=null) =>{
    const docRef = await (orderID ? setDoc(doc(dbRef, 'orders', orderID), {...formInput}):
                                    addDoc(collection(dbRef, "orders"), {...formInput}));
    const docID = docRef ? docRef.id : orderID; 
    await setDoc(doc(dbRef, 'orders', docID), {duration:getDates(formInput)}, {merge:true})
};
 
export default postReservation;