import setSnapshotListener from "../components/dbCommunication/setShnapshotListener";
import setInitialDBDoc from "../components/dbCommunication/setInitialDBDoc";
import { useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";

const useSnapshotListener = (initialDocRef, currentDocRef, nextSetData, dependency) => {
    useEffect(async () => {
        const docSnap = await getDoc(doc(...currentDocRef));
        if (docSnap.data()){
            setSnapshotListener(currentDocRef, nextSetData)
        } else {
            await setInitialDBDoc(initialDocRef, currentDocRef)
            setSnapshotListener(currentDocRef, nextSetData)
        }
        
    }, [dependency]);
    return;
}
 
export default useSnapshotListener;