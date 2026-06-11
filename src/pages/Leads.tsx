import { useState } from 'react'
import { Plus, Search, Mail, MessageCircle, Phone, Send, Clock, CheckCheck, Filter, Download, User, Instagram, Link, TrendingUp } from 'lucide-react'

const LEADS = [
  { id:1,  name:'Rajan Constructions',   ph:'+91 98401 23456', email:'rajan@rajanconstruct.in',    src:'Website',   status:'Hot',  via:'WhatsApp', last:'2 hrs ago',   stage:'Negotiation'     },
  { id:2,  name:'Sri Builders',          ph:'+91 99401 78901', email:'info@sribuilders.com',        src:'Referral',  status:'Warm', via:'Email',    last:'1 day ago',   stage:'Proposal Sent'   },
  { id:3,  name:'Metro Infra Ltd',       ph:'+91 96001 45678', email:'metro@metroinfra.in',         src:'Walk-in',   status:'New',  via:'WhatsApp', last:'5 hrs ago',   stage:'Initial Contact' },
  { id:4,  name:'Lakshmi Interiors',     ph:'+91 97890 12345', email:'lkinteriors@gmail.com',       src:'Instagram', status:'Hot',  via:'Email',    last:'3 hrs ago',   stage:'Negotiation'     },
  { id:5,  name:'Kumar Real Estate',     ph:'+91 99900 11223', email:'kumar@kumarre.in',             src:'Referral',  status:'Cold', via:'Email',    last:'1 week ago',  stage:'Initial Contact' },
  { id:6,  name:'Pooja Spaces',          ph:'+91 96543 21098', email:'pooja@poojasp.com',           src:'Instagram', status:'New',  via:'WhatsApp', last:'6 hrs ago',   stage:'Initial Contact' },
  { id:7,  name:'Aditya Residencies',    ph:'+91 98765 43210', email:'aditya@adityahomes.in',       src:'Instagram', status:'Hot',  via:'WhatsApp', last:'1 hr ago',    stage:'Negotiation'     },
  { id:8,  name:'Neha Home Designs',     ph:'+91 93456 78901', email:'neha@nehahome.com',           src:'Instagram', status:'Warm', via:'WhatsApp', last:'4 hrs ago',   stage:'Proposal Sent'   },
  { id:9,  name:'Apex Architects',       ph:'+91 99123 45678', email:'info@apexarchitects.in',      src:'Instagram', status:'New',  via:'Email',    last:'8 hrs ago',   stage:'Initial Contact' },
  { id:10, name:'Royal Interiors Blr',   ph:'+91 96789 01234', email:'royal@royalinteriors.in',     src:'Instagram', status:'Warm', via:'WhatsApp', last:'2 days ago',  stage:'Proposal Sent'   },
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
const srcColor: Record<string,string> = { Instagram:'badge-red', Website:'badge-blue', Referral:'badge-green', 'Walk-in':'badge-gray' }

export default function Leads() {
  const [tab, setTab]     = useState<'leads'|'instagram'|'email'|'wa'>('leads')
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
      {/* Instagram Banner */}
      <div className="rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <Instagram size={26} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-base">Instagram Leads Connected</p>
          <p className="text-white/80 text-xs mt-0.5">
            {LEADS.filter(l=>l.src==='Instagram').length} leads this month from Instagram · Meta Business API via Google Sheets sync
          </p>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{LEADS.filter(l=>l.src==='Instagram').length}</p>
            <p className="text-white/70 text-[10px]">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">3</p>
            <p className="text-white/70 text-[10px]">Converted</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">60%</p>
            <p className="text-white/70 text-[10px]">Conversion</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors">
            <Link size={12}/> Connect API
          </button>
          <button className="flex items-center gap-1.5 bg-white text-purple-600 text-xs px-3 py-2 rounded-lg font-bold transition-colors hover:bg-white/90">
            <TrendingUp size={12}/> View Stats
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Leads',      val: LEADS.length,                                      accent:'border-brand'      },
          { label:'Instagram Leads',  val: LEADS.filter(l=>l.src==='Instagram').length,        accent:'border-purple-500' },
          { label:'Hot Leads',        val: LEADS.filter(l=>l.status==='Hot').length,           accent:'border-red-500'    },
          { label:'Conversions',      val: 14,                                                  accent:'border-green-500'  },
        ].map(c => (
          <div key={c.label} className={`card border-l-4 ${c.accent}`}>
            <p className="text-2xl font-bold text-gray-800">{c.val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card !p-0 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {([
            { id:'leads',     label:'All Leads',           icon: User         },
            { id:'instagram', label:'Instagram Leads',      icon: Instagram    },
            { id:'email',     label:'Email Automation',     icon: Mail         },
            { id:'wa',        label:'WhatsApp Automation',  icon: MessageCircle},
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-brand text-brand bg-brand-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-600'
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
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sf===s?'bg-brand text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
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
                      <td className="font-medium text-gray-800 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 text-brand text-xs font-bold flex items-center justify-center shrink-0">{l.name[0]}</div>
                          {l.name}
                        </div>
                      </td>
                      <td className="text-gray-400 text-xs whitespace-nowrap"><div className="flex items-center gap-1"><Phone size={11}/>{l.ph}</div></td>
                      <td className="text-gray-500 text-xs">{l.email}</td>
                      <td><span className={srcColor[l.src] ?? 'badge-gray'}>{l.src}</span></td>
                      <td className="text-gray-600 whitespace-nowrap">{l.stage}</td>
                      <td><span className={sColor[l.status]}>{l.status}</span></td>
                      <td><span className={vColor[l.via]}>{l.via}</span></td>
                      <td className="text-gray-600 text-xs whitespace-nowrap"><div className="flex items-center gap-1"><Clock size={11}/>{l.last}</div></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="p-1.5 text-gray-600 hover:text-brand hover:bg-brand-50 rounded-lg transition-colors" title="Email"><Mail size={13}/></button>
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

        {/* INSTAGRAM */}
        {tab === 'instagram' && (
          <div className="p-5 space-y-5">
            <div className="rounded-xl p-4 flex items-center gap-4"
              style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}>
              <Instagram size={32} className="text-white shrink-0"/>
              <div>
                <p className="text-white font-bold">Meta Business API — Instagram Lead Ads</p>
                <p className="text-white/75 text-xs mt-0.5">Leads from Instagram DMs and Lead Ad forms flow here automatically via Google Sheets sync</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"/>
                <span className="text-white text-xs font-medium">Live Sync Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:'Total Instagram Leads', val: LEADS.filter(l=>l.src==='Instagram').length, color:'text-purple-600' },
                { label:'Hot',    val: LEADS.filter(l=>l.src==='Instagram'&&l.status==='Hot').length,  color:'text-red-500'    },
                { label:'Warm',   val: LEADS.filter(l=>l.src==='Instagram'&&l.status==='Warm').length, color:'text-yellow-500' },
                { label:'Converted',val: 3, color:'text-green-600' },
              ].map(s=>(
                <div key={s.label} className="card text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto card p-0">
              <table className="tbl w-full">
                <thead><tr><th>Name</th><th>Phone</th><th>Stage</th><th>Status</th><th>Via</th><th>Last Contact</th><th>Actions</th></tr></thead>
                <tbody>
                  {LEADS.filter(l=>l.src==='Instagram').map(l=>(
                    <tr key={l.id}>
                      <td className="font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{background:'linear-gradient(135deg,#833ab4,#fd1d1d)'}}>
                            {l.name[0]}
                          </div>
                          {l.name}
                        </div>
                      </td>
                      <td className="text-gray-400 text-xs">{l.ph}</td>
                      <td className="text-gray-600">{l.stage}</td>
                      <td><span className={sColor[l.status]}>{l.status}</span></td>
                      <td><span className={vColor[l.via]}>{l.via}</span></td>
                      <td className="text-gray-500 text-xs"><div className="flex items-center gap-1"><Clock size={11}/>{l.last}</div></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg" title="Email"><Mail size={13}/></button>
                          <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg" title="WhatsApp"><MessageCircle size={13}/></button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg" title="Call"><Phone size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Setup Guide */}
            <div className="card border border-purple-200 bg-purple-50/40">
              <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Link size={15} className="text-purple-500"/>How Instagram Leads Connect to Dashboard</p>
              <div className="space-y-2">
                {[
                  { step:'1', text:'Instagram Lead Ad form filled by customer' },
                  { step:'2', text:'Meta Business API sends lead to Google Sheets (ashutosh@adoracoatings.com)' },
                  { step:'3', text:'Google Sheets auto-logs: Name, Phone, Message, Timestamp' },
                  { step:'4', text:'Dashboard reads from Google Sheets via API — shows here in real time' },
                ].map(s=>(
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
                    <p className="text-sm text-gray-600 pt-0.5">{s.text}</p>
                  </div>
                ))}
              </div>
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
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${exp===t.name?'border-brand/40 bg-brand-50/50':'border-gray-100 hover:border-brand-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><Mail size={14} className="text-brand"/><h4 className="text-sm font-semibold text-gray-800">{t.name}</h4></div>
                      <p className="text-xs text-gray-500">Subject: <span className="text-gray-600">{t.subject}</span></p>
                      <p className="text-xs text-gray-600 mt-1">Trigger: {t.trigger}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="btn-outline-gold text-xs py-1 px-3">Edit</button>
                      <button className="btn-gold text-xs py-1 px-3 flex items-center gap-1"><Send size={11}/>Send</button>
                    </div>
                  </div>
                  {exp===t.name && (
                    <div className="mt-4 pt-4 border-t border-brand-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs text-gray-500 mb-1">Trigger</label><select className="input-dark text-xs"><option>New lead created</option><option>Stage changed</option><option>Manual</option><option>Time delay</option></select></div>
                        <div><label className="block text-xs text-gray-500 mb-1">Audience</label><select className="input-dark text-xs"><option>All leads</option><option>Hot leads</option><option>Warm leads</option></select></div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" defaultChecked className="accent-brand"/>Active</label>
                        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" className="accent-brand"/>Track opens</label>
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
                <div key={t.name} className="border border-gray-100 hover:border-brand-200 rounded-xl p-4 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-500/20 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-green-400"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-800">{t.name}</h4>
                        <span className="badge-green shrink-0">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Trigger: <span className="text-gray-600">{t.trigger}</span></p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-xs text-gray-600 leading-relaxed">{t.msg}</p>
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
                <div key={s.l}><p className="text-xl font-bold text-brand">{s.v}</p><p className="text-xs text-gray-500">{s.l}</p></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md p-6">
            <h2 className="font-display text-xl font-semibold text-gray-800 mb-5">Add New Lead</h2>
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
