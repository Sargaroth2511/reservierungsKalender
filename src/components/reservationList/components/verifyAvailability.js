import getDates from "./getDates";
import moment from "moment";
import compareToDB from "./compareToDB";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import blockOrder from "../../dbCommunication/postReservation"; 
import isObjectEmpty from "../../functions/isObjectEmpty";
import postReservation from "../../dbCommunication/postReservation";
import setInitialDBDoc from "../../dbCommunication/setInitialDBDoc";

const verifyAvailability = async(dbRef, formInput, nonAvailableItems, initialData, inquiredDocs) => {
    const completeEquipment = await getDoc(doc(dbRef, 'equipment', 'lentEquipment'))
    console.log(completeEquipment.data())
    const initialDocRef = [dbRef, 'equipment', 'lentEquipment']
    const dates = getDates(formInput);
    let allDocRefs = [];



    for (let i = 0; i < dates.length; i++) {
        const dateString = moment(dates[i]).clone().format('L')

        console.log(dateString)
        const docRef = [dbRef, 'reservations', dateString]
        const docSnap  = await getDoc(doc(...docRef));
        if (!docSnap.exists()){
            await setInitialDBDoc(initialDocRef, docRef)
        }    
        allDocRefs.push(docRef)
    }
   
    if (!isObjectEmpty(initialData)){
        // const [initialOrdered, initNonAvailable] = compareToDB(initialData, inquiredDocs)
        const initialOrdered = compareToDB(initialData, inquiredDocs).orderedItems
        console.log(initialOrdered)
        const ordered = compareToDB(formInput, inquiredDocs).orderedItems
        const initialEntries = Object.entries(initialOrdered)
        const formEntries = Object.entries(ordered)
        let orderChanges = {}
        let expiredItems = {};
        console.log(initialEntries, formEntries)
        // {...formInput, ['lentEquipment']: {...formInput.lentEquipment, [id]:{[key]: inputToNum}}}
        // orderChanges.lentEquipment = {...ordered.lentEquipment}
        // console.log(ordered, orderChanges)
        initialEntries.map(([initKey, initVal]) => {
            formEntries.map(([formKey, formVal]) => {
                if(typeof(formVal) !== 'object' && typeof(initVal) !== 'object' ){
                    if(formKey !== initKey){
                        orderChanges[formVal] = formKey;
                        expiredItems[initVal] = initKey;
                    } 
                } else if(initKey === 'lentEquipment' && formKey === 'lentEquipment') {
                    let tempObj = {}
                    const initEquipEntries = Object.entries(initialOrdered.lentEquipment)
                    const formEquipEntries = Object.entries(ordered.lentEquipment)
                    // doesnt work for multiple equip entries
                    initEquipEntries.map(([initEquipKey, initEquipVal]) => {
                        formEquipEntries.map(([formEquipKey, formEquipVal]) => {
                            if(formEquipKey !== initEquipKey){

                                tempObj = {...tempObj, [formEquipKey] : formEquipVal}
                                console.log(formEquipKey, formEquipVal)
                            }
                            if(initEquipKey === formEquipKey){
                                if(initEquipVal !== formEquipVal){
                                    // prop is overwritten, spread
                                    // console.log(initEquipKey, initEquipVal, formEquipKey, formEquipVal)
                                    const dif = formEquipVal - initEquipVal
                                    console.log(formEquipKey, dif)

                                    tempObj = {...tempObj, [formEquipKey] : dif}
                                    console.log(formEquipKey, tempObj)
                                }
                            }
                        })
                    })
                    initEquipEntries.map(([initEquipKey, initEquipVal])=> {
                        Object.entries(tempObj).map(([tempKey, tempVal])=> {
                            if(initEquipKey === tempKey && initEquipVal === tempVal){
                                delete tempObj[tempKey]
                            }
                        })
                    })
                    orderChanges.lentEquipment =  {...tempObj}
                }
            })
            Object.entries(orderChanges).map(([changeKey, changeVal]) => {
                if(initKey === changeVal && typeof initVal !== 'object'){
                    console.log(initialEntries, Object.entries(orderChanges))
                    delete orderChanges[changeKey]
                }
            })
        })
        console.log(orderChanges)
        const {orderedItems: newItems, nonAvailableItems: nonAvailable} = compareToDB(orderChanges, inquiredDocs)
        // await postReservation(dbRef, initialOrdered, dates, 'delete');
        nonAvailableItems.current = nonAvailable;
        console.log(newItems)

        await blockOrder(dbRef, newItems, dates).catch(err=> console.log(err))
        return {ordered: ordered, initial: initialOrdered, newItems: newItems};
    } else {
        console.log('test')
        const {orderedItems: ordered, nonAvailableItems: nonAvailable} = compareToDB(formInput, inquiredDocs);
        console.log(ordered, nonAvailable)
        nonAvailableItems.current = nonAvailable;
        await blockOrder(dbRef, ordered, dates).catch(err=> console.log(err))
        return {ordered: ordered, initial: {}};
    }    

}
 
export default verifyAvailability;

// postReservation(props.db, orderedItems) dbRef, orderedItems, dates, type='add'