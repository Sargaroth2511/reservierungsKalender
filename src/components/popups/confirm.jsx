const ConfirmPopup = props => {
    return ( 
        <div className="confirm standard-box">
            <div>{props.text}
            </div>
        <div>
            <button onClick={props.confirm}>{props.buttonText}</button>
            <button onClick={props.close}>Nein, zurück</button>
        </div>
    </div>   
     );
}
 
export default ConfirmPopup;