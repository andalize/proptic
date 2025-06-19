"use client";
import {
    Download,
    Calendar, TrendingUp,
    TrendingDown, Users,
    Phone, Clock,
    CheckCircle
} from 'lucide-react';
import {
    LineChart,
    Line, XAxis, YAxis,
    CartesianGrid,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart, Bar
} from 'recharts';

const monthlyData = [
  { month: 'Jan', calls: 320, appointments: 280 },
  { month: 'Feb', calls: 450, appointments: 380 },
  { month: 'Mar', calls: 380, appointments: 320 },
  { month: 'Apr', calls: 520, appointments: 450 },
  { month: 'May', calls: 480, appointments: 420 },
  { month: 'Jun', calls: 620, appointments: 580 }
];

const subscriptionData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 65 },
  { month: 'May', value: 58 },
  { month: 'Jun', value: 72 },
  { month: 'Jul', value: 68 },
  { month: 'Aug', value: 75 },
  { month: 'Sep', value: 82 },
  { month: 'Oct', value: 78 },
  { month: 'Nov', value: 88 },
  { month: 'Dec', value: 95 }
];

const revenueData = [
  { month: 'Jan', value: 12000 },
  { month: 'Feb', value: 13500 },
  { month: 'Mar', value: 12800 },
  { month: 'Apr', value: 14200 },
  { month: 'May', value: 13900 },
  { month: 'Jun', value: 15231 }
];

export default function ReceptionistDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        {/* <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Download size={16} />
            Download
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={16} />
            Pick a date
          </button>
        </div> */}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 mb-8 border-b border-gray-200">
        <button className="pb-3 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
          Overview
        </button>
        <button className="pb-3 px-1 text-gray-500 hover:text-gray-700">
          Analytics
        </button>
        <button className="pb-3 px-1 text-gray-500 hover:text-gray-700">
          Reports
        </button>
        <button className="pb-3 px-1 text-gray-500 hover:text-gray-700">
          Notifications
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* New Appointments */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-600" />
              <span className="text-sm text-gray-600">New Appointments</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
              </svg>
            </button>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">500</div>
          <div className="text-sm text-gray-500 mb-3">Since Last week</div>
          <div className="flex items-center justify-between">
            <button className="text-sm text-gray-600 hover:text-gray-800">Details</button>
            <div className="flex items-center gap-1 text-green-600">
              <span className="text-sm font-medium">15.54%</span>
              <TrendingUp size={12} />
            </div>
          </div>
        </div>

        {/* Phone Calls */}
        {/* <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-600" />
              <span className="text-sm text-gray-600">Phone Calls</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
              </svg>
            </button>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">1,226</div>
          <div className="text-sm text-gray-500 mb-3">Since Last week</div>
          <div className="flex items-center justify-between">
            <button className="text-sm text-gray-600 hover:text-gray-800">Details</button>
            <div className="flex items-center gap-1 text-red-600">
              <span className="text-sm font-medium">40.2%</span>
              <TrendingDown size={12} />
            </div>
          </div>
        </div> */}

        {/* Avg Response Time */}
        {/* <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-600" />
              <span className="text-sm text-gray-600">Avg Response Time</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
              </svg>
            </button>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">1,080</div>
          <div className="text-sm text-gray-500 mb-3">Since Last week</div>
          <div className="flex items-center justify-between">
            <button className="text-sm text-gray-600 hover:text-gray-800">Details</button>
            <div className="flex items-center gap-1 text-green-600">
              <span className="text-sm font-medium">10.8%</span>
              <TrendingUp size={12} />
            </div>
          </div>
        </div> */}

        {/* Total Revenue */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <span className="text-sm text-gray-600">Total Revenue</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">$15,231.89</div>
          <div className="text-sm text-green-600 mb-4">+20.1% from last month</div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tenancy - Monthly</h3>
            <p className="text-sm text-gray-600">Showing total calls for the last 6 months</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis hide />
                {/* <Area 
                  type="monotone" 
                  dataKey="calls" 
                  stackId="1"
                  stroke="#fca5a5" 
                  fill="rgba(252, 165, 165, 0.3)"
                /> */}
                <Area 
                  type="monotone" 
                  dataKey="appointments" 
                  stackId="1"
                  stroke="#86efac" 
                  fill="rgba(134, 239, 172, 0.3)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointments</h3>
            <div className="text-2xl font-bold text-green-600 mb-1">+100</div>
            <div className="text-sm text-green-600">+10% from last month</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subscriptionData}>
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[2, 2, 0, 0]}
                />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}