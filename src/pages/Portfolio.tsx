import { useState } from 'react'
import { Plus, Eye, MapPin, Calendar, X, Maximize2, CheckCircle2 } from 'lucide-react'

const PROJECTS = [
  { id:1,  title:'SHUBHARAM COMPLEX',          cat:'Decorative Wall Finishes',  city:'Bangalore', year:2023, finish:'Venetian Plaster + Metallic Accent',  area:'6,200 sq.ft',  status:'Completed' },
  { id:2,  title:'LAMY STORE',                 cat:'Metallic Wall Finishes',    city:'Bangalore', year:2023, finish:'Metallic Pearl Finish',               area:'2,100 sq.ft',  status:'Completed' },
  { id:3,  title:'G P SPORTS & INFRA',         cat:'Floor Finishes',            city:'Bangalore', year:2023, finish:'Epoxy Floor + Anti-Skid Coating',     area:'3,500 sq.ft',  status:'Completed' },
  { id:4,  title:'STREAMLINE FITNESS',         cat:'Decorative Wall Finishes',  city:'Bangalore', year:2023, finish:'Microcement Wall Finish',             area:'1,800 sq.ft',  status:'Completed' },
  { id:5,  title:'ARYAN INTERIORS – TN',       cat:'Metallic Wall Finishes',    city:'Tamil Nadu',year:2023, finish:'Gold Metallic Texture Coat',          area:'1,100 sq.ft',  status:'Completed' },
  { id:6,  title:'SRIKAKULAM APARTMENT',       cat:'Exterior Finishes',         city:'Bangalore', year:2023, finish:'Exterior Texture + Weather Shield',   area:'2,800 sq.ft',  status:'Completed' },
  { id:7,  title:'ANANT CARS AUTO PVT LTD',   cat:'Decorative Wall Finishes',  city:'Bangalore', year:2023, finish:'Smooth Finish + Brand Colour Coat',   area:'1,400 sq.ft',  status:'Completed' },
  { id:8,  title:'PURVA SKYWOOD',              cat:'Exterior Finishes',         city:'Bangalore', year:2023, finish:'Smooth Exterior Premium',             area:'2,200 sq.ft',  status:'Completed' },
  { id:9,  title:'YUKI PAN ASIAN',             cat:'Decorative Wall Finishes',  city:'Bangalore', year:2023, finish:'Rustic Venetian Plaster',             area:'820 sq.ft',    status:'In Progress'},
  { id:10, title:'PNG HEALTHCARE',             cat:'Decorative Wall Finishes',  city:'Bangalore', year:2023, finish:'Smooth Wall + Hygienic Coat',         area:'650 sq.ft',    status:'Completed' },
  { id:11, title:'MALNAD ARCADE',              cat:'Floor Finishes',            city:'Bangalore', year:2023, finish:'Decorative Concrete Floor',           area:'1,050 sq.ft',  status:'Completed' },
  { id:12, title:'ARUN EDUFUN',               cat:'Decorative Wall Finishes',  city:'Bangalore', year:2023, finish:'Silk Plaster Coating',               area:'980 sq.ft',    status:'Completed' },
  { id:13, title:'ARYAN INTERIORS',           cat:'Metallic Wall Finishes',    city:'Bangalore', year:2023, finish:'Metallic Texture Finish',             area:'520 sq.ft',    status:'Completed' },
  { id:14, title:'GODREJ GOLD COUNTY',        cat:'Exterior Finishes',         city:'Bangalore', year:2023, finish:'Sand Texture Exterior Coat',          area:'760 sq.ft',    status:'Completed' },
  { id:15, title:'SQUIRE HWFS',               cat:'Floor Finishes',            city:'Bangalore', year:2023, finish:'Microcement Floor Finish',            area:'580 sq.ft',    status:'Completed' },
  { id:16, title:'POWER PLUS ENTERPRISES',    cat:'Decorative Wall Finishes',  city:'Bangalore', year:2023, finish:'Custom Texture Wall Coat',           area:'680 sq.ft',    status:'Completed' },
  { id:17, title:'SRIKURUNJI INFRASTRUCTURE', cat:'Metallic Wall Finishes',    city:'Bangalore', year:2026, finish:'Mania Pearla — Premium Metallic',     area:'2,852 sq.ft',  status:'Ongoing'   },
]

const CATS = ['All', 'Metallic Wall Finishes', 'Decorative Wall Finishes', 'Exterior Finishes', 'Floor Finishes']
const catColors: Record<string, string> = {
  'Metallic Wall Finishes':   'border-yellow-500/50 bg-yellow-500/5',
  'Decorative Wall Finishes': 'border-purple-500/50 bg-purple-500/5',
  'Exterior Finishes':        'border-blue-500/50 bg-blue-500/5',
  'Floor Finishes':           'border-gray-500/50 bg-gray-500/5',
}

