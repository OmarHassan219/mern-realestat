import { Navigate, Outlet } from "react-router-dom"
import { SelectCurrentUser } from "../redux/user/userSlice"
import { useSelector } from "react-redux"


const PrivateRoute = () => {
    const currentUser = useSelector(SelectCurrentUser)

  return  currentUser ? <Outlet/> : <Navigate  to="/sign-in" />
  
}

export default PrivateRoute