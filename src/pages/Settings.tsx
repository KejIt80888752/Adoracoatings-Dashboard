import { useState } from 'react'
import { Building2, Mail, Phone, Globe, Bell, Lock, Users, Save, CheckCheck, ExternalLink } from 'lucide-react'

export default function Settings() {
  const [toast, setToast]   = useState('')
  const [curPw, setCurPw]   = useState('')
  const [newPw, setNewPw]   = useState('')
  const [confPw, setConfPw] = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const handleSave = () => showToast('✓ Company details saved successfully!')
  const handleInvite = () => showToast('✓ Invite link copied — share with new team member')
  const handlePw = () => {
    if (!curPw) return showToast('⚠ Enter your current password')
    if (newPw.length < 6) return showToast('⚠ New password must be at least 6 characters')
    if (newPw !== confPw) return showToast('⚠ Passwords do not match')
    showToast('✓ Password updated successfully!')
    setCurPw(''); setNewPw(''); setConfPw('')
  }

  return (
    <div className="space-y-5 max-w-3xl">

      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCheck size={15}/>{toast}
        </div>
      )}

      {/* Company Info */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-brand-50 rounded-lg"><Building2 size={17} className="text-brand"/></div>
          <div><p className="section-title text-sm">Company Information</p><p className="section-sub">Adora Coatings business details</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {l:'Company Name',  v:'Adora Coatings',             icon:Building2},
            {l:'Website',       v:'www.adoracoatings.com',       icon:Globe    },
            {l:'Email',         v:'info@adoracoatings.com',      icon:Mail     },
            {l:'Phone',         v:'+91 98800 33353',             icon:Phone    },
          ].map(f=>(
            <div key={f.l}>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{f.l}</label>
              <input defaultValue={f.v} className="input-dark"/>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Address</label>
            <textarea rows={2} defaultValue="175/1, Pavilion Rd, Jaya Nagar 1st Block, Bengaluru – 560 011, Karnataka" className="input-dark resize-none"/>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">GST Number</label>
            <input defaultValue="29AHDPA4964B1ZN" className="input-dark font-mono"/>
          </div>
        </div>
        <button onClick={handleSave} className="btn-gold flex items-center gap-1.5 mt-4">
          <Save size={14}/>Save Changes
        </button>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-brand-50 rounded-lg"><Bell size={17} className="text-brand"/></div>
          <div><p className="section-title text-sm">Notifications</p><p className="section-sub">Control what alerts you receive</p></div>
        </div>
        <div className="space-y-3">
          {[
            {l:'New Lead Received',        d:'Get notified when a new lead is added',             def:true  },
            {l:'Low Stock Alert',          d:'Alert when product stock falls below threshold',     def:true  },
            {l:'Order Status Updates',     d:'Notifications for order stage changes',              def:true  },
            {l:'Daily Summary Email',      d:'Receive a daily business summary at 9am',            def:false },
            {l:'WhatsApp Delivery Report', d:'Report of automated WhatsApp message delivery',      def:false },
          ].map(n=>(
            <div key={n.l} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div><p className="text-sm font-medium text-gray-700">{n.l}</p><p className="text-xs text-gray-400 mt-0.5">{n.d}</p></div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" defaultChecked={n.def} className="sr-only peer"/>
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-brand rounded-full transition-colors"/>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"/>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg"><Users size={17} className="text-brand"/></div>
            <div><p className="section-title text-sm">Team Members</p><p className="section-sub">Active team — manage in User Management</p></div>
          </div>
          <button onClick={handleInvite} className="btn-gold text-xs flex items-center gap-1">
            <ExternalLink size={12}/> + Invite
          </button>
        </div>
        <div className="space-y-2">
          {[
            {name:'Ashutosh Mehraa', email:'ashutosh@adoracoatings.com', role:'Super Admin', phone:'98800 33353'},
            {name:'Muniraj Sir',     email:'muniraj@adoracoatings.com',  role:'Supervisor',  phone:'8618729631'},
            {name:'Anil Sir',        email:'anil@adoracoatings.com',     role:'Supervisor',  phone:'9902549969'},
            {name:'Abhishek',        email:'abhishek@adoracoatings.com', role:'Marketing',   phone:'9343454874'},
          ].map(u=>(
            <div key={u.email} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                {u.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email} · {u.phone}</p>
              </div>
              <span className="badge-gold text-[10px]">{u.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-brand-50 rounded-lg"><Lock size={17} className="text-brand"/></div>
          <div><p className="section-title text-sm">Security</p><p className="section-sub">Update your password</p></div>
        </div>
        <div className="space-y-3 max-w-sm">
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Current Password</label>
            <input type="password" className="input-dark" placeholder="••••••••" value={curPw} onChange={e=>setCurPw(e.target.value)}/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
            <input type="password" className="input-dark" placeholder="••••••••" value={newPw} onChange={e=>setNewPw(e.target.value)}/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
            <input type="password" className="input-dark" placeholder="••••••••" value={confPw} onChange={e=>setConfPw(e.target.value)}/></div>
          <button onClick={handlePw} className="btn-gold flex items-center gap-1.5 mt-2">
            <Lock size={14}/>Update Password
          </button>
        </div>
      </div>
    </div>
  )
}
