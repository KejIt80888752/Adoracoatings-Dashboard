import { Building2, Mail, Phone, Globe, Bell, Lock, Users, Save } from 'lucide-react'

export default function Settings() {
  return (
    <div className="space-y-5 max-w-3xl">

      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-brand-50 rounded-lg"><Building2 size={17} className="text-brand"/></div>
          <div><p className="section-title text-sm">Company Information</p><p className="section-sub">Update your business details</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {l:'Company Name',v:'AdoraCoatings',          icon:Building2},
            {l:'Website',     v:'www.adoracoatings.com',  icon:Globe    },
            {l:'Email',       v:'info@adoracoatings.com', icon:Mail     },
            {l:'Phone',       v:'+91 98401 00000',        icon:Phone    },
          ].map(f=>(
            <div key={f.l}>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{f.l}</label>
              <input defaultValue={f.v} className="input-dark"/>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Address</label>
            <textarea rows={2} defaultValue="No. 12, Industrial Estate, Chennai – 600096, Tamil Nadu, India" className="input-dark resize-none"/>
          </div>
        </div>
        <button className="btn-gold flex items-center gap-1.5 mt-4"><Save size={14}/>Save Changes</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-brand-50 rounded-lg"><Bell size={17} className="text-brand"/></div>
          <div><p className="section-title text-sm">Notifications</p><p className="section-sub">Control what alerts you receive</p></div>
        </div>
        <div className="space-y-3">
          {[
            {l:'New Lead Received',       d:'Get notified when a new lead is added'               },
            {l:'Low Stock Alert',         d:'Alert when product stock falls below threshold'       },
            {l:'Order Status Updates',    d:'Notifications for order stage changes'                },
            {l:'Daily Summary Email',     d:'Receive a daily business summary at 9am'              },
            {l:'WhatsApp Delivery Report',d:'Report of automated WhatsApp message delivery'        },
          ].map(n=>(
            <div key={n.l} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div><p className="text-sm font-medium text-gray-700">{n.l}</p><p className="text-xs text-gray-600 mt-0.5">{n.d}</p></div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer"/>
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-brand rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-brand/30"/>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"/>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg"><Users size={17} className="text-brand"/></div>
            <div><p className="section-title text-sm">Team Members</p><p className="section-sub">Manage access and roles</p></div>
          </div>
          <button className="btn-gold text-xs flex items-center gap-1">+ Invite</button>
        </div>
        <div className="space-y-2">
          {[
            {name:'Admin User',    email:'admin@adoracoatings.com', role:'Admin'  },
            {name:'Sales Manager', email:'sales@adoracoatings.com', role:'Manager'},
            {name:'Stock Lead',    email:'stock@adoracoatings.com', role:'Staff'  },
          ].map(u=>(
            <div key={u.email} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-black text-xs font-bold">{u.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <span className="badge-gold">{u.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-brand-50 rounded-lg"><Lock size={17} className="text-brand"/></div>
          <div><p className="section-title text-sm">Security</p><p className="section-sub">Update your password</p></div>
        </div>
        <div className="space-y-3 max-w-sm">
          {['Current Password','New Password','Confirm New Password'].map(f=>(
            <div key={f}>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{f}</label>
              <input type="password" className="input-dark" placeholder="••••••••"/>
            </div>
          ))}
          <button className="btn-gold flex items-center gap-1.5 mt-2"><Lock size={14}/>Update Password</button>
        </div>
      </div>
    </div>
  )
}
