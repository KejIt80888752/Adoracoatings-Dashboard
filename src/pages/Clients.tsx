import { useState } from 'react'
import { Building2, Home, Phone, Mail, MapPin, TrendingUp, CheckCircle2, Clock } from 'lucide-react'

const B2B_CLIENTS: { id: number; firm: string; type: string; contact: string; email: string; location: string; status: string; stage: string; projects: number }[] = []

const B2C_CLIENTS: { id: number; name: string; type: string; location: string; area: string; finish: string; status: string; paid: string }[] = []

const sColor: Record<string, string> = {
  Hot: 'badge-red', Warm: 'badge-yellow', New: 'badge-blue',
  Converted: 'badge-green', 'In Progress': 'badge-gold',
}

const typeColors: Record<string, string> = {
  'Architecture Firm':     'bg-blue-50 text-blue-700 border-blue-200',
  'Interior Designers':    'bg-purple-50 text-purple-700 border-purple-200',
  'Contractor':            'bg-orange-50 text-orange-700 border-orange-200',
  'Commercial Client':     'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Builder / Developer':   'bg-brand-50 text-brand-dark border-brand-200',
  'Residential Apartment': 'bg-sky-50 text-sky-700 border-sky-200',
  'Residential Villa':     'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Residential':           'bg-sky-50 text-sky-700 border-sky-200',
  'Educational Space':     'bg-brand-50 text-brand-dark border-brand-200',
  'Healthcare':            'bg-red-50 text-red-600 border-red-200',
  'Commercial Space':      'bg-amber-50 text-amber-700 border-amber-200',
  'Restaurant / Hospitality': 'bg-pink-50 text-pink-700 border-pink-200',
}

