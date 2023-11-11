import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { SIGN_IN_SUCCESS } from "../redux/user/userSlice";
import {useNavigate} from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
const from = location.state?.from?.pathname || "/";

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
const data = await res.json();
dispatch(SIGN_IN_SUCCESS(data))
navigate('/' , {replace: true});
    } catch (error) {
      console.log("could not sign in with Google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue With Google
    </button>
  );
};

export default OAuth;
