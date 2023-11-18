import { useDispatch, useSelector } from "react-redux";
import {
  DELETE_USER_FAILURE,
  DELETE_USER_START,
  DELETE_USER_SUCCESS,
  SIGNOUT_USER_FAILURE,
  SIGNOUT_USER_START,
  SIGNOUT_USER_SUCCESS,
  SelectCurrentUser,
  SelectError,
  SelectLoading,
  UPDATE_USER_FAILURE,
  UPDATE_USER_START,
  UPDATE_USER_SUCCESS,
} from "../redux/user/userSlice";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const currentUser = useSelector(SelectCurrentUser);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const error = useSelector(SelectError);
  const [showListingsError, setshowListingsError] = useState(false);
  const loading = useSelector(SelectLoading);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const [userListings, setUserListings] = useState([]);
  const handleFileUpload = (file) => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `images/${new Date().getTime()}${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(UPDATE_USER_START());

      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === false) {
        dispatch(UPDATE_USER_FAILURE(data.message));
        return;
      }
      dispatch(UPDATE_USER_SUCCESS(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(UPDATE_USER_FAILURE(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(DELETE_USER_START());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(DELETE_USER_FAILURE(data.message));
        return;
      }

      dispatch(DELETE_USER_SUCCESS(data));
    } catch (error) {
      dispatch(DELETE_USER_FAILURE(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(SIGNOUT_USER_START());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(SIGNOUT_USER_FAILURE(data.message));

        return;
      }
      dispatch(SIGNOUT_USER_SUCCESS(data));
    } catch (error) {
      dispatch(SIGNOUT_USER_FAILURE(error));
    }
  };

  const handleShowListings = async () => {
    try {
      setshowListingsError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success) {
        setshowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setshowListingsError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
        />
        <img
          referrerPolicy="no-referrer"
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 2 mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">Uploading {filePercentage}%</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700 ">Upload Completed</span>
          ) : (
            ""
          )}
        </p>

        <input
          onChange={handleChange}
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg "
        />
        <input
          onChange={handleChange}
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg "
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg "
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer "
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer ">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is Updated Successfully" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings " : ""}
      </p>
      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold ">Your Listings</h1>
         { userListings.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-3">
              <Link to={`/listing/${listing._id}`} className="flex gap-4 justify-between items-center">
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain "
                />
                <p className="text-slate-700 font-semibold flex-1 hover:underline truncate">{listing.name}</p>
                <div className="flex flex-col items-center">
  <button className="text-red-700 uppercase">Delete</button>
  <button className="text-red-700 uppercase">Edit</button>
                </div>
              </Link>
            </div>
          ))}

        </div>}
    </div>
  );
};

export default Profile;
