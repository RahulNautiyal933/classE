import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { useSelector } from "react-redux";
import { NavbarLinks } from "../../data/navbar-links";
import { IoCart } from "react-icons/io5";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import { AiOutlineMenu } from "react-icons/ai";
import { categories } from "../../services/apis";
import {apiConnector} from "../../services/apiconnector";
import {BsChevronDown} from "react-icons/bs"

export const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  useEffect(() => {
    (async()=>{
      setLoading(true);
      try {
        const res = await apiConnector("GET", `${categories.CATEGORIES_API}`);
        setSubLinks(res.data.allCategory);

      } catch (error) {
        console.log("could not fetch categories.", error);
      }
      setLoading(false);
    })()
  }, []);

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to={"/"}>
          <img src={logo} alt="logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* Navigation links */}
        <nav className="">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {/* Catalog wala case */}
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>

                        {loading?(
                            <p className="text-center">Loading...</p>
                        ):subLinks.length?(
                            <>
                            {
                                subLinks?.filter((sublink)=>sublink?.name?.length > 0)
                                ?.map((sublink,index)=>(
                                    <Link to={`/catalog/${sublink.name.
                                    split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" key={index}>
                                        <p>{sublink.name}</p>
                                    </Link>
                                ))
                            }
                            </>
                        ):(
                            <p>No Courses found</p>
                        )}
                    </div>
                  </div>

                ) : (
                  <Link to={link?.path}>
                    {/* non catalog wala case */}
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login/signup/dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {/* if user present and not an instructor show cart */}
          {user && user?.accountType != "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <IoCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {/* if no token present logIn */}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
};
