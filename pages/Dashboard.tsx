import React, { useEffect, useState } from 'react';
import { Role } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';
import { ApiService } from '../services/apiService';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState({ users: 0, projects: 0, myProjects: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await ApiService.user.list();
      const projects = await ApiService.project.list();
      
      setStats({
        users: users.total,
        projects: projects.length,
        myProjects: projects.filter(p => p.createdBy === user?.id).length
      });

      // Prepare chart data: Projects by Status
      const active = projects.filter(p => p.status === 'ACTIVE').length;
      const archived = projects.filter(p => p.status === 'ARCHIVED').length;
      setChartData([
        { name: 'Active', count: active },
        { name: 'Archived', count: archived },
      ]);
    };
    fetchData();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Welcome back, {user?.email}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.projects}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">My Projects</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.myProjects}</div>
        </div>
        {user?.role === Role.ADMIN && (
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</div>
           <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.users}</div>
         </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Project Status Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;