import {
  Users,
  UserPlus,
  Phone,
  CheckCircle,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Link } from "react-router";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for the chart
const leadGrowthData = [
  { month: "Jan", leads: 45 },
  { month: "Feb", leads: 52 },
  { month: "Mar", leads: 61 },
  { month: "Apr", leads: 58 },
  { month: "May", leads: 72 },
  { month: "Jun", leads: 88 },
  { month: "Jul", leads: 95 },
];

// Mock recent leads data
const recentLeads = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    source: "Website",
    status: "new",
    time: "5 mins ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@company.com",
    source: "Referral",
    status: "contacted",
    time: "1 hour ago",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.d@startup.io",
    source: "LinkedIn",
    status: "new",
    time: "2 hours ago",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.w@tech.com",
    source: "Google Ads",
    status: "contacted",
    time: "3 hours ago",
  },
];

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Leads",
      value: "245",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "indigo",
    },
    {
      title: "New Leads",
      value: "48",
      change: "+8%",
      trend: "up",
      icon: UserPlus,
      color: "blue",
    },
    {
      title: "Contacted",
      value: "132",
      change: "+5%",
      trend: "up",
      icon: Phone,
      color: "orange",
    },
    {
      title: "Converted",
      value: "65",
      change: "-2%",
      trend: "down",
      icon: CheckCircle,
      color: "green",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-orange-100 text-orange-700";
      case "converted":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";
          const bgColors = {
            indigo: "bg-indigo-100",
            blue: "bg-blue-100",
            orange: "bg-orange-100",
            green: "bg-green-100",
          };
          const textColors = {
            indigo: "text-indigo-600",
            blue: "text-blue-600",
            orange: "text-orange-600",
            green: "text-green-600",
          };

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${
                    bgColors[stat.color as keyof typeof bgColors]
                  } rounded-lg flex items-center justify-center`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      textColors[stat.color as keyof typeof textColors]
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Lead Growth
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Monthly lead generation trends
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">+23.5%</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadGrowthData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Lead Sources
          </h3>
          <div className="space-y-4">
            {[
              { source: "Website", count: 98, percentage: 40, color: "indigo" },
              { source: "Referral", count: 61, percentage: 25, color: "blue" },
              {
                source: "LinkedIn",
                count: 49,
                percentage: 20,
                color: "purple",
              },
              {
                source: "Google Ads",
                count: 37,
                percentage: 15,
                color: "green",
              },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.source}
                  </span>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.color === "indigo"
                        ? "bg-indigo-600"
                        : item.color === "blue"
                        ? "bg-blue-600"
                        : item.color === "purple"
                        ? "bg-purple-600"
                        : "bg-green-600"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
          <Link to="/leads" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">
                  Source
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">
                      {lead.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600">{lead.email}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600">{lead.source}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status === "new" ? "New Lead" : "Contacted"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-500">{lead.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}