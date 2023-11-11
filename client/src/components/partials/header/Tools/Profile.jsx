import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/pages/auth/common/store";
import jwtDecode from "jwt-decode";
import { useAuth, UserButton } from "@clerk/clerk-react";

import UserAvatar from "@/assets/images/all-img/user.png";

const profileLabel = () => {
  const { isAuth } = useSelector((state) => state.auth);
  let userDetails = null;
  let usersname = null;

  if (isAuth) {
    //  userDetails = jwtDecode(isAuth);
    //  usersname = userDetails.name;
  }
  
  if (!isAuth) {
    usersname = 'Albert';
  }

  const { userId } = useAuth();
  return (
    <div className="flex items-center">
      <UserButton />
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        console.log("profile");
      },
    },
    {
      label: "Chat",
      icon: "heroicons-outline:chat",
      action: () => {
        console.log("chat");
      },
    },
    {
      label: "Email",
      icon: "heroicons-outline:mail",
      action: () => {
        console.log("email");
      },
    },
    {
      label: "Todo",
      icon: "heroicons-outline:clipboard-check",
      action: () => {
        console.log("todo");
      },
    },
    {
      label: "Settings",
      icon: "heroicons-outline:cog",
      action: () => {
        console.log("settings");
      },
    },
    {
      label: "Price",
      icon: "heroicons-outline:credit-card",
      action: () => {
        console.log("price");
      },
    },
    {
      label: "Faq",
      icon: "heroicons-outline:information-circle",
      action: () => {
        console.log("faq");
      },
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
        dispatch(handleLogout(false));
      },
    },
  ];

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block     ${
                item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