export default function Clients() {
  const [tab, setTab] = useState<'b2b' | 'b2c' | 'process'>('b2b')
  const [b2bFilter, setB2bFilter] = useState('All')
  const [b2cFilter, setB2cFilter] = useState('All')

  const b2bList = b2bFilter === 'All' ? B2B_CLIENTS : B2B_CLIENTS.filter(c => c.status === b2bFilter)
  const b2cList = b2cFilter === 'All' ? B2C_CLIENTS : B2C_CLIENTS.filter(c => c.status === b2cFilter)

  const b2bConverted = B2B_CLIENTS.filter(c => c.status === 'Converted').length
  const b2bHot       = B2B_CLIENTS.filter(c => c.status === 'Hot').length
  const b2cConverted = B2C_CLIENTS.filter(c => c.status === 'Converted').length

  const PROCESS = [
    { sl:1,  step:'Marketing Follow-Up',                 phase:'Pre-Sales'  },
    { sl:2,  step:'Contact Client — Fix an Appointment', phase:'Pre-Sales'  },
    { sl:3,  step:'Meeting: Introduce Company & Catalogue for Collaboration', phase:'Pre-Sales' },
    { sl:4,  step:'Meeting at Our Office',               phase:'Pre-Sales'  },
    { sl:5,  step:'Understand Client Requirement & Suggest Material', phase:'Pre-Sales' },
    { sl:6,  step:'Initial Follow-Up',                   phase:'Pre-Sales'  },
    { sl:7,  step:'Site Visit',                          phase:'Pre-Sales'  },
    { sl:8,  step:'Take Measurements & Collect Project Details', phase:'Estimation' },
    { sl:9,  step:'Create Measurement Sheet',            phase:'Estimation' },
    { sl:10, step:'Create Sample & Challan (if required)',phase:'Estimation' },
    { sl:11, step:'Project Confirmed',                   phase:'Estimation' },
    { sl:12, step:'Create Quotation per Measurement',    phase:'Estimation' },
    { sl:13, step:'Share Quotation with Client',         phase:'Estimation' },
    { sl:14, step:'Update Quotation (Price / Area) per Client Request', phase:'Estimation' },
    { sl:15, step:'Client Confirmation to Start Work',   phase:'Execution'  },
    { sl:16, step:'Finalise Material, Colour & Price',   phase:'Execution'  },
    { sl:17, step:'Advance Payment Received',            phase:'Execution'  },
    { sl:18, step:'Prepare Material, Tools, Labour & Supervisor', phase:'Execution' },
    { sl:19, step:'Delivery Challan',                    phase:'Execution'  },
    { sl:20, step:'Work Starts at Site',                 phase:'Execution'  },
    { sl:21, step:'Work Continues as per Area',          phase:'Execution'  },
    { sl:22, step:'Supervisor Monitors Work Progress',   phase:'Execution'  },
    { sl:23, step:'Work Completed',                      phase:'Completion' },
    { sl:24, step:'Site Clean-Up',                       phase:'Completion' },
    { sl:25, step:'Site Inspection with Client, Site In-charge & Supervisor', phase:'Completion' },
    { sl:26, step:'Touch-Up Done',                       phase:'Completion' },
    { sl:27, step:'Final Measurement of Work Area',      phase:'Completion' },
    { sl:28, step:'Prepare Invoice',                     phase:'Billing'    },
    { sl:29, step:'Share Invoice with Client',           phase:'Billing'    },
    { sl:30, step:'Receive Payment per Payment Terms',   phase:'Billing'    },
    { sl:31, step:'Photoshoot of Site (Post Work)',       phase:'Billing'    },
    { sl:32, step:'Final Touch-Up if Required',          phase:'After-Sales'},
    { sl:33, step:'Stay in Touch for Future Projects',   phase:'After-Sales'},
  ]

  const phaseColor: Record<string, string> = {
    'Pre-Sales':  'bg-blue-100 text-blue-700',
    'Estimation': 'bg-yellow-100 text-yellow-700',
    'Execution':  'bg-orange-100 text-orange-700',
    'Completion': 'bg-brand-100 text-brand-dark',
    'Billing':    'bg-purple-100 text-purple-700',
    'After-Sales':'bg-green-100 text-green-700',
  }

  return (
    <div className="space-y-5">

      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-blue-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{B2B_CLIENTS.length}</p>
              <p className="text-xs text-gray-500">B2B Clients</p>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-brand">
          <div className="flex items-center gap-3">
            <Home size={20} className="text-brand shrink-0" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{B2C_CLIENTS.length}</p>
              <p className="text-xs text-gray-500">B2C Clients</p>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{b2bConverted + b2cConverted}</p>
              <p className="text-xs text-gray-500">Converted</p>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-red-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{b2bHot}</p>
              <p className="text-xs text-gray-500">Hot Prospects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card !p-0 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {([
            { id: 'b2b',     label: 'B2B Clients',    icon: Building2, desc: 'Architects, Designers & Contractors' },
            { id: 'b2c',     label: 'B2C Clients',    icon: Home,      desc: 'Direct & Residential Clients'        },
            { id: 'process', label: 'Process Flow',   icon: Clock,     desc: '33-Step Project Pipeline'            },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id ? 'border-brand text-brand bg-brand-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {/* B2B */}
        {tab === 'b2b' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building2 size={14} className="text-brand" />
                <span className="font-medium text-gray-700">Architects, Interior Designers & Contractors</span>
              </div>
              <div className="ml-auto flex gap-2 flex-wrap">
                {['All','Hot','Warm','New','Converted'].map(f => (
                  <button key={f} onClick={() => setB2bFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${b2bFilter===f?'bg-brand text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {b2bList.length === 0 && <p className="text-sm text-gray-400 text-center py-6 col-span-full">No B2B clients yet</p>}
              {b2bList.map(c => (
                <div key={c.id} className="border border-gray-100 rounded-xl p-4 hover:border-brand/30 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand font-bold text-sm shrink-0">
                      {c.firm[0]}
                    </div>
                    <span className={`badge ${sColor[c.status] ?? 'badge-gray'}`}>{c.status}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm mb-0.5 leading-tight">{c.firm}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border inline-block mb-3 ${typeColors[c.type] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {c.type}
                  </span>
                  <div className="space-y-1.5">
                    {c.contact && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone size={11} className="text-gray-400" />{c.contact}
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                        <Mail size={11} className="text-gray-400" />{c.email}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={11} className="text-gray-400" />{c.location}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{c.stage}</span>
                    {c.projects > 0 && (
                      <span className="text-xs font-medium text-brand">{c.projects} project{c.projects>1?'s':''}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* B2C */}
        {tab === 'b2c' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Home size={14} className="text-brand" />
                <span className="font-medium text-gray-700">Residential, Commercial & Hospitality Clients</span>
              </div>
              <div className="ml-auto flex gap-2">
                {['All','Converted','In Progress'].map(f => (
                  <button key={f} onClick={() => setB2cFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${b2cFilter===f?'bg-brand text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full tbl">
                <thead>
                  <tr>
                    <th>#</th><th>Client / Project</th><th>Type</th><th>Location</th>
                    <th>Area</th><th>Finish Applied</th><th>Amount Paid</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {b2cList.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-10 text-gray-400">No B2C clients yet</td></tr>
                  )}
                  {b2cList.map(c => (
                    <tr key={c.id}>
                      <td className="text-gray-400 text-center">{c.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200 text-brand text-xs font-bold flex items-center justify-center shrink-0">{c.name[0]}</div>
                          <span className="font-medium text-gray-800">{c.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${typeColors[c.type] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>{c.type}</span>
                      </td>
                      <td className="text-gray-500 text-xs">{c.location}</td>
                      <td className="text-gray-600 font-medium text-xs whitespace-nowrap">{c.area}</td>
                      <td className="text-gray-600 text-xs">{c.finish}</td>
                      <td className="font-semibold text-brand text-sm whitespace-nowrap">{c.paid}</td>
                      <td><span className={`badge ${sColor[c.status] ?? 'badge-gray'}`}>{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* B2C Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:'Total B2C Clients',  val: B2C_CLIENTS.length },
                { label:'Converted',           val: b2cConverted },
                { label:'In Progress',         val: B2C_CLIENTS.filter(c=>c.status==='In Progress').length },
                { label:'Total Revenue',       val: '₹0' },
              ].map(s => (
                <div key={s.label} className="card text-center">
                  <p className="text-xl font-bold text-brand">{s.val}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROCESS FLOW */}
        {tab === 'process' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={15} className="text-brand" />
              <p className="font-semibold text-gray-700">33-Step End-to-End Project Process</p>
              <span className="ml-auto badge-gold">Standard Operating Procedure</span>
            </div>

            {/* Phase legend */}
            <div className="flex flex-wrap gap-2">
              {['Pre-Sales','Estimation','Execution','Completion','Billing','After-Sales'].map(p => (
                <span key={p} className={`text-xs px-2.5 py-1 rounded-full font-medium ${phaseColor[p]}`}>{p}</span>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full tbl">
                <thead><tr><th>Step</th><th>Action</th><th>Phase</th></tr></thead>
                <tbody>
                  {PROCESS.map(p => (
                    <tr key={p.sl}>
                      <td className="text-center font-bold text-brand">{String(p.sl).padStart(2,'0')}</td>
                      <td className="font-medium text-gray-700">{p.step}</td>
                      <td>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${phaseColor[p.phase]}`}>{p.phase}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
