const Warning = (props) => {
    return ( 
    <div className="popup-warning">
        {props.text}
        <button onClick={()=>props.setWarning(false)}>X</button>
    </div> );
}
 
export default Warning;