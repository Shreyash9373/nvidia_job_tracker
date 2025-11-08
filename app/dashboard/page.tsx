"use client";
import Button from "@/components/Button";
import { api } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
interface jobDataType {
  job_name: string;
  jobs_no: number;
  reported_no: number;
  time_slot: string;
}
export default function addJob() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<jobDataType>();

  const timeSlot = [
    "9 to 10",
    "10 to 11",
    "11 to 12",
    "12 to 1",
    "1 to 2",
    "2 to 3",
    "3 to 4",
    "4 to 5",
    "5 to 6",
  ];
  const jobNames = [
    "lane-change",
    "nudge",
    "risky-driving",
    "stop-for-TL/TS",
    "curvy-road",
    "VRU",
    "speed-bump",
    "stop-for-lead",
    "slow-for-lead",
  ];
  const [jobAdded, setJobAdded] = useState(false);
  const router = useRouter();
  const submitJob = async (data: jobDataType) => {
    try {
      setJobAdded(true);
      const response = await api.post(`/api/addJob`, data);

      if (response.status === 401) {
        toast.error("Session Expired! Please login again.");
        router.push("/login");
      }
      toast.success("Job added Successfully");

      reset();
    } catch (error) {
      toast.error("Failed to add Job");
    } finally {
      setJobAdded(false);
    }
  };
  const addJob = () => {
    const current = getValues("jobs_no") || 0;
    setValue("jobs_no", current + 1);
  };
  const removeJob = () => {
    const current = getValues("jobs_no") || 0;
    setValue("jobs_no", current > 0 ? current - 1 : 0);
  };
  const addReportedJob = () => {
    const current = getValues("reported_no") || 0;
    setValue("reported_no", current + 1);
  };
  const removeReportedJob = () => {
    const current = getValues("reported_no") || 0;
    setValue("reported_no", current > 0 ? current - 1 : 0);
  };
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-green-500 p-6 rounded-2xl ">
        <form
          onSubmit={handleSubmit((data) => submitJob(data))}
          className="flex flex-col space-y-3"
        >
          {Object.keys(errors).length > 0 && (
            <p className="text-red-500 text-sm text-center">
              Please enter all the fields
            </p>
          )}
          {/* <input
            type="text"
            id="job_name"
            className=" border border-white rounded-3xl p-2 text-black"
            placeholder="Enter Job Name"
            {...register("job_name", { required: true })}
          /> */}
          <select
            {...register("job_name", { required: true })}
            className=" border border-white rounded-3xl p-2 text-black"
          >
            {jobNames.map((job) => (
              <option value={job}>{job}</option>
            ))}
          </select>

          <div className="">
            <input
              type="number"
              className="border border-white rounded-3xl p-2 text-black"
              placeholder="Enter completed Jobs"
              {...register("jobs_no", {
                required: true,
                valueAsNumber: true,
              })}
            />

            <Button onClick={addJob} name={"+"} px={0.5} py={0.1} />

            <Button onClick={removeJob} name={"-"} px={0.5} py={0.1} />
          </div>
          <div>
            <input
              type="number"
              className="border border-white rounded-3xl p-2 text-black"
              placeholder="Enter reported Jobs"
              {...register("reported_no", {
                required: true,
                valueAsNumber: true,
              })}
            />

            <Button onClick={addReportedJob} name={"+"} px={0.5} py={0.1} />

            <Button onClick={removeReportedJob} name={"-"} px={0.5} py={0.1} />
          </div>
          <select
            {...register("time_slot", { required: true })}
            className="border border-white rounded-3xl p-2 text-black"
          >
            {timeSlot.map((time) => (
              <option>{time}</option>
            ))}
          </select>
          <input
            type="submit"
            disabled={jobAdded}
            className={`bg-black text-white px-4 py-2 rounded-full  ${
              jobAdded === true
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            } `}
            value={jobAdded === true ? "Adding Job..." : "Add Job"}
          />
        </form>
      </div>
    </div>
  );
}
