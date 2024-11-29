import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const navigate = useNavigate()

    function handleLogOut(e){
        e.preventDefault

        localStorage.clear()
        navigate('/login')
    }

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("http://localhost:3000/user", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
          setUser(response.data); 
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, []);


    
  return (
    <nav className="bg-gray-600 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/logoKanban-preview.png"
            className="h-20"
            alt="Kanban Logo"
          />
          <span className="self-center text-2xl text-white font-semibold whitespace-nowrap dark:text-white">
            Kanban Project
          </span>
        </div>

        {/* User Menu Button */}
        <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
          <button
            onClick={toggleDropdown}
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            aria-expanded={isDropdownOpen}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src={
                user?.picture ||
                "/default-avatar.png" 
              }
              alt="User"
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-2.5 top-[72px]">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.username }
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <button
                    onClick={handleLogOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
 
        </div>
      </div>
    </nav>
  );
}
