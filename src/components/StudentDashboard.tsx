import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, Clock, XCircle, FileUp, Palette, Copy, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, PrintJob } from '../lib/supabase';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isColor, setIsColor] = useState(false);
  const [copies, setCopies] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchPrintJobs();
    }
  }, [user]);

  const fetchPrintJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('print_jobs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrintJobs(data || []);
    } catch (err: any) {
      console.error('Error fetching print jobs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setError('');

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('print-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('print-files')
        .getPublicUrl(fileName);

      // Calculate cost
      const baseCost = isColor ? 3 : 2;
      const totalCost = baseCost * copies;

      // Create print job record
      const { data: jobData, error: jobError } = await supabase
        .from('print_jobs')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          print_options: {
            color: isColor,
            copies: copies,
            paper_size: 'A4'
          },
          status: 'pending',
          cost: totalCost
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Reset form
      setFile(null);
      setIsColor(false);
      setCopies(1);
      
      // Refresh print jobs
      fetchPrintJobs();
      
      alert('Print job submitted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to submit print job');
    } finally {
      setUploading(false);
    }
  };

  const getStatusInfo = (status: PrintJob['status']) => {
    switch (status) {
      case 'pending': return { icon: <Clock className="w-4 h-4 text-yellow-500" />, text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      case 'processing': return { icon: <FileText className="w-4 h-4 text-blue-500" />, text: 'Processing', color: 'bg-blue-100 text-blue-800' };
      case 'ready': return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: 'Ready for Pickup', color: 'bg-green-100 text-green-800' };
      case 'completed': return { icon: <CheckCircle className="w-4 h-4 text-gray-500" />, text: 'Completed', color: 'bg-gray-100 text-gray-800' };
      case 'failed': return { icon: <XCircle className="w-4 h-4 text-red-500" />, text: 'Failed', color: 'bg-red-100 text-red-800' };
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mb-8">Upload your documents and collect them from the print shop.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">New Print Job</h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition-colors">
                      <div className="space-y-1 text-center">
                        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-500 focus-within:outline-none">
                            <span>{file ? file.name : 'Select a file'}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOCX, PPTX, PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Print Options:</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={isColor} onChange={e => setIsColor(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <Palette className="w-5 h-5 text-primary" />
                        <span className="text-sm">Color Print (+₹1/page)</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Copy className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">Copies:</label>
                      <input 
                        type="number" 
                        value={copies} 
                        onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))} 
                        min="1" 
                        max="50"
                        className="w-20 p-2 border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary" 
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Estimated Cost: <span className="font-semibold text-primary">₹{(isColor ? 3 : 2) * copies}</span>
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={!file || uploading} 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Send to Print Shop'}
                  </button>
                </form>
              </div>
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Print Jobs</h2>
                
                {printJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No print jobs yet. Upload your first document!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {printJobs.map(job => {
                      const status = getStatusInfo(job.status);
                      return (
                        <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4 mb-2 sm:mb-0">
                              <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-800">{job.file_name}</p>
                                <p className="text-sm text-gray-500">
                                  {job.print_options.color ? 'Color' : 'B&W'} • {job.print_options.copies} copies
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(job.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                              <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                {status.icon} {status.text}
                              </div>
                              <p className="font-semibold text-gray-700">₹{job.cost}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
