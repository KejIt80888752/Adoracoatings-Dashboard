import { useState } from 'react'
import { Plus, Search, Mail, MessageCircle, Phone, Send, Clock, CheckCheck, Filter, Download, User } from 'lucide-react'

const LEADS = [
  { id:1, name:'Rajan Constructions',   ph:'+91 98401 23456', email:'rajan@rajanconstruct.in',  src:'Website',   status:'Hot',  via:'WhatsApp', last:'2 hrs ago',   stage:'Negotiation'     },
  { id:2, name:'Sri Builders',          ph:'+91 99401 78901', email:'info@sribuilders.com',      src:'Referral',  status:'Warm', via:'Email',    last:'1 day ago',   stage:'Proposal Sent'   },
  { id:3, name:'Metro Infra Ltd',       ph:'+91 96001 45678', email:'metro@metroinfra.in',       src:'Walk-in',   status:'New',  via:'WhatsApp', last:'5 hrs ago',   stage:'Initial Contact' },
  { id:4, name:'Lakshmi Interiors',     ph:'+91 97890 12345', email:'lkinteriors@gmail.com',     src:'Instagram', status:'Hot',  via:'Email',    last:'3 hrs ago',   stage:'Negotiation'     },
  { id:5, name:'Kumar Real Estate',     ph:'+91 99900 11223', email:'kumar@kumarre.in',           src:'Referral',  status:'Cold', via:'Email',    last:'1 week ago',  stage:'Initial Contact' },
  { id:6, name:'Pooja Spaces',          ph:'+91 96543 21098', email:'pooja@poojasp.com',         src:'Instagram', status:'New',  via:'WhatsApp', last:'6 hrs ago',   stage:'Initial Contact' },
]

const EMAIL_TMPL = [
  { name:'Welcome Email',        subject:'Welcome to AdoraCoatings — We received your query', trigger:'New lead created'    },
  { name:'Product Brochure',     subject:'AdoraCoatings — Exclusive Finish Catalogue 2025',   trigger:'Manual'              },
  { name:'Follow-Up (Day 3)',    subject:'Following up on your AdoraCoatings inquiry',         trigger:'3 days after contact' },
  { name:'Quote Ready',          subject:'Your custom quote is ready — AdoraCoatings',         trigger:'Quote prepared'       },
  { name:'Project Completion',   subject:'Thank you for choosing AdoraCoatings!',              trigger:'Order completed'      },
]

const WA_TMPL = [
  { name:'Welcome',      msg:'Hi {name}! 👋 Thanks for your interest in AdoraCoatings. Our design team will reach out shortly.',            trigger:'New lead created'   },
  { name:'Catalogue',    msg:'Hi {name}, here is our exclusive finish catalogue: {link}. Let us know your requirements! ✨',                trigger:'Manual'             },
  { name:'Follow-Up',   msg:'Hi {name}, following up on your AdoraCoatings inquiry. Any questions? We are happy to help! 😊',              trigger:'Day 3 auto-trigger' },
  { name:'Offer Alert',  msg:'🎉 {name}, get 15% OFF on bulk project orders this month only! Reply YES to know more.',                      trigger:'Monthly campaign'   },
  { name:'Order Confirm',msg:'Your order #{order} is confirmed ✅ Dispatch in 3-5 days. Thank you for choosing AdoraCoatings!',            trigger:'Order placed'       },
]

const sColor: Record<string,string> = { Hot:'badge-red', Warm:'badge-yellow', New:'badge-blue', Cold:'badge-gray' }
const vColor: Record<string,string> = { WhatsApp:'badge-green', Email:'badge-blue' }

