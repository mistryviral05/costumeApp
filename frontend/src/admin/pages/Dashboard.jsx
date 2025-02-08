import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Screen Options ▼</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Help ▼</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* At a Glance Box */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold">At a Glance</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Content Type</th>
                <th className="text-right py-2">Count</th>
                <th className="text-right py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Posts</td>
                <td className="text-right">108</td>
                <td className="text-right text-green-500">Active</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Pages</td>
                <td className="text-right">46</td>
                <td className="text-right text-green-500">Active</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Comments</td>
                <td className="text-right">34</td>
                <td className="text-right text-yellow-500">Pending</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2">Spam Comments</td>
                <td className="text-right">12,969</td>
                <td className="text-right text-red-500">Blocked</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Draft Box */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold">Recent Drafts</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Title</th>
                <th className="text-right py-2">Last Modified</th>
                <th className="text-right py-2">Author</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">New Feature Announcement</td>
                <td className="text-right">2 mins ago</td>
                <td className="text-right">John</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Monthly Newsletter</td>
                <td className="text-right">1 hour ago</td>
                <td className="text-right">Sarah</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Product Update</td>
                <td className="text-right">3 hours ago</td>
                <td className="text-right">Mike</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2">Year in Review</td>
                <td className="text-right">1 day ago</td>
                <td className="text-right">Lisa</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Activity Box */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Action</th>
                <th className="text-right py-2">Time</th>
                <th className="text-right py-2">User</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Post Published</td>
                <td className="text-right">Just now</td>
                <td className="text-right">Admin</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Comment Approved</td>
                <td className="text-right">5 mins ago</td>
                <td className="text-right">Mod</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Page Updated</td>
                <td className="text-right">1 hour ago</td>
                <td className="text-right">Editor</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2">Plugin Updated</td>
                <td className="text-right">2 hours ago</td>
                <td className="text-right">System</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* WordPress Events Box */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Event</th>
                <th className="text-right py-2">Date</th>
                <th className="text-right py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">WordCamp Europe</td>
                <td className="text-right">Jun 14</td>
                <td className="text-right">Belgrade</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">WordCamp Grand Rapids</td>
                <td className="text-right">Jun 30</td>
                <td className="text-right">MI, USA</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">WordCamp Chicago</td>
                <td className="text-right">Aug 8</td>
                <td className="text-right">IL, USA</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2">WordPress Meetup</td>
                <td className="text-right">Aug 15</td>
                <td className="text-right">Online</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;