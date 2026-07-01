import { useState } from 'react'
import { Plus, X, CheckCheck, Edit2, UserX, UserCheck, Phone, Mail, Shield } from 'lucide-react'

type User = { id:number; name:string; email:string; role:string; status:string; lastLogin:string; phone:string }

const INITIAL_USERS: User[] = [
  { id:1, name:'Ashutosh Mehraa', email:'ashutosh@adoracoatings.com',   role:'Super Admin', status:'Active', lastLogin:'Today',     phone:'98800 33353' },
  { id:2, name:'Muniraj Sir',     email:'muniraj@adoracoatings.com',    role:'Supervisor',  status:'Active', lastLogin:'Today',     phone:'8618729631'  },
  { id:3, name:'Anil Sir',        email:'anil@adoracoatings.com',       role:'Supervisor',  status:'Active', lastLogin:'Today',     phone:'9902549969'  },
  { id:4, name:'Abhishek',        email:'abhishek@adoracoatings.com',   role:'Marketing',   status:'Active', lastLogin:'Yesterday', phone:'9343454874'  },
]

const ROLES = ['Super Admin', 'Supervisor', 'Marketing', 'Manager', 'Viewer']

function roleBadge(role: string): string {
  if (role === 'Super Admin') return 'badge-gold'
  if (role === 'Supervisor')  return 'badge-blue'
  if (role === 'Marketing')   return 'badge-green'
  if (role === 'Manager')     return 'badge-yellow'
  return 'badge-gray'
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const BLANK: Omit<User,'id'|'status'|'lastLogin'> = { name:'', email:'', role:'Marketing', phone:'' }

export default function UserManagement() {
  const [users, setUsers]     = useState<User[]>(INITIAL_USERS)
  const [modal, setModal]     = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [form, setForm]       = useState(BLANK)
  const [toast, setToast]     = useState('')

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),3000) }

  const openAdd = () => { setEditUser(null); setForm(BLANK); setModal(true) }
  const openEdit = (u: User) => { setEditUser(u); setForm({name:u.name,email:u.email,role:u.role,phone:u.phone}); setModal(true) }

  const handleSave = () => {
    if (!form.name || !form.email) return
    if (editUser) {
      setUsers(us => us.map(u => u.id === editUser.id ? {...u, ...form} : u))
      showToast(`✓ ${form.name} updated successfully`)
    } else {
      const newUser: User = { id: Date.now(), ...form, status:'Active', lastLogin:'Just now' }
      setUsers(us => [...us, newUser])
      showToast(`✓ ${form.name} added to team`)
    }
    setModal(false)
  }

  const toggleStatus = (id: number, name: string, current: string) => {
    const next = current === 'Active' ? 'Inactive' : 'Active'
    setUsers(us => us.map(u => u.id === id ? {...u, status: next} : u))
    showToast(`${name} marked as ${next}`)
  }

  const activeCount   = users.filter(u => u.status === 'Active').length
  const inactiveCount = users.filter(u => u.status === 'Inactive').length
  const admins        = users.filter(u => u.role === 'Super Admin').length

  return (
    <div className="p-6 space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCheck size={15}/>{toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">User Management</h1>
          <p className="section-sub">Manage team access and roles</p>
        </div>
        <button onClick={openAdd} className="btn-gold flex items-center gap-1.5">
          <Plus size={14}/> Add User
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-sm text-center"><div className="text-2xl font-bold text-brand">{users.length}</div><div className="text-xs text-gray-500 mt-1">Total Users</div></div>
        <div className="card-sm text-center"><div className="text-2xl font-bold text-green-600">{activeCount}</div><div className="text-xs text-gray-500 mt-1">Active</div></div>
        <div className="card-sm text-center"><div className="text-2xl font-bold text-gray-400">{inactiveCount}</div><div className="text-xs text-gray-500 mt-1">Inactive</div></div>
        <div className="card-sm text-center"><div className="text-2xl font-bold text-yellow-600">{admins}</div><div className="text-xs text-gray-500 mt-1">Super Admins</div></div>
      </div>

      {/* Table */}
      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Team Members</h2>
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead>
              <tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{backgroundColor:'#4a7c1f'}}>
                        {initials(u.name)}
                      </div>
                      <span className="font-medium text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-500 text-xs">{u.email}</td>
                  <td className="text-gray-500 text-xs font-mono">{u.phone}</td>
                  <td><span className={roleBadge(u.role)}>{u.role}</span></td>
                  <td><span className={u.status === 'Active' ? 'badge-green' : 'badge-gray'}>{u.status}</span></td>
                  <td className="text-gray-500 text-xs">{u.lastLogin}</td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(u)} title="Edit"
                        className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand-50 rounded-lg transition-colors">
                        <Edit2 size={13}/>
                      </button>
                      <button onClick={() => toggleStatus(u.id, u.name, u.status)}
                        title={u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        className={`p-1.5 rounded-lg transition-colors ${u.status === 'Active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-green-500 hover:bg-green-50'}`}>
                        {u.status === 'Active' ? <UserX size={13}/> : <UserCheck size={13}/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions */}
      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-3">Role Permissions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role:'Super Admin', perms:['Full access','User management','Reports','Settings'],  badge:'badge-gold'  },
            { role:'Supervisor',  perms:['View projects','Update site status','Stock view'],      badge:'badge-blue'  },
            { role:'Marketing',   perms:['Leads','Quotations','Add leads','Contact clients'],     badge:'badge-green' },
            { role:'Viewer',      perms:['View only','Dashboard','Reports'],                      badge:'badge-gray'  },
          ].map(r => (
            <div key={r.role} className="bg-gray-50 rounded-xl p-4">
              <span className={`${r.badge} mb-2 inline-block`}>{r.role}</span>
              <ul className="space-y-1 mt-2">
                {r.perms.map(p => (
                  <li key={p} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0"/>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-brand"/>
                <h2 className="font-semibold text-gray-800">{editUser ? 'Edit Team Member' : 'Add New User'}</h2>
              </div>
              <button onClick={() => setModal(false)}><X size={18} className="text-gray-400"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Full Name *</label>
                <input className="input-dark" placeholder="e.g. Muniraj Sir"
                  value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}/>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input className="input-dark pl-9" placeholder="name@adoracoatings.com"
                    value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Phone</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input className="input-dark pl-9" placeholder="9XXXXXXXXX"
                      value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Role *</label>
                  <select className="input-dark" value={form.role} onChange={e => setForm(f=>({...f,role:e.target.value}))}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 btn-outline-gold text-sm">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.email}
                className="flex-1 btn-gold text-sm disabled:opacity-50">
                {editUser ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
