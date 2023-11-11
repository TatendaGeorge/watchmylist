import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "@/components/ui/Select";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string().required("Oraganisation name is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
  })
  .required();

const serviceTypes = [
  { value: "medical clinics & Doctors", label: "Medical Clinics & Doctors" },
  { value: "dentists", label: "Dentists" },
  { value: "chiropractics", label: "Chiropractics" },
  { value: "acupuncture", label: "Acupuncture" },
  { value: "massage", label: "Massage" },
  { value: "physiologists", label: "Physiologists" },
  { value: "psychologists", label: "Psychologists" },
];

const OrganisationProfile = ({ organisation }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    if (!organisation) {
      return;
    }

    setName(organisation.name);
  }, [organisation]);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const result = await organisation.update({ name: name });

    if (result.id) {
      toast.success("Organisation Settings saved", {
        position: "bottom-left",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        icon: false,
      });
      setIsLoading(false);
    }
  };

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
              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
            />
          </svg>
          <p className="ml-2">Organisation</p>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          <div className="lg:col-span-3 md:col-span-2 col-span-1 mb-6">
            <h6 className="text-slate-800 dark:text-slate-300">
              Organisation Details
            </h6>
            <p className="font-normal text-slate-500 dark:text-slate-300 mt-3">
              Manage organisation profile
            </p>
            <hr className="mt-5"></hr>
          </div>
          <Textinput
            name="name"
            defaultValue={organisation.name}
            label="Name"
            placeholder="Name"
            type="text"
            register={register}
            error={errors.name}
            className="h-[48px]"
            onChange={(e) => setName(e.target.value)}
            id="name"
          />
          <Textinput
            name="phoneNumber"
            value={phoneNumber}
            label="Phone Number"
            placeholder="Phone Number"
            type="text"
            register={register}
            error={errors.phoneNumber}
            className="h-[48px]"
            onChange={(e) => setPhoneNumber(e.target.value)}
            id="phoneNumber"
          />
          <Select
            name="serviceType"
            register={register}
            options={serviceTypes}
            label="Medical Service Type"
            className="h-[48px]"
          />
          <Button
            text="Apply Changes"
            className="w-full btn-dark"
            onClick={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganisationProfile;
