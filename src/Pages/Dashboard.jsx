import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { projectData, getProjectData, token,slotDateFormat} = useContext(AppContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    if (token) {
      getProjectData();
    }
  }, [token, getProjectData]);

  // Filter projects based on the search query
  const filteredProjects = projectData
    ? projectData.filter((project) =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 bg-gray-100 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Project Dashboard</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by project name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[calc(3*300px)] overflow-y-auto">
        {filteredProjects.length > 0 ? (
          filteredProjects.reverse().map((project, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{project.projectName}</h2>
                <p className="text-sm text-gray-600 mb-2">Location: {project.location}</p>
                <p className="text-sm text-gray-600 mb-4">Created At:  {slotDateFormat(new Date(project.projectDate).toLocaleDateString())}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                <button
                  onClick={() => navigate(`/show-expense/${project._id}`)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center py-10">
            {searchQuery ? 'No matching projects found.' : 'No projects found.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;