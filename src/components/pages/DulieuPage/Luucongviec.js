import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function SaveJobForm() {
  const [jobPosts, setJobPosts] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedJobSeeker, setSelectedJobSeeker] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchJobPosts();
    fetchJobSeekers();
    fetchSavedJobs();
  }, []);

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd"); // Assuming /tintd is the endpoint for job posts
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("/ngtviec"); // Assuming /ngtviec is the endpoint for job seekers
      setJobSeekers(response.data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get("/luucongviec"); // Assuming /luucongviec is the endpoint for saved jobs
      setSavedJobs(response.data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      MaTTD: selectedJob,
      MaNTV: selectedJobSeeker,
    };

    try {
      await axios.post("/luucongviec", data); // Save the relationship to the backend
      fetchSavedJobs(); // Refresh the saved jobs list
      alert("Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  // Export saved jobs to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    // Add title
    doc.setFontSize(18);
    doc.text("Saved Job Assignments", 14, 20);
    doc.setFontSize(12);

    // Prepare data for the table
    const headers = [["ID", "Mã TTD", "MÃ NTV"]];
    const rows = savedJobs.map((job) => [job.id, job.MaTTD, job.MaNTV]);

    // Create the table
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: "striped",
      styles: {
        font: "Roboto-Regular",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Màu nền tiêu đề bảng
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
    });

    // Save the PDF
    doc.save("saved_jobs.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Save a Job for a Job Seeker
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Job Position:
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select a job
            </option>
            {jobPosts.map((job) => (
              <option key={job.id} value={job.id}>
                {job.tieude}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Job Seeker:
          </label>
          <select
            value={selectedJobSeeker}
            onChange={(e) => setSelectedJobSeeker(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select a job seeker
            </option>
            {jobSeekers.map((seeker) => (
              <option key={seeker.id} value={seeker.id}>
                {seeker.ten}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
        >
          Lưu
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-center">
        Lưu Công việc
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Export to PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Mã TTD</th>
              <th className="px-4 py-2 border-b">Mã NTV</th>
            </tr>
          </thead>
          <tbody>
            {savedJobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{job.id}</td>
                <td className="px-4 py-2 border-b">{job.MaTTD}</td>
                <td className="px-4 py-2 border-b">{job.MaNTV}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SaveJobForm;
