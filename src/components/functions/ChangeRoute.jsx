import { useNavigate } from "react-router-dom";


const ChangeRoute = (e, path) => {
    const navigate = useNavigate();
    
    console.log(e.target, path);
    return navigate(path);
};
 
export default ChangeRoute;