const IsBeforeWarning = (props) => {
   
    return ( 
        <div className="popup-warning">Der Tag liegt in der Vergangenheit!
            <button onClick={()=>props.setShowPopup(false)}>X</button>
        </div>
     );
}
 
export default IsBeforeWarning;