export default function Leads() {
  const [tab, setTab]     = useState<'leads'|'email'|'wa'>('leads')
  const [search, setSearch] = useState('')
  const [sf, setSf]       = useState('All')
  const [modal, setModal] = useState(false)
  const [exp, setExp]     = useState<string|null>(null)

  const list = LEADS.filter(l =>
    (sf === 'All' || l.status === sf) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.ph.includes(search))
  )

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Leads',  val: LEADS.length,                                    accent:'border-brand-gold' },
          { label:'Hot Leads',    val: LEADS.filter(l=>l.status==='Hot').length,        accent:'border-red-500'    },
          { label:'Warm Leads',   val: LEADS.filter(l=>l.status==='Warm').length,       accent:'border-yellow-500' },
          { label:'Conversions',  val: 14,                                               accent:'border-green-500'  },
        ].map(c => (
          <div key={c.label} className={`card border-l-4 ${c.accent}`}>
            <p className="text-2xl font-bold text-white">{c.val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card !p-0 overflow-hidden">
        <div className="flex border-b border-brand-border">
          {([
            { id:'leads', label:'All Leads',          icon: User         },
            { id:'email', label:'Email Automation',   icon: Mail         },
            { id:'wa',    label:'WhatsApp Automation',icon: MessageCircle},
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-brand-gold text-brand-gold bg-brand-gold/5'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {/* LEADS */}
        {tab === 'leads' && (
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads..." className="input-dark pl-9 w-60" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={13} className="text-gray-600" />
                {['All','Hot','Warm','New','Cold'].map(s=>(
                  <button key={s} onClick={()=>setSf(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sf===s?'bg-brand-gold text-black':'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{s}</button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button className="btn-outline-gold flex items-center gap-1.5"><Download size={13}/>Export</button>
                <button onClick={()=>setModal(true)} className="btn-gold flex items-center gap-1.5"><Plus size={13}/>Add Lead</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full tbl">
                <thead><tr>{['Name','Phone','Email','Source','Stage','Status','Via','Last Contact','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {list.map(l=>(
                    <tr key={l.id}>
                      <td className="font-medium text-gray-100 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-gold/15 border border-brand-gold/20 text-brand-gold text-xs font-bold flex items-center justify-center shrink-0">{l.name[0]}</div>
                          {l.name}
                        </div>
                      </td>
                      <td className="text-gray-400 text-xs whitespace-nowrap"><div className="flex items-center gap-1"><Phone size={11}/>{l.ph}</div></td>
                      <td className="text-gray-500 text-xs">{l.email}</td>
                      <td className="text-gray-400">{l.src}</td>
                      <td className="text-gray-300 whitespace-nowrap">{l.stage}</td>
                      <td><span className={sColor[l.status]}>{l.status}</span></td>
                      <td><span className={vColor[l.via]}>{l.via}</span></td>
                      <td className="text-gray-600 text-xs whitespace-nowrap"><div className="flex items-center gap-1"><Clock size={11}/>{l.last}</div></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="p-1.5 text-gray-600 hover:text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors" title="Email"><Mail size={13}/></button>
                          <button className="p-1.5 text-gray-600 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="WhatsApp"><MessageCircle size={13}/></button>
                          <button className="p-1.5 text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Call"><Phone size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMAIL */}
        {tab === 'email' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="section-title text-sm">Email Automation Templates</p><p className="section-sub">Auto-triggered emails by lead stage</p></div>
              <button className="btn-gold flex items-center gap-1.5"><Plus size={13}/>New Template</button>
            </div>
            <div className="space-y-3">
              {EMAIL_TMPL.map(t=>(
                <div key={t.name} onClick={()=>setExp(exp===t.name?null:t.name)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${exp===t.name?'border-brand-gold/40 bg-brand-gold/5':'border-brand-border hover:border-brand-gold/20'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><Mail size={14} className="text-brand-gold"/><h4 className="text-sm font-semibold text-white">{t.name}</h4></div>
                      <p className="text-xs text-gray-500">Subject: <span className="text-gray-300">{t.subject}</span></p>
                      <p className="text-xs text-gray-600 mt-1">Trigger: {t.trigger}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="btn-outline-gold text-xs py-1 px-3">Edit</button>
                      <button className="btn-gold text-xs py-1 px-3 flex items-center gap-1"><Send size={11}/>Send</button>
                    </div>
                  </div>
                  {exp===t.name && (
                    <div className="mt-4 pt-4 border-t border-brand-gold/20">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs text-gray-500 mb-1">Trigger</label><select className="input-dark text-xs"><option>New lead created</option><option>Stage changed</option><option>Manual</option><option>Time delay</option></select></div>
                        <div><label className="block text-xs text-gray-500 mb-1">Audience</label><select className="input-dark text-xs"><option>All leads</option><option>Hot leads</option><option>Warm leads</option></select></div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" defaultChecked className="accent-yellow-500"/>Active</label>
                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" className="accent-yellow-500"/>Track opens</label>
                        <button className="ml-auto btn-gold text-xs py-1 px-3 flex items-center gap-1"><CheckCheck size={11}/>Save</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WHATSAPP */}
        {tab==='wa' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="section-title text-sm">WhatsApp Automation</p><p className="section-sub">Business API — automated messages</p></div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-xs text-green-400 border border-green-500/20 bg-green-500/10 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>API Connected
                </div>
                <button className="btn-gold flex items-center gap-1.5"><Plus size={13}/>New Message</button>
              </div>
            </div>
            <div className="space-y-3">
              {WA_TMPL.map(t=>(
                <div key={t.name} className="border border-brand-border hover:border-brand-gold/20 rounded-xl p-4 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-green-400"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                        <span className="badge-green shrink-0">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Trigger: <span className="text-gray-300">{t.trigger}</span></p>
                      <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                        <p className="text-xs text-gray-300 leading-relaxed">{t.msg}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="btn-outline-gold text-xs py-1 px-3">Edit</button>
                      <button className="btn-gold text-xs py-1 px-3 flex items-center gap-1"><Send size={11}/>Send</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card grid grid-cols-3 gap-4 text-center">
              {[{l:'Messages Sent',v:'1,248'},{l:'Delivered',v:'1,201'},{l:'Replied',v:'347'}].map(s=>(
                <div key={s.l}><p className="text-xl font-bold text-brand-gold">{s.v}</p><p className="text-xs text-gray-500">{s.l}</p></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-md p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-5">Add New Lead</h2>
            <div className="space-y-4">
              {['Company / Name','Phone Number','Email','Source'].map(f=>(
                <div key={f}><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{f}</label><input className="input-dark" placeholder={`Enter ${f.toLowerCase()}`}/></div>
              ))}
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Preferred Contact</label>
                <select className="input-dark"><option>WhatsApp</option><option>Email</option><option>Phone Call</option></select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setModal(false)} className="flex-1 btn-outline-gold">Cancel</button>
              <button className="flex-1 btn-gold">Add Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
