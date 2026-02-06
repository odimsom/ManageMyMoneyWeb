import React from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                 <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span className="ml-2 text-xl font-bold text-gray-900">ManageMyMoney</span>
              </div>
            </div>
            <div className="flex items-center">
                <span className="text-gray-700 mr-4">Hello, {user?.firstName}</span>
                <button
                    onClick={handleLogout}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Sign out
                </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
               <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Account Overview</h3>
                         <div className="mt-2 text-sm text-gray-500">
                            <p>Here you will see your financial summary.</p>
                        </div>
                        
                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                             {/* Placeholder Card 1 */}
                            <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                     <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Balance
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        $0.00
                                    </dd>
                                </div>
                            </div>
                            
                             {/* Placeholder Card 2 */}
                             <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                     <dt className="text-sm font-medium text-gray-500 truncate">
                                        Income (This Month)
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        $0.00
                                    </dd>
                                </div>
                            </div>

                             {/* Placeholder Card 3 */}
                            <div className="bg-red-50 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                     <dt className="text-sm font-medium text-gray-500 truncate">
                                        Expenses (This Month)
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        $0.00
                                    </dd>
                                </div>
                            </div>
                        </div>


                         <div className="mt-8">
                            <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                            Add Transaction
                            </button>
                        </div>
                    </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
