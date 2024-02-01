import { useState, useEffect } from "react"
import postReservation, { createOrder } from "../dbCommunication/postReservation";
import getDates from "./components/getDates";
import ConfirmPopup from "../popups/confirm";
import isObjectEmpty from "../functions/isObjectEmpty";
import { original } from "immer";
import { suppressDeprecationWarnings } from "moment";


const FormVerification = (props) => {

    const [saveButtonText, setSaveButtonText] = useState('Speichern')
    const [isDisabled, setisDisabled] = useState(false)
    const [showConfirmPopup, setShowConfirmPopup] = useState('')
    const [warning, setWarning] = props.useWarning
    const formData = props.formData.current
    const {saving, setSaving} = props.saving
    const {conflict, setConflict} = props.conflict
    const dates = getDates(formData.formInput);
    
    useEffect(() => {
        switch (saving) {
            case null:
                setSaveButtonText('Speichern')
                setisDisabled(false)
                break;
            case 'pending':
                setSaveButtonText('wird gespeichert...')
                setisDisabled(true)
                break;
            case 'saved':
                setSaveButtonText('Gespeichert!')
                setisDisabled(true)
                break;
            default:
                // do nothing
                break;
        }
    }, [props.saving])


    const saveForm = async (controlled=false) => {
        const sendData = async () => {
            if (!isObjectEmpty(formData.originalItems)){
                console.log(formData.originalItems)
                await postReservation(props.db, formData.originalItems, dates, 'delete')
                await createOrder(props.db, formData.formInput, formData.orderID)
            } else {
                await postReservation(props.db, formData.orderedItems, dates, 'keep')
                await createOrder(props.db, formData.formInput)
            }
        }
        if(controlled === 'checked' || conflict === 'no'){
            setShowConfirmPopup('')
            setSaving('pending')
            await sendData().then(()=>{
                setSaving('saved')
                setTimeout(() => {
                    setConflict('')
                    setSaving('completed')
                }, 1500);
            }).catch(err => {
                setWarning(`Es konnte keine Verbindung zu Datenbank 
                                hergestellt werden. Versuch Sie es bitte Später erneut.`)
                console.log(err)
            })
        } else setShowConfirmPopup('save')
    };


    // create separate function to extract ordrered items
    const changeForm = async () => {
        if(!isObjectEmpty(formData.originalItems)){
            await postReservation(props.db, formData.newItems, dates, 'delete')
        } else {
            await postReservation(props.db, formData.orderedItems, dates, 'delete')
        }
        setConflict('')
    }

    const deleteForm = async () => {
        if (isObjectEmpty(props.originalData))
        await postReservation(props.db, formData.orderedItems, dates, 'delete')
        setConflict('')
        setShowConfirmPopup(false)
    }

    return ( 
    <div className="no-conflict standard-box">
        <div className="text-box">
         {
            conflict === 'no' && 'Es sind keine Konflikte aufgetreten. Wollen Sie die Bestellung jetzt speichern?'
         }
         {
            conflict === 'conflict' && 'Es sind folgende Konflikte aufgetreten:'
         }
        </div>
        {
           conflict === 'conflict' && <div>
               {
                   Object.entries(props.nonAvailableItems.current).map(([date, obj])=>(
                       Object.entries(obj).map(([type, state])=>(
                           <div key={date+type}>Am {date}: {type}{type.includes('ASW') || type.includes('KW') ?
                            ' bereits reserviert' : `: ${state} zu wenig`}</div>
                       ))
                   ))
               }
           </div>
        }
        <button disabled={isDisabled} onClick={() => changeForm()}>Ändern</button>
        <button disabled={isDisabled} onClick={() => setShowConfirmPopup('delete')}>Verwerfen</button>
        <button disabled={isDisabled} onClick={() => saveForm()}>{saveButtonText}</button>
        {
            showConfirmPopup === 'delete' && <ConfirmPopup 
                                            text={'Sind Sie sicher, dass Sie alle Eingaben löschen wollen?'}
                                            buttonText={'Ja, löschen'}
                                            confirm={()=>deleteForm()}
                                            close={()=>setShowConfirmPopup('')}
            />
        }
        {
            showConfirmPopup === 'save' && <ConfirmPopup 
                                            text={'Trotz der Konflikte speichern? Eventuell muss Ausrüstung zugeliehen werden...'}
                                            buttonText={'Ja, speichern'}
                                            confirm={()=>saveForm('checked')}
                                            close={()=>setShowConfirmPopup('')}
            />
        }
    </div> );
}
 
export default FormVerification;