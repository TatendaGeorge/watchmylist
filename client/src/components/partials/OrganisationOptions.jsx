import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
import { Link } from "react-router-dom";

const OrganisationOptions = ({ organisationId }) => {
  const actions = [
    {
      name: "Configure",
      icon: "heroicons-outline:pencil-alt",
      url: `/create-organisation/${organisationId}`,
    },
    {
      name: "View",
      icon: "heroicons:eye",
      url: `/overview/${organisationId}`,
    },
  ];
  return (
    <>
      <Dropdown
        classMenuItems=" w-[140px]"
        label={
          <span className="text-lg inline-flex h-6 w-6 flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded dark:text-slate-400">
            <Icon icon="heroicons-outline:dots-horizontal" />
          </span>
        }
      >
        <div>
          {actions.map((item, i) => (
            <Menu.Item key={i}>
              <Link to={item.url}>
                <div
                  className="`
                
                  hover:bg-secondary-900 dark:hover:bg-slate-600 dark:bg-opacity-60 hover:text-white text-slate-900 dark:text-slate-300
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center `"
                >
                  <Icon icon={item.icon} />
                  <span>{item.name}</span>
                </div>
              </Link>
            </Menu.Item>
          ))}
        </div>
      </Dropdown>
    </>
  );
};

export default OrganisationOptions;
