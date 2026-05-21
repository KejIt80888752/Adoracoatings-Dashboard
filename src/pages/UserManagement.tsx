const USERS = [
  { id:1, name:'Venkat Rajan',  email:'admin@adoracoatings.com',    role:'Super Admin',      status:'Active',   lastLogin:'Today'      },
  { id:2, name:'Priya Sharma',  email:'manager@adoracoatings.com',  role:'Manager',          status:'Active',   lastLogin:'Yesterday'  },
  { id:3, name:'Rajesh Kumar',  email:'sales@adoracoatings.com',    role:'Sales Executive',  status:'Active',   lastLogin:'2 days ago' },
  { id:4, name:'Meena Devi',    email:'accounts@adoracoatings.com', role:'Accounts',         status:'Active',   lastLogin:'Today'      },
  { id:5, name:'Suresh Babu',   email:'viewer@adoracoatings.com',   role:'Viewer',           status:'Inactive', lastLogin:'1 week ago' },
]

function roleBadge(role: string): string {
  if (role === 'Super Admin')     return 'badge-gold'
  if (role === 'Manager')         return 'badge-blue'
  if (role === 'Sales Executive') return 'badge-green'
  if (role === 'Accounts')        return 'badge-yellow'
  return 'badge-gray'
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function UserManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">User Management</h1>
          <p className="section-sub">Manage team access and roles</p>
        </div>
        <button className="btn-gold">+ Add User</button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">5</div>
          <div className="text-xs text-gray-500 mt-1">Total Users</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-green-600">4</div>
          <div className="text-xs text-gray-500 mt-1">Active</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-gray-400">1</div>
          <div className="text-xs text-gray-500 mt-1">Inactive</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-yellow-600">1</div>
          <div className="text-xs text-gray-500 mt-1">Super Admins</div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Team Members</h2>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: '#2a7b7b' }}
                      >
                        {initials(u.name)}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-500 text-sm">{u.email}</td>
                  <td><span className={roleBadge(u.role)}>{u.role}</span></td>
                  <td>
                    <span className={u.status === 'Active' ? 'badge-green' : 'badge-gray'}>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-gray-500 text-sm">{u.lastLogin}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="text-xs text-brand hover:underline font-medium">Edit</button>
                      <button className="text-xs text-gray-400 hover:text-red-500 font-medium">
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-3">Role Permissions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: 'Super Admin', perms: ['Full access', 'User management', 'Reports', 'Settings'], badge: 'badge-gold'   },
            { role: 'Manager',     perms: ['View all data', 'Edit projects', 'Reports', 'Leads'],    badge: 'badge-blue'   },
            { role: 'Sales Exec',  perms: ['Leads', 'Quotations', 'Projects', 'View reports'],       badge: 'badge-green'  },
            { role: 'Viewer',      perms: ['View only', 'Dashboard', 'Reports'],                     badge: 'badge-gray'   },
          ].map(r => (
            <div key={r.role} className="bg-gray-50 rounded-xl p-4">
              <span className={`${r.badge} mb-2 inline-block`}>{r.role}</span>
              <ul className="space-y-1 mt-2">
                {r.perms.map(perm => (
                  <li key={perm} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
