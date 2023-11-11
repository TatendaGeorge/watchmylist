import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { useSignUp } from "@clerk/clerk-react";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

const schema = yup
  .object({
    first_name: yup.string().required("First Name is Required"),
    last_name: yup.string().required("Last Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter password"),
    confirmpass: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const RegForm = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  // Form Submit
  const handleSubmit = async (e) => {
    setIsLoading(true);
    setError(null);
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    await signUp.create({
      first_name: firstName,
      last_name: lastName,
      email_address: email,
      password,
    })
    .then(() => {
      signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
      setIsLoading(false);
    })
    .catch((err) => {
      setIsLoading(false);
      setError(err.errors[0].message);
    });
  };

  // Verify User Email Code
  const onPressVerify = async (e) => {
    setIsLoading(true);
    setError(null);
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== 'complete') {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        setIsLoading(false);
        navigate("/organisations");
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.errors[0].message);
    }
  };

  return (
    <>
      {!pendingVerification && (
        <form onSubmit={handleSubmit} className="space-y-5">
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
            name='first_name'
            label="first name"
            type="text"
            placeholder="First Name"
            id='first_name'
            onChange={(e) => setFirstName(e.target.value)}
            className="h-[48px]"
            register={register}
            error={errors.first_name}
          />
          <Textinput
            label="last name"
            type="text"
            placeholder="Last Name"
            register={register}
            error={errors.last_name}
            name='last_name'
            id='last_name'
            onChange={(e) => setLastName(e.target.value)}
            className="h-[48px]"
          />
          <Textinput
            label="email"
            type="email"
            placeholder="name@company.com"
            register={register}
            error={errors.email}
            name='email'
            id='email'
            onChange={(e) => setEmail(e.target.value)}
            className="h-[48px]"
          />
          <Textinput
            name="password"
            label="passwrod"
            type="password"
            placeholder="Enter your password"
            register={register}
            error={errors.password}
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            className="h-[48px]"
            hasicon
          />
          <Textinput
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            name="confirmpass"
            error={errors.confirmpass}
            register={register}
            hasicon
          />
          <Checkbox
            label="You accept our Terms and Conditions and Privacy Policy"
            value={checked}
            onChange={() => setChecked(!checked)}
          />
          <Button text="Create an account" className="w-full btn-dark"  onClick={handleSubmit} isLoading={isLoading} />
      </form>
      )}
      {pendingVerification && (
        <form className="space-y-5">
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
            label="verification code"
            type="text"
            placeholder='Enter Verification Code'
            onChange={(e) => setCode(e.target.value)}
            className="h-[48px]"
            register={register}
            value={code}
          />
          <Button text="Verify Email" className="w-full btn-dark"  onClick={onPressVerify} isLoading={isLoading} />
        </form>
      )}
    </>
    
  );
};

export default RegForm;
