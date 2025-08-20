import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, User as UserIcon, Download, CheckCircle, Clock, AlertCircle, Filter, Search } from 'lucide-react';
import { supabase, PrintJob } from '../lib/supabase';

const PrintShopDashboard: React.FC = () => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'ready'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrintJobs();
    
    // Set up real-time subscription for new print jobs
    const subscription = supabase
      .channel('print_jobs_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'print_jobs' }, 
        (payload) => {
          console.log('Change received!', payload);
          fetchPrintJobs(); // Refresh the list when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPrintJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('print_jobs')
        .select(`
          *,
          user:users(name, email, college_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrintJobs(data || []);
    } catch (err: any) {
      console.error('Error fetching print jobs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: PrintJob['status']) => {
    try {
      const { error } = await supabase
        .from('print_jobs')
        .update({ 
          status: newStatus,
          ...(newStatus === 'completed' && { completed_at: new Date().toISOString() })
        })
        .eq('id', jobId);

      if (error) throw error;
      
      // Refresh the list
      fetchPrintJobs();
    } catch (err: any) {
      console.error('Error updating job status:', err.message);
      alert('Failed to update job status');
    }
  };

  const getStatusInfo = (status: PrintJob['status']) => {
    switch (status) {
      case 'pending': return { icon: <Clock className="w-4 h-4 text-yellow-500" />, text: 'New Order', color: 'bg-yellow-100 text-yellow-800' };
      case 'processing': return { icon: <FileText className="w-4 h-4 text-blue-500" />, text: 'Printing', color: 'bg-blue-100 text-blue-800' };
      case 'ready': return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: 'Ready', color: 'bg-green-100 text-green-800' };
      case 'completed': return { icon: <CheckCircle className="w-4 h-4 text-gray-500" />, text: 'Collected', color: 'bg-gray-100 text-gray-800' };
      case 'failed': return { icon: <AlertCircle className="w-4 h-4 text-red-500" />, text: 'Failed', color: 'bg-red-100 text-red-800' };
    }
  };

  const filteredJobs = printJobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCounts = () => {
    return {
      pending: printJobs.filter(job => job.status === 'pending').length,
      processing: printJobs.filter(job => job.status === 'processing').length,
      ready: printJobs.filter(job => job.status === 'ready').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="bg-gray-100 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading print shop dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Print Shop Dashboard</h1>
            <p className="text-gray-600">Manage incoming print orders from JIIT students</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Orders</p>
                  <p className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{statusCounts.processing}</p>
                </div>
                <FileText className="w-12 h-12 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready for Pickup</p>
                  <p className="text-3xl font-bold text-green-600">{statusCounts.ready}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">New Orders</option>
                  <option value="processing">In Progress</option>
                  <option value="ready">Ready for Pickup</option>
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by file name, student name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-80"
                />
              </div>
            </div>
          </div>

          {/* Print Jobs List */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Print Orders ({filteredJobs.length})
              </h2>
              
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No print orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map(job => {
                    const status = getStatusInfo(job.status);
                    return (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-gray-800">{job.file_name}</h3>
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                  {status.icon} {status.text}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <span className="flex items-center gap-1">
                                  <UserIcon className="w-4 h-4" />
                                  {job.user?.name}
                                </span>
                                <span>{job.user?.email}</span>
                                {job.user?.college_id && <span>ID: {job.user.college_id}</span>}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{job.print_options.color ? 'Color' : 'B&W'}</span>
                                <span>{job.print_options.copies} copies</span>
                                <span>₹{job.cost}</span>
                                <span>{new Date(job.created_at).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <a
                              href={job.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                            
                            {job.status === 'pending' && (
                              <button
                                onClick={() => updateJobStatus(job.id, 'processing')}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Start Printing
                              </button>
                            )}
                            
                            {job.status === 'processing' && (
                              <button
                                onClick={() => updateJobStatus(job.id, 'ready')}
                                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Mark Ready
                              </button>
                            )}
                            
                            {job.status === 'ready' && (
                              <button
                                onClick={() => updateJobStatus(job.id, 'completed')}
                                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                Mark Collected
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrintShopDashboard;
