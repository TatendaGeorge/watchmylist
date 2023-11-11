import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "./common/login-form";
import useDarkMode from "@/hooks/useDarkMode";
import { ToastContainer } from "react-toastify";
import { useUser, useAuth } from "@clerk/clerk-react";

// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import Illustration from "@/assets/images/auth/ils1.svg";
import LoginBackground from "@/assets/images/auth/login-bg.jpg";

const login = () => {
  const [isDark] = useDarkMode();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/overview");
    }
  }, [isSignedIn]);

  return (
    <>
      <ToastContainer />
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]"
          style={{
            backgroundImage: `url(${LoginBackground})`, // Replace with your image URL
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'transparent', // Add additional styles as needed
          }}
          >
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
              <Link to="/">
                <img src={isDark ? LogoWhite : Logo} alt="" className="mb-10" />
              </Link>
              <h4>
                Unlock your Project
                <span className="text-slate-800 dark:text-slate-400 font-bold">
                  performance
                </span>
              </h4>
            </div>
            <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]"
             
            >
              {/* <img
                src={LoginBackground}
                alt=""
                className="h-full w-full object-contain"
              /> */}
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link to="/">
                    <img
                      src={isDark ? LogoWhite : Logo}
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Sign in</h4>
                  <div className="text-slate-500 text-base">
                    Sign in to your account to start using Milani
                  </div>
                </div>
                <LoginForm />
                {/* <SignIn /> */}
                <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                  Don’t have an account?{" "}
                  <Link
                    to="/sign-up"
                    className="text-slate-900 dark:text-white font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
              <div className="auth-footer text-center">
                Copyright 2023, Milani All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
