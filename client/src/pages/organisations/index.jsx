import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import Card from "@/components/ui/Card";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import { UserButton } from "@clerk/clerk-react";
import { useOrganizationList } from "@clerk/clerk-react";

import Textinput from "@/components/ui/Textinput";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import OrganisationOptions from "@/components/partials/OrganisationOptions";

const schema = yup
  .object({
    organizationName: yup.string().required("Oraganisation name is required"),
  })
  .required();

const Organisations = () => {
  let userRole;
  let organizationId;
  const navigate = useNavigate();
  const [isDark] = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const { organizationList, createOrganization, isLoaded } = useOrganizationList();

  const {
    register,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    if (userRole === "basic_member") {
      navigate(`/overview/${organizationId}`);
    }
  }, [organizationList, isLoaded, organizationName]);

  if (!organizationList) {
    navigate("/error");
    return null;
  }

  if (isLoaded) {
    if (organizationList.length === 0) {
      navigate("/error");
    }

    organizationList.map(
      ({ membership, organization }) => (
        (userRole = membership.role), (organizationId = organization.id)
      )
    );
  }

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const result = await createOrganization({ name: organizationName });
    if (result.id) {
      toast.success("Add Successfully", {
        position: "bottom-left",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        icon: false
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
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
      <div className="container mt-20">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <h4 className="text-3xl font-medium text-slate-900 dark:text-white mb-2">
              Organisations
            </h4>
            <p className="font-normal text-base text-slate-500 dark:text-slate-300">
              Create and manage organizations, their settings and members
            </p>
          </div>
          <div className="flex space-x-4 justify-end items-center rtl:space-x-reverse">
            {/* <Button
              link={"/create-organisation"}
              icon="heroicons-outline:plus"
              text="Create Organisation"
              className="bg-slate-800 dark:hover:bg-opacity-70 h-min text-sm font-medium text-slate-50 hover:ring-2 hover:ring-opacity-80 ring-slate-900  hover:ring-offset-1  dark:hover:ring-0 dark:hover:ring-offset-0"
              iconclassName="text-lg"
            /> */}
            <Modal
              title="Create Organisation"
              label="Create Organisation"
              labelClass="bg-slate-800 dark:hover:bg-opacity-70   h-min text-sm font-medium text-slate-50 hover:ring-2 hover:ring-opacity-80 ring-slate-900  hover:ring-offset-1  dark:hover:ring-0 dark:hover:ring-offset-0"
              uncontrol
              className="max-w-md"
              footerContent={
                <Button
                  text="Create"
                  className="btn-dark "
                  onClick={handleSubmit}
                  isLoading={isLoading}
                />
              }
            >
              {/* <form onSubmit={handleSubmit} className="space-y-5"> */}
                <Textinput
                  name="organizationName"
                  value={organizationName}
                  label="Name"
                  placeholder="Enter your business name"
                  type="text"
                  register={register}
                  error={errors.organizationName}
                  className="h-[48px]"
                  onChange={(e) => setOrganizationName(e.target.value)}
                  id="organizationName"
                />
              {/* </form> */}
            </Modal>
          </div>
        </div>
        <hr></hr>
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 card-height-auto mt-10">
          {organizationList.map(({ organization }) => (
            // <Link to={"/overview"} key={organization.id}>
              <Card bodyClass="p-0" title={organization.name} headerslot={<OrganisationOptions organisationId={organization.id}/>} key={organization.id}>
                {/* <div className="image-box">
                  <img
                    src={organization.imageUrl}
                    alt=""
                    className="rounded-t-md w-full h-full object-cover"
                  />
                </div> */}
                <div className="p-6">
                  <div className="text-sm">
                    Lorem ipsum dolor sit amet, consec tetur adipiscing elit,
                    sed do eiusmod tempor incididun ut .
                  </div>
                </div>
              </Card>
            // </Link>
          ))}
        </div>
      </div>
      {/* <div className="fixed bottom-0 w-full">
        <div className="container">
          <div className="md:flex justify-between items-center flex-wrap space-y-4 py-6">
            <div>
              <ul className="flex md:justify-start justify-center space-x-3">
                <li>
                  <a href="#" className="social-link">
                    <Icon icon="icomoon-free:facebook" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Icon icon="icomoon-free:twitter" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Icon icon="icomoon-free:linkedin2" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Icon icon="icomoon-free:google" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul className="flex md:justify-start justify-center space-x-3">
                <li>
                  <a
                    href="#"
                    className="text-slate-500 dark:text-slate-400 text-sm transition duration-150 hover:text-slate-900"
                  >
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 dark:text-slate-400 text-sm transition duration-150 hover:text-slate-900"
                  >
                    Faq
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 dark:text-slate-400 text-sm transition duration-150 hover:text-slate-900"
                  >
                    Email us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Organisations;
