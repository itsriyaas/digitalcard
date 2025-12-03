import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCatalogues, deleteCatalogue } from '../../features/catalogue/catalogueSlice';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const CatalogueList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { catalogues, loading } = useSelector((state) => state.catalogue);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchUserCatalogues());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this catalogue?')) {
      await dispatch(deleteCatalogue(id));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isAdmin ? 'All Catalogues' : 'My Catalogues'}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {isAdmin ? 'View and manage all catalogues' : 'Manage your e-catalogues'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/catalogues/new')}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <FiPlus />
          Create Catalogue
        </button>
      </div>

      {catalogues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">You haven't created any catalogues yet.</p>
          <button
            onClick={() => navigate('/admin/catalogues/new')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Create Your First Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {catalogues.map((catalogue) => (
            <div key={catalogue._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {catalogue.banner ? (
                  <img src={catalogue.banner} alt={catalogue.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <h2 className="text-2xl font-bold">{catalogue.title}</h2>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {catalogue.isPublished ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <FiEye size={12} /> Published
                    </span>
                  ) : (
                    <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <FiEyeOff size={12} /> Draft
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-base sm:text-lg mb-2 truncate">{catalogue.title}</h3>
                {catalogue.description && (
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{catalogue.description}</p>
                )}

                {/* Show owner info for admin */}
                {isAdmin && catalogue.user && (
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Owner:</p>
                    <p className="text-sm font-medium text-gray-700">{catalogue.user.name}</p>
                    <p className="text-xs text-gray-500">{catalogue.user.email}</p>
                    {catalogue.user.role === 'customer' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        Customer
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-gray-50 rounded p-1.5 sm:p-2">
                    <p className="text-xs text-gray-500">Visitors</p>
                    <p className="font-bold text-sm sm:text-base text-blue-600">{catalogue.analytics?.visitors || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-1.5 sm:p-2">
                    <p className="text-xs text-gray-500">Orders</p>
                    <p className="font-bold text-sm sm:text-base text-green-600">{catalogue.analytics?.totalOrders || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-1.5 sm:p-2">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="font-bold text-sm sm:text-base text-purple-600">₹{catalogue.analytics?.totalRevenue || 0}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => navigate(`/admin/catalogues/${catalogue._id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FiEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/catalogue/${catalogue.slug}`)}
                    className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(catalogue._id)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogueList;
