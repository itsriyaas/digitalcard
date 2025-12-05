import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiPackage, FiShoppingCart, FiDollarSign, FiUsers, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

const DashboardHome = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [stats, setStats] = useState({
    totalCatalogues: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalVisitors: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user's catalogues
        const token = user?.token || localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalogue`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const catalogues = response.data.data;

        // Calculate stats from catalogues
        const totalCatalogues = catalogues.length;
        let totalOrders = 0;
        let totalRevenue = 0;
        let totalVisitors = 0;

        catalogues.forEach(cat => {
          totalOrders += cat.analytics?.totalOrders || 0;
          totalRevenue += cat.analytics?.totalRevenue || 0;
          totalVisitors += cat.analytics?.visitors || 0;
        });

        const conversionRate = totalVisitors > 0
          ? ((totalOrders / totalVisitors) * 100).toFixed(2)
          : 0;

        setStats({
          totalCatalogues,
          totalProducts: 0, // Will fetch separately if needed
          totalOrders,
          totalRevenue,
          totalVisitors,
          conversionRate
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          {isAdmin
            ? "Here's your complete business overview"
            : "Manage your catalogues and track your sales"}
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4 text-sm sm:text-base">Loading statistics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              icon={FiShoppingBag}
              title="Total Catalogues"
              value={stats.totalCatalogues}
              color="bg-blue-500"
              onClick={() => navigate('/admin/catalogues')}
            />
            <StatCard
              icon={FiShoppingCart}
              title="Total Orders"
              value={stats.totalOrders}
              color="bg-green-500"
              onClick={isAdmin ? () => navigate('/admin/orders') : null}
            />
            <StatCard
              icon={FiDollarSign}
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              color="bg-purple-500"
            />
            <StatCard
              icon={FiUsers}
              title="Total Visitors"
              value={stats.totalVisitors.toLocaleString()}
              color="bg-orange-500"
            />
            <StatCard
              icon={FiTrendingUp}
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              color="bg-pink-500"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/admin/catalogues')}
                className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <FiShoppingBag className="text-blue-600 mb-2" size={24} />
                <h3 className="font-semibold text-gray-900">
                  {isAdmin ? 'Manage Catalogues' : 'View My Catalogues'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.totalCatalogues === 0 ? 'Create your first catalogue' : `View all ${stats.totalCatalogues} catalogues`}
                </p>
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => navigate('/admin/orders')}
                    className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                  >
                    <FiShoppingCart className="text-green-600 mb-2" size={24} />
                    <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.totalOrders === 0 ? 'No orders yet' : `View all ${stats.totalOrders} orders`}
                    </p>
                  </button>

                  <button
                    onClick={() => navigate('/admin/analytics')}
                    className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                  >
                    <FiTrendingUp className="text-purple-600 mb-2" size={24} />
                    <h3 className="font-semibold text-gray-900">View Analytics</h3>
                    <p className="text-sm text-gray-600 mt-1">Detailed insights and reports</p>
                  </button>
                </>
              )}

              {!isAdmin && (
                <button
                  onClick={() => navigate('/cards')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors text-left"
                >
                  <FiPackage className="text-gray-600 mb-2" size={24} />
                  <h3 className="font-semibold text-gray-900">Digital Cards</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your digital business cards</p>
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity or Tips */}
          {stats.totalCatalogues === 0 && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">🚀 Get Started</h3>
              <p className="text-sm sm:text-base text-blue-800 mb-4">
                You haven't created any catalogues yet. Create your first catalogue to start selling online!
              </p>
              <button
                onClick={() => navigate('/admin/catalogues/new')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Create Your First Catalogue
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardHome;
