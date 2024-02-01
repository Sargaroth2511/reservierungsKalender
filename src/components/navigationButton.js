

const NavigationButton = (props) => {
   
    return ( 
        <button className={`${props.className} standard-box`} onClick={props.onClick}>{props.text}</button>
     );
}
 
export default NavigationButton;