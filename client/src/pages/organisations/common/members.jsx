import React, { useEffect, useState } from "react";
import RecentOrderTable from "../../../components/partials/Table/recentOrder-table";
import MembersTable from "./members-table";

const Members = ({ members }) => {
  return (
    <div>
      <div className="conten-box lg:col-span-9 col-span-12 pl-10 pr-10">
        <div className="pb-10 flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>

          <p className="ml-2">Members</p>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          <div className="lg:col-span-3 md:col-span-2 col-span-1 mb-6">
            <h6 className="text-slate-800 dark:text-slate-300">Members</h6>
            <p className="font-normal text-slate-500 dark:text-slate-300 mt-3 mb-5">
              Manage and search for members with ease.
            </p>
            {/* <hr className="mt-5"></hr> */}
            <RecentOrderTable members={members}/>
            {/* <MembersTable/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
