import { doc, getDocs, collection, query, where } from "firebase/firestore";
import moment from "moment";

export const getOrderByCustomer = async(dbRef, searchTerm) => {
    const matchingOrders = [];
    let strlength = searchTerm.length;
    let strFrontCode = searchTerm.slice(0, strlength-1);
    let strEndCode = searchTerm.slice(strlength-1, searchTerm.length);
    let endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);


    const q = query(collection(dbRef, 'orders'), where('customer', '>=', searchTerm), 
                                                 where('customer', '<=', searchTerm+'\uf8ff'));
    const querySnapshot = await getDocs(q);
    for (let doc of querySnapshot.docs){
        matchingOrders.push(doc);
    }
    matchingOrders.sort((a, b) => a.data().customer - b.data().customer)
    return matchingOrders;
}

const getOrderByDate = async(dbRef, startDay, endDay) => {
    const matchingOrders = [];
    let inquiredDates = [];

    let dif = moment(endDay).diff(moment(startDay), 'd')

    for (let i = 0; i < dif; i++) {
        let breakpoints = [9,19,29,39,49]
        inquiredDates.push(moment(startDay).add(i, 'd').toDate())
        if(breakpoints.includes(i) || i===dif-1){
            const q = query(collection(dbRef, 'orders'), where('duration', 'array-contains-any' ,[...inquiredDates]))
            const querySnapshot = await getDocs(q);
            for (let doc of querySnapshot.docs){
                matchingOrders.push(doc);
            }
            inquiredDates = [];
        } 
    }
    matchingOrders.sort((a, b) => a.data().startDate - b.data().startDate)
    return matchingOrders;
}    
 
export default getOrderByDate;