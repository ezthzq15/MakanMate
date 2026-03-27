import React from 'react';
import AdminLayout from '../../container/AdminLayout';
import AdminDashboard from '../../components/admin/adminDashboard';

const AdminPage = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminPage;
