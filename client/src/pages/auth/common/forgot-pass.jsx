import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSignIn } from "@clerk/clerk-react";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [complete, setComplete] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const create = async (e) => {
    e.preventDefault();

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (err) {
      console.error('error', err.errors[0].message);
    }
  };

  const reset = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'needs_second_factor') {
        setSecondFactor(true);
      } else if (result.status === 'complete') {
        setActive({ session: result.createdSessionId });
        setComplete(true);
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error('error', err.errors[0].message);
    }
  };

  // Render conditionally based on the state values
  return (
    <form onSubmit={!successfulCreation ? create : reset} className="space-y-4">
      {!successfulCreation && !complete && (
        <>
          <Textinput
            name="email"
            label="Email"
            type="email"
            placeholder='e.g john@doe.com'
            value={email}
            register={register}
            onChange={e => setEmail(e.target.value)}
            className="h-[48px]"
          />
          <button className="btn btn-dark block w-full text-center">
            Send recovery email
          </button>
        </>
      )}

      {successfulCreation && !complete && (
        <>
          <Textinput
            name="password"
            label="New Password"
            type="password"
            placeholder="New password"
            register={register}
            error={errors.password}
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            className="h-[48px]"
            value={password}
          />
          <Textinput
            label="Reset password code"
            type="text"
            placeholder="Reset password code"
            register={register}
            error={errors.password}
            name="code"
            onChange={(e) => setCode(e.target.value)}
            className="h-[48px]"
            value={code}
          />
          <button className="btn btn-dark block w-full text-center">
            Reset
          </button>
        </>
      )}
      {complete && 'You successfully changed you password'}
      {secondFactor && '2FA is required, this UI does not handle that'}
    </form>
  );
};

export default ForgotPass;
