import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import SimpleBar from "simplebar-react";
import { Link, useParams } from "react-router-dom";
import useWidth from "@/hooks/useWidth";
import useDarkMode from "@/hooks/useDarkMode";
import { UserButton } from "@clerk/clerk-react";
import Logo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Topfilter from "./Topfilter";
import { createOrganisationFilterLists } from "@/constant/data";
import OrganisationProfile from "./common/organisation-profile";
import Members from "./common/members";
import { useOrganizationList } from "@clerk/clerk-react";

const ConfigureOrganisation = () => {
  const params = useParams();
  const [isDark] = useDarkMode();
  const organisationId = params.id;
  const { width, breakpoints } = useWidth();
  const [active, setActive] = useState("organisationDetails");
  const [organisation, setOrganisation] = useState(null);
  const [members, setMembers] = useState([]);
  const { organizationList, isLoaded } = useOrganizationList();

  useEffect(() => {
    async function fetchData() {
      if (isLoaded) {
        const foundOrg = organizationList.find(
          ({ organization }) => organization.id === organisationId
        );

        if (foundOrg) {
          const organisation = foundOrg.organization;
          const members = await organisation.getMemberships();
          setOrganisation(organisation);
          setMembers(members);
        }
      }
    }

    fetchData();
  }, [organisationId, organizationList, isLoaded]);

  const handleFilter = (filter) => {
    setActive(filter);
  };

  if (!isLoaded || !organisation) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="left-0 top-0 w-full bg-white border-b">
        <div className="flex flex-wrap justify-between items-center py-6 container">
          <div>
            <Link to="/">
              <img src={isDark ? LogoWhite : Logo} alt="" />
            </Link>
          </div>
          <div>
            <UserButton />
          </div>
        </div>
      </div>
      <div className="container mt-10">
        <div className="flex lg:space-x-5 chat-height overflow-hidden relative rtl:space-x-reverse mt-10">
          <div
            className={`transition-all duration-150 flex-none min-w-[260px] 
            ${
              width < breakpoints.lg
                ? "absolute h-full top-0 md:w-[260px] w-[200px] z-[999]"
                : "flex-none min-w-[260px]"
            }
            ${
              width < breakpoints.lg && mobileChatSidebar
                ? "left-0 "
                : "-left-full "
            }
            `}
          >
            <SimpleBar className="contact-height">
              <ul className="list">
                {createOrganisationFilterLists?.map((item, i) => (
                  <Topfilter
                    item={item}
                    key={i}
                    filter={active}
                    onClick={() => handleFilter(item.value)}
                  />
                ))}
              </ul>
            </SimpleBar>
          </div>

          <div className="flex-1">
            <div className="parent flex space-x-5 h-full rtl:space-x-reverse">
              <div className="flex-1">
                {active === "organisationDetails" && (
                  <OrganisationProfile organisation={organisation} />
                )}

                {active === "users" && <Members members={members} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ConfigureOrganisation;
