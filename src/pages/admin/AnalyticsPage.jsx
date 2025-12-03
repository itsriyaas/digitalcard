import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiShoppingBag, FiPackage, FiDollarSign, FiUsers, FiTrendingUp, FiShoppingCart } from 'react-icons/fi';
import axios from 'axios';

const AnalyticsPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalCatalogues: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalVisitors: 0,
    conversionRate: 0
  });

  const [catalogueStats, setCatalogueStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = user?.token || localStorage.getItem('token');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch catalogues
      const catalogueRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalogue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const catalogues = catalogueRes.data.data || [];

      // Fetch products
      const productRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle products response structure
      const products = productRes.data.data || productRes.data || [];
      console.log('Products response:', productRes.data);
      console.log('Total products:', products.length);

      // Calculate stats
      let totalOrders = 0;
      let totalRevenue = 0;
      let totalVisitors = 0;

      const catalogueStatsData = catalogues.map(cat => {
        const catOrders = cat.analytics?.totalOrders || 0;
        const catRevenue = cat.analytics?.totalRevenue || 0;
        const catVisitors = cat.analytics?.visitors || 0;

        totalOrders += catOrders;
        totalRevenue += catRevenue;
        totalVisitors += catVisitors;

        return {
          id: cat._id,
          title: cat.title,
          visitors: catVisitors,
          orders: catOrders,
          revenue: catRevenue,
          conversionRate: catVisitors > 0 ? ((catOrders / catVisitors) * 100).toFixed(2) : 0
        };
      });

      const conversionRate = totalVisitors > 0
        ? ((totalOrders / totalVisitors) * 100).toFixed(2)
        : 0;

      setStats({
        totalCatalogues: catalogues.length,
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalOrders,
        totalRevenue,
        totalVisitors,
        conversionRate
      });

      setCatalogueStats(catalogueStatsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Comprehensive overview of your business performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatCard
          icon={FiShoppingBag}
          title="Total Catalogues"
          value={stats.totalCatalogues}
          color="bg-blue-500"
        />
        <StatCard
          icon={FiPackage}
          title="Total Products"
          value={stats.totalProducts}
          color="bg-indigo-500"
        />
        <StatCard
          icon={FiShoppingCart}
          title="Total Orders"
          value={stats.totalOrders}
          color="bg-green-500"
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
          subtitle="Orders / Visitors"
        />
      </div>

      {/* Catalogue Performance */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Catalogue Performance</h2>

        {catalogueStats.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No catalogues created yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catalogue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitors
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {catalogueStats.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cat.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cat.visitors.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cat.orders.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{cat.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        parseFloat(cat.conversionRate) >= 5 ? 'bg-green-100 text-green-800' :
                        parseFloat(cat.conversionRate) >= 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cat.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Catalogue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Top Performing Catalogue</h3>
          {catalogueStats.length > 0 ? (
            <>
              {(() => {
                const topCatalogue = catalogueStats.reduce((prev, current) =>
                  current.revenue > prev.revenue ? current : prev
                );
                return (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{topCatalogue.title}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <div className="font-bold text-purple-600">₹{topCatalogue.revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Orders:</span>
                        <div className="font-bold text-blue-600">{topCatalogue.orders}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Visitors:</span>
                        <div className="font-bold text-green-600">{topCatalogue.visitors}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversion:</span>
                        <div className="font-bold text-orange-600">{topCatalogue.conversionRate}%</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">No data available</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Quick Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Average Order Value</span>
              <span className="font-bold text-gray-900">
                ₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Products per Catalogue</span>
              <span className="font-bold text-gray-900">
                {stats.totalCatalogues > 0 ? Math.round(stats.totalProducts / stats.totalCatalogues) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Orders per Catalogue</span>
              <span className="font-bold text-gray-900">
                {stats.totalCatalogues > 0 ? Math.round(stats.totalOrders / stats.totalCatalogues) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Revenue per Catalogue</span>
              <span className="font-bold text-gray-900">
                ₹{stats.totalCatalogues > 0 ? (stats.totalRevenue / stats.totalCatalogues).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
