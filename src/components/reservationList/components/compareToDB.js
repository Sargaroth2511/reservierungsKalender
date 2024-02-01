import isObjectEmpty from "../../functions/isObjectEmpty";

const compareToDB = (formInput, dbDocs) => {
    let orderedItems = {};
    let nonAvailableItems = {};

    const setOrderedItems = (type, category, number=1) => {
        if(category === 'equipment'){
            orderedItems = {
                ...orderedItems,
                lentEquipment: {
                    ...orderedItems.lentEquipment,
                    [type]:number}
            }
        } else if (category.includes('railer')){
            orderedItems = {...orderedItems, [type]: category}
        } else throw new Error('Cant set Ordered Items, category not found')
       
    }

    const setNonAvailableItems = (value, date, number = 1) => {
        nonAvailableItems = {
            ...nonAvailableItems,
            [date] : {
                ...nonAvailableItems[date],
            [value] : number
            }
        };
        console.log(nonAvailableItems)

    };
    
    const checkIfStockIsHighEnough = (type, number, dbNumber, date) => {
        return number <= dbNumber ? true : setNonAvailableItems(type, date, number-dbNumber)
    };

    const extractEquipment = object => {
        Object.entries(object).map(([type, number])=>{
            try {
                setOrderedItems(type, 'equipment', number)
            }
            catch(err) {
                console.log(err)
            }
            Object.entries(dbDocs).map(([id, doc]) => {
                console.log(id)
                const dbEquipment = doc.otherEquipment
                Object.entries(dbEquipment).map(([key, dbNumber]) => {
                    if (type === key){
                        console.log(type)
                        return checkIfStockIsHighEnough(type, number, dbNumber, id)
                    } else return ''
                });
            });
        })
    }

    if(!isObjectEmpty(formInput.lentEquipment)){
        console.log(formInput, dbDocs)
        const equipment = typeof Object.values(formInput.lentEquipment)[0] === 'object' ?
                                 Object.values(formInput.lentEquipment)
                                 : formInput.lentEquipment 
        Array.isArray(equipment) ? equipment.forEach(e => extractEquipment(e))
                                 : extractEquipment(formInput.lentEquipment)                       
            // Object.entries(e).map(([type, number])=>{
            //     try {
            //         setOrderedItems(type, 'equipment', number)
            //     }
            //     catch(err) {
            //         console.log(err)
            //     }
            //     Object.entries(dbDocs).map(([id, doc]) => {
            //         console.log(id)
            //         const dbEquipment = doc.otherEquipment
            //         Object.entries(dbEquipment).map(([key, dbNumber]) => {
            //             if (type === key){
            //                 console.log(type)
            //                 return checkIfStockIsHighEnough(type, number, dbNumber, id)
            //             } else return ''
            //         });
            //     });
            // })
        // );
    };
    Object.entries(formInput).map(([category, type]) => {
        let isTrailer = category.includes('railer')
        if (isTrailer) {
             try {
                    setOrderedItems(type, category)
                }
                catch(err) {
                    console.log(err)
                }
            return Object.entries(dbDocs).map(([id, doc]) => {
                let dbCategory;
                if (category.includes('trailer')){
                    dbCategory = doc.lentTrailer
                } else if (category.includes('fridge')){
                    dbCategory = doc.lentFridgeTrailer
                }
                Object.entries(dbCategory).map(([dbName, counter])=>{
                    if (type === dbName && counter){
                        
                        return setNonAvailableItems(type, id)
                    } 
                    else return ''
                });
            });
        };
        
    });
    console.log(orderedItems)
    return {orderedItems: orderedItems, nonAvailableItems: nonAvailableItems};
};
 
export default compareToDB;