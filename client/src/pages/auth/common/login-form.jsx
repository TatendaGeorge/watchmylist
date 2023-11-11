import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {}, [isLoading]);

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setError(null);

    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setIsLoading(false);
        navigate("/overview");
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.errors[0].message);
    }
  };

  return (
    <form className="space-y-4 ">
      {error ? (
        <Alert
          dismissible
          icon="heroicons-outline:exclamation"
          className=" light-mode alert-danger"
        >
          {error}
        </Alert>
      ) : null}
      <Textinput
        name="email"
        label="email"
        placeholder="name@company.com"
        type="email"
        register={register}
        error={errors.email}
        className="h-[48px]"
        onChange={(e) => setEmailAddress(e.target.value)}
        id="email"
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        placeholder="Enter your password"
        register={register}
        error={errors.password}
        hasicon
        className="h-[48px]"
        onChange={(e) => setPassword(e.target.value)}
        id="password"
      />
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
      </div>
      <Button
        text="Sign in"
        className="w-full btn-dark"
        onClick={handleSubmit}
        isLoading={isLoading}
      />
      {/* <button className="btn btn-dark block w-full text-center">Sign in</button> */}
    </form>
  );
};

export default LoginForm;
