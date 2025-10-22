"use client";
import Button from "@/components/Button";
import { api } from "@/lib/apiClient";
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
  const submitJob = async (data: jobDataType) => {
    console.log({ data });
    try {
      const response = await api.post(`/api/addJob`, data);
      console.log({ response });
      if (response) {
        toast.success("Job added Successfully");
      }
      reset();
    } catch (error) {
      toast.error("Failed to add Job");
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
    <div className="flex justify-center items-center min-h-screen">
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
          <input
            type="text"
            id="job_name"
            className=" border border-white rounded-3xl p-2 text-black"
            placeholder="Enter Job Name"
            {...register("job_name", { required: true })}
          />

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
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-600"
            value="Add Job"
          />
        </form>
      </div>
    </div>
  );
}
