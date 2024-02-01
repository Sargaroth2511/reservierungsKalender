import { useState, useEffect, useRef } from "react";
import focusNextFormField from "../functions/focusNextFormField";
import getDates from "./components/getDates";
import moment from "moment";
import isObjectEmpty from "../functions/isObjectEmpty"



const CreateEquipFields = (props) => {
   

        let formInput = props.formInput;
        let setFormInput = props.setFormInput;
        let fieldIds = props.fieldIds
        let setWarning = props.setWarning;
        // const reservationDocs = props.reservationDocs;

        const [inquiredDocs, setInquiredDocs] = props.useInquiredDocs
        const [mergedDoc, setMergedDoc] = useState(null)
        // let reservationDocs = props.reservationDocs.current
        let className = props.className;

        // useEffect(()=> {
        //     setreservationDocs(props.reservationDocs.current)
        // },[props.reservationDocs.current])

        
        
        const [warningColor, setWarningColor] = useState(false);

    
    
        const handleRemoveField = (e, field, id) => {
            e.preventDefault()
            
            let newFields = fieldIds.current[field].filter(val=> val !== id);
            fieldIds.current[field] = newFields;
            
            setFormInput(prevData => {
                const newData ={...prevData}
                field !== 'lentEquipment' ? delete newData[id] : delete newData[field][id];
                return newData;
            }) 
        }
    
        const getInputValue = (id, type, name) => {
            if(type === 'trailer' || type === 'fridgeTrailer')  return formInput[id];
            else if (type === 'lentEquipment'){
                let newValue = formInput[name][id]
                if (!newValue || !Object.keys(newValue)[0]) return '';
                    else {
                        return Object.keys(newValue)[0];
                    }    
            } else if (type === 'equipmentNumber'){
                let newValue = formInput[name][id]
                if (!newValue || !Object.values(newValue)[0]) return '';
                else return Object.values(newValue)[0];
            }
        };     

    
        const handleInputChange = (e, id) => {
            e.preventDefault();
            let input = e.target.value;
            
            const isAssigned = (obj, input) => 
            obj !== formInput.lentEquipment?
                Object.values(obj).includes(input, 1) :
                Object.keys(Object.assign({}, ...Object.values(obj))).includes(input);
            
            switch (e.target.name) {
                case `trailer`:
                    !isAssigned(formInput, input) ?
                        setFormInput({ ...formInput, [id]: input }):
                        setWarning(`Die Position ${input} ist schon aufgeführt`);
                    break;
                case `fridgeTrailer`:
                    !isAssigned(formInput, input) ?
                        setFormInput({ ...formInput, [id]: input }):
                        setWarning(`Die Position ${input} ist schon aufgeführt`);
                    break;
                case `lentEquipment`:
                    focusNextFormField(e);
                    return ! isAssigned(formInput.lentEquipment, input) ?
                        setFormInput(formInput =>{
                            let newEquipment = {[id]:{[input]:0}}
                            return {...formInput, ['lentEquipment']: {...formInput.lentEquipment, ...newEquipment  }}
                        }):
                        setWarning(`Die Position ${input} ist schon aufgeführt`)
                case 'equipmentNumber':
                    let key = Object.keys(formInput.lentEquipment[id])[0];
                    let inputToNum = parseInt(input, 10);
                    if (Number.isNaN(inputToNum)){
                        inputToNum = ''
                    }
                    inputToNum > mergedDoc.otherEquipment[key] ? setWarningColor(true):setWarningColor(false)
                    if(inputToNum<10000 || !inputToNum)
                    return setFormInput({...formInput, ['lentEquipment']: {...formInput.lentEquipment, [id]:{[key]: inputToNum}}})        
                default:
                    return input;
            }
            
            }



       
        // change inquired docs if docs change
        // useEffect(() => {
        //     const getInquiredDBDocs = () => {
        //         const dates = getDates(formInput)
        //         const docs = {};
        //         for (let date of dates){
        //             const dateString = moment(date).format('L');
        //             if (reservationDocs[dateString]){
        //                 docs[dateString] = reservationDocs[dateString]
        //             }   
        //         }
        //         setInquiredDocs({...docs})
        //     };
        //     getInquiredDBDocs()
        // }, [formInput])

        // create temp obj to avoid asynch state

        useEffect(()=> {
    

            const mergeInquiredDocs = () => {
                setMergedDoc({})
                const entries = Object.entries(inquiredDocs);
                let tempObj = entries[0][1];
                entries.map(([docID, doc]) => {
                    const docEntries = Object.entries(doc);
                    docEntries.map(([category, equipment])=> {
                        const equipmentEntries = Object.entries(equipment)
                        equipmentEntries.map(([type, number]) => {
                            if (category.includes('railer') && number){
                                let updated = {[type] : number}
                                tempObj = {...tempObj, [category]: {...tempObj[category], ...updated}}
                            } else if (category==='otherEquipment'){
                                Object.entries(tempObj.otherEquipment).map(([key, value]) => {
                                    if (key === type && number < value){
                                        let updated = {[type] : number}
                                        tempObj = {...tempObj, [category]: {...tempObj[category], ...updated}}
                                    }
                                })
                            }        
                        })
                    })
                })
                setMergedDoc({...tempObj})
                // return mergedDoc;
            }
            if (isObjectEmpty(inquiredDocs)) return;
            mergeInquiredDocs()
        }, [inquiredDocs])

        useEffect(()=>{
            console.log('test')
            let newObject = {}

            const renameOriginalKeys = () => {
                let fields = fieldIds.current[props.name]
                for (let i = 0; i < fields.length; i++) {
                    console.log(fields[i], Object.values(formInput.lentEquipment)[i])
                        newObject[fields[i]] = Object.values(formInput.lentEquipment)[i]
                }
            }
            renameOriginalKeys()
            setFormInput({...formInput, ['lentEquipment']: {...formInput.lentEquipment, ...newObject}})
            console.log(newObject)
        },[])
          
        
     


        let inputFields = fieldIds.current[props.name]
    
        return inputFields.map((id) => 
            
             <div key={`div${id}`} className={className}>
                <label key={`divlabel${id}`} htmlFor={id}>{props.localName}</label>
                <div className="select-field" key={`divSel${id}`}>
                    <button key={`but${id}`} onClick={(e)=>handleRemoveField(e, props.name, id)}>
                    -</button>
                    <select name={props.name} 
                    required={true}
                            id={id} 
                            key={`sel${id}`} 
                            form="lendEquipmentForm"
                            value={getInputValue(id, props.name, props.name)} 
                            onChange={(e)=>handleInputChange(e, id)}>
                            <option value={''} disabled>{props.localName} wählen</option>
                            {mergedDoc && Object.entries(mergedDoc[props.dbFieldName])
                            .map(([key, value]) => (
                                <option className={value ? 'red-text':undefined} 
                                        key={key} value={key}
                            >{key}</option>
                            ))}
                    </select>
                </div>
                {props.name === "lentEquipment" && 
                <div className='equipmentNumber' key={`divNum${id}`}>
                    <input type="text" 
                            className={warningColor ?'red-text':undefined}
                            form="lendEquipmentForm"
                            value={getInputValue(id, 'equipmentNumber', props.name)}
                            id={`Num${id}`}
                            key={`equiinp${id}`}
                            name={"equipmentNumber"}
                            onChange={(e) => handleInputChange(e, id)}
                            required={true}
                    />
                    <label key={`equilab${id}`} htmlFor={`Num${id}`}>Anzahl</label>
                </div>}
            </div>  
     );
}
 
export default CreateEquipFields;