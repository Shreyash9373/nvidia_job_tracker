"use client";
import Button from "@/components/Button";
import { api } from "@/lib/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface registerDataType {
  email: string;
  username: string;
  password: string;
}

const page = () => {
  const { register, handleSubmit, reset } = useForm<registerDataType>();
  const [registered, setRegistered] = useState(false);
  const router = useRouter();
  const registerUser = async (data: registerDataType) => {
    try {
      setRegistered(true);
      const response = await api.post("/api/auth/register", data);
      if (response) {
        toast.success("Registerd Successfully");
        router.push("/login");
      }
      setRegistered(false);
      reset();
    } catch (error) {
      setRegistered(false);
      toast.error("Failed to Register");
    }
  };
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="flex flex-col p-5 border border-gray-400 rounded-3xl bg-green-500 ">
        <h1 className="font-bold text-2xl">Create an account</h1>
        <p className="font-extralight text-sm">
          Sign up with your email and username
        </p>
        <form
          onSubmit={handleSubmit((data) => registerUser(data))}
          className="flex flex-col space-y-2 mt-3"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-white rounded-3xl px-2 py-1 "
              placeholder="Enter your email"
              {...register("email")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              id="username"
              className="border border-white rounded-3xl px-2 py-1 "
              {...register("username")}
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
              registered === true
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
            value={registered === true ? "Registering..." : "Register"}
          />
        </form>
        <p>
          Already have an account?{" "}
          <Link className="text-blue-600 cursor-pointer" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
