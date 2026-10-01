import React, { useState, useEffect } from 'react';
import { Bookmark, Briefcase } from 'lucide-react';
import JobCard from '../../components/JobCard';
import api from '../../services/api';

const StudentSavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/saved-jobs/my-saved');
      setSavedJobs(res.data.jobs);
    } catch (err) {
      console.error('Lỗi lấy danh sách việc làm đã lưu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs(savedJobs.filter((j) => j.id !== jobId));
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-64"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-sky-600 fill-current" /> Việc Làm Đã Lưu ({savedJobs.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">Danh sách các công việc bạn đã đánh dấu để xem lại hoặc ứng tuyển sau.</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">Chưa có việc làm nào được lưu</h3>
          <p className="text-xs text-gray-500">Bấm biểu tượng Bookmark trên danh sách việc làm để lưu trữ công việc yêu thích.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} isSavedInitial={true} onSaveToggle={handleSaveToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSavedJobsPage;
