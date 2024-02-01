import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Warning from "./warning";
import CreateTrailerFields from "./createTrailerFields";
import CreateFridgeFields from "./createFridgeFields";
import CreateEquipFields from "./createEquipFields";
import isObjectEmpty from "../functions/isObjectEmpty";
import verifyAvailability from "./components/verifyAvailability";
import FormVerification from "./formVerification";
import getDates from "./components/getDates";















const ReservationForm = (props) => {
    const setShowReservationForm = props.setShowReservationForm
    const currentID = props.currentID
    // const reservedList = props.reservedList;
    // const [reservedList, setReservedList] = useState(props.reservedList.current)
    const reservationDocs = props.reservationDocs; 
    const date = props.date.current
    const [formInput, setFormInput] = props.useFormInput;

    const [warning, setWarning] = props.useWarning;
    const [originalData, setOriginalData] = useState({})
    const currentDateString = date.format('L')
    const [inquiredDocs, setInquiredDocs] = useState({})
    const [fieldsCreated, setFieldsCreated] = useState(false)

    //    useEffect(()=> {
    //         setReservedList(props.reservedList.current)
    //     },[props.reservedList.current])

    // try formintpu as ref from ordererd window

 
    const initialField = {
        trailer: 0,
        fridgeTrailer: 0,
        lentEquipment: 0
    }
    
    const initialIds = {
        trailer: [],
        fridgeTrailer: [],
        lentEquipment: []
    }
    
    
    const today = moment().clone().format('YYYY-MM-DD')
    const fieldCount = useRef(initialField)
    const fieldIds = useRef(initialIds)
    const [conflict, setConflict] = useState('')
    const [saving, setSaving] = useState(null)
    const nonAvailableItems = useRef({})
    const formData = useRef({})

    useEffect(() => {
        const resetForm = () => {
            setShowReservationForm(null);
            setSaving(null)
            formData.current = ({})
            nonAvailableItems.current = ({})
        }
        saving === 'completed' && resetForm()
    },[saving])

    const addFormField = (fieldName, value) =>{
        console.log(value)
        fieldCount.current[fieldName]++;
        let newField = fieldName+fieldCount.current[fieldName];
        fieldIds.current[fieldName].push(newField)
        if(fieldName !== 'lentEquipment') return setFormInput({...formInput, [newField]: value})
        else if (fieldName === 'lentEquipment')
            return setFormInput({...formInput, [fieldName]: {...formInput[fieldName], [newField]:value}   })
    }


    useEffect(()=>{
        if(formInput.customer) {
            setOriginalData(formInput)
            let entries = Object.entries(formInput)
            entries.map(([key, value]) => {
                if(key.includes('trailer')) addFormField('trailer', value)   
                else if(key.includes('fridge')) addFormField('fridgeTrailer', value)    
                else if (key === 'lentEquipment') {
                    let equipment = Object.values(value)
                    equipment.map(item=>{
                        addFormField('lentEquipment', item)
                    })
                }     
                else return;
            })
            setFieldsCreated(true)
        } else setFieldsCreated(true)
        
    },[])

    useEffect(() => {
        const getInquiredDBDocs = () => {
            const dates = getDates(formInput)
            const docs = {};
            for (let date of dates){
                const dateString = moment(date).format('L');
                if (reservationDocs[dateString]){
                    docs[dateString] = reservationDocs[dateString]
                }   
            }
            setInquiredDocs({...docs})
        };
        getInquiredDBDocs()
    }, [formInput])

  
        
        const handleAddFormInput = (e, name) => {
        e.preventDefault();
        fieldCount.current[name]++;
        let newField = name+fieldCount.current[name];
        fieldIds.current[name].push(newField)
        name !== 'lentEquipment' ?
            setFormInput({...formInput, [newField]: ""}):
            setFormInput({...formInput, [name]: {...formInput[name], [newField]:{}}   })
        }
  

        const handleInputChange = (e) => {
            e.preventDefault();
            let input = e.target.value;
       
            switch (e.target.name) {
                case 'customer':
                    setFormInput({ ...formInput, customer: input })
                    break;
                case 'rent-start':
                    date.current = (moment(input).clone())
                    setFormInput({ ...formInput, startDate: moment(input).startOf('day').toDate()})
                    break;
                case 'rent-end':
                    console.log(formInput.startDate)
                    new Date(input)>=formInput.startDate?
                        setFormInput({ ...formInput, endDate: moment(input).startOf('day').toDate()}):
                        setWarning('Der End-Tag darf nicht vor Start- Tag liegen!')
                    break;
                default:
                    break;
            }
            
            }

            const arrayIncludesSubstring = (arr, substring) => {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].includes(substring)) return true;
                }
                return false
            }

            const handleFormSubmit = async e => {
                e.preventDefault();
               
                if (!arrayIncludesSubstring(Object.keys(formInput), 'railer') && 
                    isObjectEmpty(formInput.lentEquipment)) 
                        return setWarning('Das Formular enthält keine Eingaben')

                if(formInput.rentStart>formInput.rentEnd)
                    return setWarning('Der End-Tag darf nicht vor Start- Tag liegen!')    
                nonAvailableItems.current = {};
                let {ordered, initial, newItems} = await verifyAvailability(props.db, formInput, nonAvailableItems, originalData, inquiredDocs)
                console.log(ordered, initial)
                // let originalItems = await verifyAvailability(props.db, originalData, nonAvailableItems, originalData);
                // console.log(originalItems)
                formData.current = {
                    orderedItems: ordered,
                    formInput: formInput,
                    originalItems: initial,
                    newItems: newItems,
                    orderID: currentID
                };
                isObjectEmpty(nonAvailableItems.current) ? setConflict('no') : setConflict('conflict');
            }        

            const formatDate = input => {
                return input.seconds? moment(input.toDate()).clone().format('YYYY-MM-DD'):
                                      moment(input).clone().format('YYYY-MM-DD')
            } 

         

    return (
        <div className="form-container">
 <div className="reservation-form standard-box">
            <h3>Mobiliar Reservieren</h3>
            <div>
                <form onSubmit={e => handleFormSubmit(e)} id='lendEquipmentForm'>
                    <div>
                    <label htmlFor="customer">Kunde</label>
                    <input type="text" value={formInput.customer}
                        id="customer"
                        name="customer"
                        onChange={(e) => handleInputChange(e)}
                        onFocus={(e) => { e.target.value = ''; }}
                        required={true}
                    />
                    </div>
                    <div>
                        <label htmlFor="start">Vom:</label>
                        <input type="date" id="start" name="rent-start"
                            value={formatDate(formInput.startDate)} min={today} 
                            onChange={(e)=>handleInputChange(e)}
                            />
                    </div>
                    <div>
                        <label htmlFor="end">Bis:</label>
                        <input type="date" id="end" name="rent-end"
                            value={formatDate(formInput.endDate)} min={today} 
                            onChange={(e)=>handleInputChange(e)}
                            />
                    </div>
                    {fieldsCreated && <CreateTrailerFields
                        key={'trailerfields'}
                        setWarning={setWarning}
                        fieldIds={fieldIds}
                        formInput={formInput}
                        setFormInput={setFormInput} 
                        field={fieldCount.current.trailer} 
                        useInquiredDocs={[inquiredDocs, setInquiredDocs]} 
                        name='trailer'
                        localName={"ASW"} 
                        dbFieldName='lentTrailer'
                        className='light-blue'
                        />
                    } 

                    <div className='light-blue'>
                        <label htmlFor="addTrailer"> ASW hinzufügen</label>
                        <button id="addTrailer" onClick={(e)=>handleAddFormInput(e, 'trailer')}>+</button>
                    </div>
                      {fieldsCreated &&<CreateFridgeFields key={'fridgefields'}dbFieldName='lentFridgeTrailer'setWarning={setWarning}fieldIds={fieldIds}formInput={formInput}
                        setFormInput={setFormInput} field={fieldCount.current.fridgeTrailer} 
                        useInquiredDocs={[inquiredDocs, setInquiredDocs]}  
                        name={"fridgeTrailer"} 
                    localName={'Kühlwagen'} className= 'light-grey' />}
                    <div className= 'light-grey'>
                        <label htmlFor="addFridgeTrailer"> Kühlwagen hinzufügen</label>
                        <button id="addFridgeTrailer" onClick={(e)=>handleAddFormInput(e, 'fridgeTrailer')}>+</button>
                    </div>
                    {fieldsCreated &&<CreateEquipFields dbFieldName='lentEquipment' key={'equipfields'}setWarning={setWarning}fieldIds={fieldIds}formInput={formInput}
                        setFormInput={setFormInput} field={fieldCount.current.lentEquipment} 
                        useInquiredDocs={[inquiredDocs, setInquiredDocs]}  
 
                    name={"lentEquipment"} localName={"Mobiliar"} className='light-blue' />}
                    <div className='light-blue'>
                        <label htmlFor="addEquipment"> Mobiliar hinzufügen</label>
                        <button id="addEquipment" onClick={(e)=>handleAddFormInput(e, 'lentEquipment')}>+</button>
                    </div>
                    <div className="break"></div>
                    <input type="submit" value='Überprüfen'/>
                </form>
            </div>
            <button onClick={() => props.setShowReservationForm(false)}>X</button>
            {/* reset form -> orderWindow */}
            { warning &&<Warning text={warning}
                             setWarning={setWarning}
            />}
                   { 
                conflict  && <FormVerification 
                            conflict={{conflict, setConflict}}
                            saving={{saving, setSaving}}
                            nonAvailableItems={nonAvailableItems}
                            db={props.db}
                            formData={formData}
                            useWarning={props.useWarning}
                             />
            }
        </div>
        </div>
       
    );
}

export default ReservationForm;