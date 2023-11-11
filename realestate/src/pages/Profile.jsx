import { useSelector } from "react-redux";
import { SelectCurrentUser } from "../redux/user/userSlice";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
const Profile = () => {
  const fileRef = useRef(null)
  const currentUser = useSelector(SelectCurrentUser);
  const [file, setFile] = useState(undefined)
const [filePercentage, setFilePercentage] = useState(0)
const [fileUploadError, setFileUploadError] = useState(false)
const [formData, setFormData] = useState({})
useEffect(() => {
  if(file){

handleFileUpload(file);

  }


}, [file])

const handleFileUpload = (file) => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${new Date().getTime()}${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed', 
  (snapshot) => {

    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setFilePercentage(Math.round(progress))
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    setFileUploadError(true);
  }, 
  () => {
 
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      setFormData({...formData , avatar: downloadURL});
    });
  }
);




}





  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden accept="image/*" ref={fileRef}  />
        <img
        referrerPolicy="no-referrer"
        onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="self-center">
          
          {
          
          
          fileUploadError ? 
        <span className="text-red-700">Error Image Upload (image must be less than 2 mb)</span> :
        filePercentage > 0 && filePercentage < 100 ? 
        <span className="text-slate-700">Uploading {filePercentage}%</span> :
        filePercentage === 100 ?
         <span className="text-green-700 ">Upload Completed</span> : ''
        
        
        
        
        }
         
         
         
         </p>



        <input type="text" placeholder="username"  id="username" className="border p-3 rounded-lg "  />
        <input type="email" placeholder="email" id="email"  className="border p-3 rounded-lg "  />
        <input type="password" placeholder="password" id="password"  className="border p-3 rounded-lg "  />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer ">Delete Account</span>
        <span className="text-red-700 cursor-pointer ">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
