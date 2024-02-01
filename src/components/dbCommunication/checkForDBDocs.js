import { getDoc, doc } from "firebase/firestore";

const checkForDBDoc = async docRef => {
    const docSnap = await getDoc(doc(...docRef))
    return docSnap.exists()
}

export default checkForDBDoc;