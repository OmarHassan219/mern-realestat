import { Navigate, Outlet, useLocation } from "react-router-dom"
import { SelectCurrentUser } from "../redux/user/userSlice"
import { useSelector } from "react-redux"


const PrivateRoute = () => {
    const currentUser = useSelector(SelectCurrentUser)
const location = useLocation()
  return  currentUser ? <Outlet/> : <Navigate state={{ from: location }} replace to="/sign-in" />
  
}

export default PrivateRoute