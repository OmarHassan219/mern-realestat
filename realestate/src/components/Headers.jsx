import {FaSearch} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { SelectCurrentUser } from '../redux/user/userSlice'
import { current } from '@reduxjs/toolkit'
const Headers = () => {

const currentUser = useSelector(SelectCurrentUser)



  return (
    <header className="bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
<Link to="/">
<h1 className="font-bold text-sm sm:text-xl ">
    <span className="text-slate-500">Sahand</span>
    <span className="text-slate-700">Estate</span>
</h1>
</Link>
<form className="bg-slate-100 p-3 rounded-lg flex items-center">
    <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64 "/>
    <FaSearch className='text-slate-600'/>
</form>
<ul className='flex gap-4 '>
    <Link to="/">
    <li className='hidden sm:inline hover:underline text-slate-700 cursor-pointer'>Home</li>
    </Link>
    <Link to="about">
    <li className='hidden sm:inline hover:underline text-slate-700 cursor-pointer' >About</li>
    </Link>
    {!currentUser ? (

      <Link to="/sign-in">
    <li className='hover:underline text-slate-700 cursor-pointer' >Sign in</li>
    </Link>




      ):
      (
<Link to='/profile'>
<img   src={currentUser.avatar} alt='profile'  className='rounded-full h-7 w-7 object-cover ' />
</Link>


      )
      
      
      
      
      }
</ul>
        </div>
    </header>
  )
}

export default Headers