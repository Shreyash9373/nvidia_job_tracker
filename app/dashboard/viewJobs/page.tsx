"use client";
import Button from "@/components/Button";
import { api } from "@/lib/apiClient";
import React, { useState } from "react";
interface Job {
  job_name: string;
  completed_job: number;
  reported_job: number;
  time_slot: string;
}
const page = () => {
  const [date, setDate] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loader, setLoader] = useState(false);
  const [totalCompletedJobs, setTotalCompletedJobs] = useState(0);
  const [totalReportedJobs, setTotalReportedJobs] = useState(0);

  const viewJob = async () => {
    try {
      setLoader(true);
      const result = await api.get(`/api/${date}`);
      setTotalCompletedJobs(result.data.total.total_completed);
      setTotalReportedJobs(result.data.total.total_reported);
      setJobs(result.data.data);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };
  return (
    <div className="flex flex-col items-center mt-14 space-y-2 ">
      <label>Select Date</label>
      <input
        className="border border-gray-400 p-2 rounded-3xl text-black"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button onClick={viewJob} name="View Jobs" px="2" py="0.5" />
      {loader && <p className="animate-pulse mt-4">Loading...</p>}
      {jobs.length !== 0 && !loader ? (
        <>
          {/* <div>
            {loader === true && <p className="animate-pulse">Loading...</p>}
          </div> */}
          <div className="flex w-[85%] justify-between mt-3">
            <p>
              <span className="font-bold">Total Completed: </span>{" "}
              {totalCompletedJobs}{" "}
            </p>
            <p>
              <span className="font-bold">Total Reported: </span>
              {totalReportedJobs}
            </p>
          </div>
          <div className="flex flex-col w-[85%] max-h-[400px] overflow-y-auto mt-3 space-y-3 mb-16">
            {jobs.map((elem) => (
              <div className="grid grid-cols-2 bg-green-500 px-4 py-2 border rounded-2xl ">
                <div className="">
                  <p>
                    <span className="font-bold">Name: </span>
                    {elem.job_name}
                  </p>
                  <p>
                    <span className="font-bold">Time: </span>
                    {elem.time_slot}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <span className="font-bold">Completed: </span>
                    {elem.completed_job}
                  </p>
                  <p>
                    <span className="font-bold">Reported: </span>
                    {elem.reported_job}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loader && (
          <p className="mt-4 text-lg text-black">
            No Jobs available for this date
          </p>
        )
      )}
    </div>
  );
};

export default page;
