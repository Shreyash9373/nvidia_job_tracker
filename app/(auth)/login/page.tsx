"use client";

import { api } from "@/lib/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface loginDataType {
  identifier: string;
  password: string;
}

const page = () => {
  const { register, handleSubmit, reset } = useForm<loginDataType>();
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const registerUser = async (data: loginDataType) => {
    try {
      setLoggedIn(true);
      const response = await api.post("/api/auth/login", data);
      if (response) {
        toast.success("LoggedIn Successfully");
        router.push("/dashboard");
      }
      setLoggedIn(false);
      reset();
    } catch (error) {
      setLoggedIn(false);
      toast.error("Failed to Login");
    }
  };
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="flex flex-col p-5 border border-gray-400 rounded-3xl bg-green-500 ">
        <h1 className="font-bold text-2xl">Login</h1>
        <p className="font-extralight text-sm">Access your account</p>
        <form
          onSubmit={handleSubmit((data) => registerUser(data))}
          className="flex flex-col space-y-2 mt-3"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">
              Email or Username
            </label>
            <input
              type="text"
              id="email"
              className="border border-white rounded-3xl px-2 py-1 "
              placeholder="Enter your email"
              {...register("identifier")}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              id="password"
              className="border border-white rounded-3xl px-2 py-1 "
              {...register("password")}
            />
          </div>

          <input
            type="submit"
            className={`bg-black text-white hover:bg-gray-500 rounded mx-1 px-2 py-0.5 my-2 ${
              loggedIn === true
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
            value={loggedIn === true ? "Logging In..." : "Login"}
          />
        </form>
        <p>
          <Link className="text-blue-600 cursor-pointer" href="/register">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
