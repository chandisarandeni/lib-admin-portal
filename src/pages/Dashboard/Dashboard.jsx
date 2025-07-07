import React from "react";

import { Route, Routes, Link, NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiBookShelfFill } from "react-icons/ri";
import { FaRegCalendarTimes, FaRegUser } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import Main from '../Main'
import AddBooks from '../AddBooks'
import AddUser from '../AddUser'
import AllBooks from '../AllBooks'
import AllUsers from '../AllUsers'
import EditBookModal from '../../components/EditBookModal'
import OverdueBooks from '../OverdueBooks'
import EditUserModal from "../../components/EditUserModal";
import Profile from "../Profile";
import { assets } from "../../assets/assests";
import Borrow from "../Borrow";
import { SiBookstack } from "react-icons/si";
import Librarian from "../Librarian";


const Dashboard = () => {
  

  const sidebarLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LuLayoutDashboard /> },
    { name: "Books", path: "/dashboard/all-books", icon: <RiBookShelfFill /> },
    { name: "Users", path: "/dashboard/all-users", icon: <FaRegUser /> },
    { name: "Overdue Books", path: "/dashboard/overdue-books", icon: <FaRegCalendarTimes /> },
    { name: "profile", path: "/dashboard/profile", icon: <ImProfile /> },
    {name: "Borrowed Books", path: "/dashboard/borrowed-books", icon: <SiBookstack />},
    {name: "Librarians", path: "/dashboard/librarians", icon: <FaRegUser />},
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="md:w-64 w-16 border-r border-gray-300 bg-white flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-[#8E552C]">
          <a href="/">
            <img
              className="h-9"
              src={assets.logo}
              alt="dummyLogoColored"
            />
          </a>
          <div className="flex items-center gap-5 text-gray-500 md:hidden">
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="pt-4 flex flex-col flex-1">
          {sidebarLinks.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 transition-colors
                            ${
                              isActive
                                ? "border-r-4 md:border-r-[6px] bg-[#B67242]/10 border-[#8E552C] text-[#B67242]"
                                : "hover:bg-gray-100/90 border-white text-gray-700"
                            }`
              }
              end={item.path === "/dashboard"}
            >
              {item.icon}
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header for larger screens */}
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-[#8E552C]">
          <div></div>
          <div className="flex items-center gap-5 text-black">
            <p>Hi! Admin</p>
            <button className="border rounded-full text-sm px-4 py-1">
              Logout
            </button>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="" element={<Main />} />
            <Route path="add-books" element={<AddBooks />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="edit-book/:id" element={<EditBookModal />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-books" element={<AllBooks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="overdue-books" element={<OverdueBooks />} />
            <Route path="borrowed-books" element={<Borrow />} />
            <Route path="librarians" element={<Librarian />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