export default function Portfolio() {
  const [cat, setCat]           = useState('All')
  const [selected, setSelected] = useState<typeof PROJECTS[0] | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [toast, setToast]       = useState('')
  const [newProj, setNewProj]   = useState({ title:'', city:'Bangalore', year:'2026', area:'', finish:'', cat:'Metallic Wall Finishes', status:'Ongoing' })

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),3000) }
  const handleAddProject = () => {
    if (!newProj.title) return
    showToast(`✓ "${newProj.title}" added to portfolio — awaiting project photos`)
    setAddModal(false)
    setNewProj({ title:'', city:'Bangalore', year:'2026', area:'', finish:'', cat:'Metallic Wall Finishes', status:'Ongoing' })
  }

  const list = PROJECTS.filter(p => cat === 'All' || p.cat === cat)

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Projects',  val: PROJECTS.length },
          { label:'Completed',       val: PROJECTS.filter(p => p.status === 'Completed').length },
          { label:'Ongoing',         val: PROJECTS.filter(p => p.status === 'Ongoing').length },
          { label:'Cities Covered',  val: [...new Set(PROJECTS.map(p => p.city))].length },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="font-display text-3xl font-bold text-brand">{s.val}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${cat === c ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c}
            </button>
          ))}
          <button onClick={() => setAddModal(true)} className="ml-auto btn-gold flex items-center gap-1.5"><Plus size={13} />Add Project</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map(p => (
          <div key={p.id} onClick={() => setSelected(p)}
            className={`card border ${catColors[p.cat] ?? 'border-gray-100'} group cursor-pointer hover:border-brand/40 hover:shadow-md transition-all`}>
            {/* Placeholder image area */}
            <div className="w-full h-36 rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 mb-4 flex items-center justify-center relative overflow-hidden border border-brand-100">
              <p className="text-brand/30 text-xs font-medium">Click to View Details</p>
              <div className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <Maximize2 size={13} className="text-brand" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight">{p.title}</h3>
                <span className={p.status === 'Completed' ? 'badge-green shrink-0' : p.status === 'Ongoing' ? 'badge-yellow shrink-0' : 'badge-blue shrink-0'}>{p.status}</span>
              </div>
              <p className="text-xs text-brand font-medium">{p.finish}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={11} />{p.city}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{p.year}</span>
                <span className="ml-auto text-gray-400 font-medium">{p.area}</span>
              </div>
              <span className={`badge text-[10px] border ${catColors[p.cat] ?? 'bg-gray-50 border-gray-200 text-gray-500'}`}>{p.cat}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 size={15}/>{toast}
        </div>
      )}

      {/* Add Project Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Add New Project</h2>
              <button onClick={() => setAddModal(false)}><X size={18} className="text-gray-400"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Project / Client Name *</label>
                <input className="input-dark" placeholder="e.g. SRIKURUNJI INFRASTRUCTURE"
                  value={newProj.title} onChange={e=>setNewProj(p=>({...p,title:e.target.value}))}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">City</label>
                  <input className="input-dark" value={newProj.city} onChange={e=>setNewProj(p=>({...p,city:e.target.value}))}/></div>
                <div><label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Year</label>
                  <input className="input-dark" value={newProj.year} onChange={e=>setNewProj(p=>({...p,year:e.target.value}))}/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Area (sqft)</label>
                  <input className="input-dark" placeholder="e.g. 2,500 sq.ft" value={newProj.area} onChange={e=>setNewProj(p=>({...p,area:e.target.value}))}/></div>
                <div><label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Status</label>
                  <select className="input-dark" value={newProj.status} onChange={e=>setNewProj(p=>({...p,status:e.target.value}))}>
                    <option>Ongoing</option><option>Completed</option><option>In Progress</option>
                  </select></div>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Category</label>
                <select className="input-dark" value={newProj.cat} onChange={e=>setNewProj(p=>({...p,cat:e.target.value}))}>
                  {CATS.slice(1).map(c=><option key={c}>{c}</option>)}
                </select></div>
              <div><label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold tracking-wider">Finish Applied</label>
                <input className="input-dark" placeholder="e.g. Mania Pearla — Premium Metallic"
                  value={newProj.finish} onChange={e=>setNewProj(p=>({...p,finish:e.target.value}))}/></div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setAddModal(false)} className="flex-1 btn-outline-gold text-sm">Cancel</button>
              <button onClick={handleAddProject} disabled={!newProj.title}
                className="flex-1 btn-gold text-sm disabled:opacity-50">Add Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-dark to-brand px-6 py-5 flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${selected.status === 'Completed' ? 'bg-green-400/20 text-green-200' : 'bg-yellow-400/20 text-yellow-200'}`}>{selected.status}</span>
                <h2 className="text-white font-bold text-lg leading-tight">{selected.title}</h2>
                <p className="text-white/70 text-xs mt-1">{selected.finish}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:'Category',    val: selected.cat   },
                  { label:'Location',    val: selected.city  },
                  { label:'Year',        val: String(selected.year) },
                  { label:'Area',        val: selected.area  },
                ].map(d => (
                  <div key={d.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{d.label}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">{d.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-3">
                <p className="text-[10px] text-brand-dark font-semibold uppercase tracking-wider mb-1">Finish Applied</p>
                <p className="text-sm font-medium text-brand-dark">{selected.finish}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                <Eye size={12}/> Project photos will be added once provided by client
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setSelected(null)} className="w-full btn-gold py-2.5 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
