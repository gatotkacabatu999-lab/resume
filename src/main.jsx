import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Check,
  ChevronDown,
  Download,
  Eye,
  FileText,
  FilePenLine,
  Link2,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  X,
} from 'lucide-react'
import './styles.css'

const initialResume = {
  photo: '',
  fullName: 'Aisyah Rahman',
  age: '28',
  status: 'Bujang',
  role: 'Product Designer',
  email: 'aisyah.rahman@email.com',
  phone: '+60 12 345 6789',
  address: '',
  postcode: '',
  location: 'Kuala Lumpur, Malaysia',
  website: 'aisyahrahman.com',
  summary:
    'Product designer yang gemar mengubah masalah kompleks menjadi pengalaman digital yang ringkas, jelas dan bermakna. Berpengalaman membina produk untuk pengguna di Asia Tenggara.',
  skills: ['Product strategy', 'Figma', 'User research', 'Design systems', 'Prototyping', 'Facilitation'],
  experience: [
    {
      company: 'Swell Labs',
      role: 'Senior Product Designer',
      period: '2022 — Kini',
      description:
        'Menerajui reka bentuk end-to-end untuk platform kewangan yang digunakan 80k+ pengguna. Meningkatkan activation rate sebanyak 32% melalui onboarding baharu.',
    },
    {
      company: 'Studio Kecil',
      role: 'Product Designer',
      period: '2020 — 2022',
      description:
        'Bekerjasama dengan pasukan produk dan engineering untuk melancarkan 6 feature utama daripada discovery hingga production.',
    },
  ],
  education: [
    {
      school: 'Universiti Teknologi MARA',
      degree: 'Ijazah Sarjana Muda Reka Bentuk Grafik',
      period: '2016 — 2020',
    },
  ],
}

const initialResignation = {
  fullName: 'Aisyah Rahman',
  role: 'Product Designer',
  company: 'Swell Labs',
  manager: 'Puan Nurul Huda',
  date: '6 September 2026',
  lastDay: '6 Oktober 2026',
  notice: '30 hari',
  reason: 'Saya ingin meneruskan peluang baharu yang lebih selari dengan perkembangan kerjaya saya.',
}

const templates = [
  { id: 'editorial', label: 'Editorial', description: 'Tipografi ekspresif' },
  { id: 'classic', label: 'Classic', description: 'Kemas & profesional' },
  { id: 'minimal', label: 'Minimal', description: 'Ringkas & moden' },
]

const colors = [
  { name: 'Terracotta', value: '#c45d43' },
  { name: 'Forest', value: '#286052' },
  { name: 'Ink', value: '#263238' },
  { name: 'Cobalt', value: '#365db8' },
  { name: 'Ochre', value: '#b37c24' },
]

const resignationTemplates = [
  { id: 'formal', label: 'Formal', description: 'Klasik & rasmi' },
  { id: 'modern', label: 'Modern', description: 'Kemas dengan aksen' },
  { id: 'minimal', label: 'Minimal', description: 'Bersih & ringkas' },
  { id: 'accent', label: 'Accent', description: 'Header lebih menonjol' },
]

function loadResume() {
  try {
    const hash = window.location.hash
    if (hash.startsWith('#resume=')) return JSON.parse(decodeURIComponent(atob(hash.slice(8))))
    const saved = localStorage.getItem('resume-studio-data')
    return saved ? { ...initialResume, ...JSON.parse(saved) } : initialResume
  } catch {
    return initialResume
  }
}

function loadResignation() {
  try {
    const hash = window.location.hash
    if (hash.startsWith('#resignation=')) return { ...initialResignation, ...JSON.parse(decodeURIComponent(atob(hash.slice(13)))) }
    const saved = localStorage.getItem('resignation-studio-data')
    return saved ? { ...initialResignation, ...JSON.parse(saved) } : initialResignation
  } catch {
    return initialResignation
  }
}

function App() {
  const [resume, setResume] = useState(loadResume)
  const [resignation, setResignation] = useState(loadResignation)
  const [activeView, setActiveView] = useState(() => window.location.hash.startsWith('#resignation=') ? 'resignation' : 'resume')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [resignationTemplate, setResignationTemplate] = useState('formal')
  const [resignationTab, setResignationTab] = useState('content')
  const [template, setTemplate] = useState('editorial')
  const [accent, setAccent] = useState(colors[0].value)
  const [activeTab, setActiveTab] = useState('content')
  const [saved, setSaved] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const [toast, setToast] = useState('')
  const isSharedView = window.location.hash.startsWith('#resume=') || window.location.hash.startsWith('#resignation=')

  useEffect(() => {
    if (!saved) {
      const timer = setTimeout(() => {
        localStorage.setItem('resume-studio-data', JSON.stringify(resume))
        setSaved(true)
      }, 650)
      return () => clearTimeout(timer)
    }
  }, [resume, saved])

  useEffect(() => {
    localStorage.setItem('resignation-studio-data', JSON.stringify(resignation))
  }, [resignation])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const update = (key, value) => {
    setResume((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const updateResignation = (key, value) => setResignation((current) => ({ ...current, [key]: value }))

  const updateListItem = (list, index, key, value) => {
    update(list, resume[list].map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)))
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setToast('Sila pilih fail gambar')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast('Saiz gambar mestilah kurang daripada 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => update('photo', reader.result)
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const addExperience = () => update('experience', [...resume.experience, { company: 'Nama syarikat', role: 'Jawatan', period: '2020 — 2022', description: 'Terangkan sumbangan dan pencapaian anda.' }])
  const addEducation = () => update('education', [...resume.education, { school: 'Nama institusi', degree: 'Program pengajian', period: '2016 — 2020' }])
  const removeItem = (list, index) => update(list, resume[list].filter((_, itemIndex) => itemIndex !== index))

  const shareUrl = useMemo(() => {
    const documentType = activeView === 'resume' ? 'resume' : 'resignation'
    const documentData = activeView === 'resume' ? resume : resignation
    const encoded = btoa(encodeURIComponent(JSON.stringify(documentData)))
    return `${window.location.origin}${window.location.pathname}#${documentType}=${encoded}`
  }, [activeView, resume, resignation])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setToast(`Link ${activeView === 'resume' ? 'resume' : 'surat resign'} disalin ke clipboard`)
    } catch {
      setToast('Link sudah siap. Salin dari kotak share.')
    }
  }

  const resetResume = () => {
    if (window.confirm('Reset resume kepada contoh asal?')) {
      setResume(initialResume)
      setSaved(false)
      setToast('Resume dikembalikan ke contoh asal')
    }
  }

  return (
    <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'} ${isSharedView ? 'shared-view' : ''}`} style={{ '--accent': accent }}>
      <header className="topbar">
        <div className="topbar-leading"><button className="sidebar-toggle icon-button" title={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'} onClick={() => setSidebarOpen((open) => !open)}>{sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}</button><div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>Resume<span className="brand-muted">Studio</span></span></div></div>
        <div className="topbar-actions">
          <span className="save-status">{saved ? <><Check size={15} /> Disimpan</> : <><Save size={15} /> Menyimpan...</>}</span>
          {activeView === 'resume' && <button className="button button-ghost" onClick={resetResume}><RotateCcw size={16} /> Reset</button>}
          <button className="button button-share" onClick={() => setShareOpen(true)}><Link2 size={16} /> Kongsi</button>
          <button className="button button-primary" onClick={() => window.print()}><Download size={16} /> PDF / Print</button>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading"><p className="sidebar-label">Workspace</p><button className="sidebar-toggle icon-button" title="Tutup sidebar" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={17} /></button></div>
          <button className={`sidebar-item ${activeView === 'resume' ? 'active' : ''}`} onClick={() => setActiveView('resume')}><FileText size={17} /><span><strong>Resume</strong><small>Edit & bina resume</small></span></button>
          <button className={`sidebar-item ${activeView === 'resignation' ? 'active' : ''}`} onClick={() => setActiveView('resignation')}><FilePenLine size={17} /><span><strong>Surat Resign</strong><small>Surat letak jawatan</small></span></button>
          <div className="sidebar-footer"><Sparkles size={14} /> Semua disimpan secara automatik</div>
        </aside>
        <aside className="editor-panel">
          {activeView === 'resume' ? <><div className="panel-heading">
            <div><p className="eyebrow">Resume builder</p><h1>Bina cerita kerjaya anda.</h1></div>
            <div className="profile-chip"><UserRound size={16} /></div>
          </div>
          <div className="tabs" role="tablist">
            <button className={activeTab === 'content' ? 'tab active' : 'tab'} onClick={() => setActiveTab('content')}>Kandungan</button>
            <button className={activeTab === 'design' ? 'tab active' : 'tab'} onClick={() => setActiveTab('design')}>Gaya</button>
          </div>

          {activeTab === 'content' ? <div className="form-content">
            <section className="form-section">
              <div className="section-label"><span>01</span><h2>Profil utama</h2></div>
              <div className="photo-field">
                <div className="photo-preview">{resume.photo ? <img src={resume.photo} alt="Foto profil" /> : <UserRound size={22} />}</div>
                <div><strong>Foto profil</strong><p>JPG atau PNG, maksimum 2MB.</p></div>
                <label className="button button-ghost upload-button"><Upload size={15} /> {resume.photo ? 'Tukar foto' : 'Tambah foto'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoUpload} /></label>
                {resume.photo && <button className="icon-button delete" title="Padam foto" onClick={() => update('photo', '')}><Trash2 size={15} /></button>}
              </div>
              <div className="field-grid">
                <Field label="Nama penuh" value={resume.fullName} onChange={(value) => update('fullName', value)} />
                <Field label="Jawatan / bidang" value={resume.role} onChange={(value) => update('role', value)} />
                <Field label="Umur" value={resume.age} onChange={(value) => update('age', value)} type="number" min="1" max="120" />
                <label className="field"><span>Status</span><select value={resume.status} onChange={(event) => update('status', event.target.value)}><option>Bujang</option><option>Berkahwin</option><option>Duda / Janda</option><option>Lain-lain</option></select></label>
                <Field label="Email" value={resume.email} onChange={(value) => update('email', value)} />
                <Field label="Telefon" value={resume.phone} onChange={(value) => update('phone', value)} />
                <Field label="Alamat" value={resume.address} onChange={(value) => update('address', value)} />
                <Field label="Poskod" value={resume.postcode} onChange={(value) => update('postcode', value)} />
                <Field label="Lokasi" value={resume.location} onChange={(value) => update('location', value)} />
                <Field label="Website" value={resume.website} onChange={(value) => update('website', value)} />
              </div>
              <label className="field full-field"><span>Ringkasan profesional</span><textarea value={resume.summary} onChange={(event) => update('summary', event.target.value)} rows="4" /></label>
            </section>

            <section className="form-section">
              <div className="section-label"><span>02</span><h2>Pengalaman</h2><button className="add-item-button" title="Tambah pengalaman" onClick={addExperience}><Plus size={15} /> Tambah pengalaman</button></div>
              {resume.experience.map((item, index) => <div className="repeat-card" key={`${item.company}-${index}`}>
                <div className="repeat-header"><span className="item-number">{String(index + 1).padStart(2, '0')}</span><button className="icon-button delete" title="Padam pengalaman" onClick={() => removeItem('experience', index)}><Trash2 size={15} /></button></div>
                <div className="field-grid"><Field label="Syarikat" value={item.company} onChange={(value) => updateListItem('experience', index, 'company', value)} /><Field label="Jawatan" value={item.role} onChange={(value) => updateListItem('experience', index, 'role', value)} /><Field label="Tempoh" value={item.period} onChange={(value) => updateListItem('experience', index, 'period', value)} /><label className="field full-field"><span>Penerangan & pencapaian</span><textarea value={item.description} onChange={(event) => updateListItem('experience', index, 'description', event.target.value)} rows="3" /></label></div>
              </div>)}
            </section>

            <section className="form-section">
              <div className="section-label"><span>03</span><h2>Pendidikan</h2><button className="add-item-button" title="Tambah pendidikan" onClick={addEducation}><Plus size={15} /> Tambah pendidikan</button></div>
              {resume.education.map((item, index) => <div className="repeat-card" key={`${item.school}-${index}`}><div className="repeat-header"><span className="item-number">{String(index + 1).padStart(2, '0')}</span><button className="icon-button delete" title="Padam pendidikan" onClick={() => removeItem('education', index)}><Trash2 size={15} /></button></div><div className="field-grid"><Field label="Institusi" value={item.school} onChange={(value) => updateListItem('education', index, 'school', value)} /><Field label="Tempoh" value={item.period} onChange={(value) => updateListItem('education', index, 'period', value)} /><label className="field full-field"><span>Program / kelayakan</span><input value={item.degree} onChange={(event) => updateListItem('education', index, 'degree', event.target.value)} /></label></div></div>)}
            </section>

            <section className="form-section">
              <div className="section-label"><span>04</span><h2>Kemahiran</h2></div>
              <label className="field full-field"><span>Asingkan dengan koma</span><input value={resume.skills.join(', ')} onChange={(event) => update('skills', event.target.value.split(',').map((skill) => skill.trim()).filter(Boolean))} /></label>
            </section>
          </div> : <DesignPanel template={template} setTemplate={setTemplate} accent={accent} setAccent={setAccent} />}</> : <ResignationEditorTabs resignation={resignation} update={updateResignation} template={resignationTemplate} setTemplate={setResignationTemplate} activeTab={resignationTab} setActiveTab={setResignationTab} />}
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar"><div className="preview-title"><Eye size={16} /><span>Live preview</span></div><span className="a4-label">A4 · 1 halaman</span></div>
          <div className={activeView === 'resume' ? 'paper-wrap' : 'letter-wrap'}>{activeView === 'resume' ? <ResumePreview resume={resume} template={template} accent={accent} /> : <ResignationPreview resignation={resignation} template={resignationTemplate} />}</div>
          <p className="preview-note"><Printer size={14} /> Gunakan PDF / Print untuk menyimpan salinan berkualiti tinggi.</p>
        </section>
      </main>

      {shareOpen && <div className="modal-backdrop" onClick={() => setShareOpen(false)}><div className="share-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={() => setShareOpen(false)}><X size={18} /></button><div className="modal-icon"><Link2 size={21} /></div><p className="eyebrow">Share {activeView === 'resume' ? 'resume' : 'surat resign'}</p><h2>{activeView === 'resume' ? 'Resume' : 'Surat resign'} anda sedia untuk dikongsi.</h2><p className="modal-copy">Sesiapa yang mempunyai link ini boleh melihat {activeView === 'resume' ? 'resume' : 'surat resign'} anda. Data disimpan terus dalam link.</p><div className="share-input"><input value={shareUrl} readOnly /><button className="button button-primary" onClick={handleShare}>Salin link</button></div><span className="privacy-note"><Check size={14} /> Tiada akaun atau server diperlukan</span></div></div>}
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', min, max }) {
  return <label className="field"><span>{label}</span><input type={type} min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

function DesignPanel({ template, setTemplate, accent, setAccent }) {
  return <div className="design-content"><section className="form-section"><div className="section-label"><span>01</span><h2>Pilih template</h2></div><div className="template-list">{templates.map((item) => <button key={item.id} className={`template-option ${template === item.id ? 'selected' : ''}`} onClick={() => setTemplate(item.id)}><span className={`template-swatch ${item.id}`}><FileText size={20} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span>{template === item.id && <Check size={16} className="template-check" />}</button>)}</div></section><section className="form-section"><div className="section-label"><span>02</span><h2>Warna aksen</h2></div><div className="color-grid">{colors.map((color) => <button key={color.value} className={`color-option ${accent === color.value ? 'selected' : ''}`} style={{ '--swatch': color.value }} onClick={() => setAccent(color.value)} title={color.name}><span />{accent === color.value && <Check size={14} />}</button>)}</div><p className="design-tip">Warna akan digunakan pada nama, heading dan elemen utama resume.</p></section></div>
}

function ResignationEditorTabs({ resignation, update, template, setTemplate, activeTab, setActiveTab }) {
  return <div className="resignation-editor">
    <div className="panel-heading"><div><p className="eyebrow">Letter builder</p><h1>Surat resign yang profesional.</h1></div><div className="profile-chip"><FilePenLine size={16} /></div></div>
    <p className="editor-intro">Lengkapkan maklumat di bawah. Surat anda akan dikemas kini secara live.</p>
    <div className="tabs" role="tablist">
      <button className={activeTab === 'content' ? 'tab active' : 'tab'} onClick={() => setActiveTab('content')}>Kandungan</button>
      <button className={activeTab === 'design' ? 'tab active' : 'tab'} onClick={() => setActiveTab('design')}>Gaya</button>
    </div>
    {activeTab === 'content' ? <>
      <section className="form-section"><div className="section-label"><span>01</span><h2>Maklumat surat</h2></div><div className="field-grid">
        <Field label="Nama penuh" value={resignation.fullName} onChange={(value) => update('fullName', value)} />
        <Field label="Jawatan" value={resignation.role} onChange={(value) => update('role', value)} />
        <Field label="Nama syarikat" value={resignation.company} onChange={(value) => update('company', value)} />
        <Field label="Kepada / manager" value={resignation.manager} onChange={(value) => update('manager', value)} />
        <Field label="Tarikh surat" value={resignation.date} onChange={(value) => update('date', value)} />
        <Field label="Hari terakhir bekerja" value={resignation.lastDay} onChange={(value) => update('lastDay', value)} />
        <label className="field full-field"><span>Tempoh notis</span><select value={resignation.notice} onChange={(event) => update('notice', event.target.value)}><option>24 jam</option><option>7 hari</option><option>14 hari</option><option>30 hari</option><option>60 hari</option><option>Lain-lain</option></select></label>
      </div></section>
      <section className="form-section"><div className="section-label"><span>02</span><h2>Alasan ringkas</h2></div><label className="field full-field"><span>Alasan berhenti</span><textarea value={resignation.reason} onChange={(event) => update('reason', event.target.value)} rows="5" /></label></section>
    </> : <section className="form-section"><div className="section-label"><span>01</span><h2>Pilih gaya surat</h2></div><div className="template-list">{resignationTemplates.map((item) => <button key={item.id} className={`template-option ${template === item.id ? 'selected' : ''}`} onClick={() => setTemplate(item.id)}><span className={`letter-style-swatch ${item.id}`}><FilePenLine size={18} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span>{template === item.id && <Check size={16} className="template-check" />}</button>)}</div></section>}
  </div>
}

function LegacyResignationEditor({ resignation, update }) {
  return <div className="resignation-editor"><div className="panel-heading"><div><p className="eyebrow">Letter builder</p><h1>Surat resign yang profesional.</h1></div><div className="profile-chip"><FilePenLine size={16} /></div></div><p className="editor-intro">Lengkapkan maklumat di bawah. Surat anda akan dikemas kini secara live.</p><section className="form-section"><div className="section-label"><span>01</span><h2>Maklumat surat</h2></div><div className="field-grid"><Field label="Nama penuh" value={resignation.fullName} onChange={(value) => update('fullName', value)} /><Field label="Jawatan" value={resignation.role} onChange={(value) => update('role', value)} /><Field label="Nama syarikat" value={resignation.company} onChange={(value) => update('company', value)} /><Field label="Kepada / manager" value={resignation.manager} onChange={(value) => update('manager', value)} /><Field label="Tarikh surat" value={resignation.date} onChange={(value) => update('date', value)} /><Field label="Hari terakhir bekerja" value={resignation.lastDay} onChange={(value) => update('lastDay', value)} /><label className="field full-field"><span>Tempoh notis</span><select value={resignation.notice} onChange={(event) => update('notice', event.target.value)}><option>24 jam</option><option>7 hari</option><option>14 hari</option><option>30 hari</option><option>60 hari</option><option>Lain-lain</option></select></label></div></section><section className="form-section"><div className="section-label"><span>02</span><h2>Alasan ringkas</h2></div><label className="field full-field"><span>Alasan berhenti</span><textarea value={resignation.reason} onChange={(event) => update('reason', event.target.value)} rows="5" /></label></section></div>
}

function ResignationEditor({ resignation, update, template, setTemplate }) {
  return <div className="resignation-editor"><div className="panel-heading"><div><p className="eyebrow">Letter builder</p><h1>Surat resign yang profesional.</h1></div><div className="profile-chip"><FilePenLine size={16} /></div></div><p className="editor-intro">Lengkapkan maklumat di bawah. Surat anda akan dikemas kini secara live.</p><section className="form-section"><div className="section-label"><span>01</span><h2>Maklumat surat</h2></div><div className="field-grid"><Field label="Nama penuh" value={resignation.fullName} onChange={(value) => update('fullName', value)} /><Field label="Jawatan" value={resignation.role} onChange={(value) => update('role', value)} /><Field label="Nama syarikat" value={resignation.company} onChange={(value) => update('company', value)} /><Field label="Kepada / manager" value={resignation.manager} onChange={(value) => update('manager', value)} /><Field label="Tarikh surat" value={resignation.date} onChange={(value) => update('date', value)} /><Field label="Hari terakhir bekerja" value={resignation.lastDay} onChange={(value) => update('lastDay', value)} /><label className="field full-field"><span>Tempoh notis</span><select value={resignation.notice} onChange={(event) => update('notice', event.target.value)}><option>24 jam</option><option>7 hari</option><option>14 hari</option><option>30 hari</option><option>60 hari</option><option>Lain-lain</option></select></label></div></section><section className="form-section"><div className="section-label"><span>02</span><h2>Alasan ringkas</h2></div><label className="field full-field"><span>Alasan berhenti</span><textarea value={resignation.reason} onChange={(event) => update('reason', event.target.value)} rows="5" /></label></section><section className="form-section"><div className="section-label"><span>03</span><h2>Pilih gaya surat</h2></div><div className="template-list">{resignationTemplates.map((item) => <button key={item.id} className={`template-option ${template === item.id ? 'selected' : ''}`} onClick={() => setTemplate(item.id)}><span className={`letter-style-swatch ${item.id}`}><FilePenLine size={18} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span>{template === item.id && <Check size={16} className="template-check" />}</button>)}</div></section></div>
}

function ResumePreview({ resume, template, accent }) {
  return <article className={`resume-paper template-${template}`} style={{ '--accent': accent }}><header className="resume-header"><div className="resume-identity">{resume.photo && <img className="resume-photo" src={resume.photo} alt="" />}<div><h2>{resume.fullName}</h2><p className="resume-role">{resume.role}</p></div></div><div className="contact-list"><span>{resume.email}</span><span>{resume.phone}</span>{resume.address && <span>{resume.address}</span>}{resume.postcode && <span>{resume.postcode}</span>}<span>{resume.location}</span><span>{resume.age} tahun · {resume.status}</span><span>{resume.website}</span></div></header><div className="resume-body"><section className="resume-section intro-section"><h3>Profil</h3><p>{resume.summary}</p></section><section className="resume-section"><h3>Pengalaman</h3>{resume.experience.map((item, index) => <div className="resume-item" key={`${item.company}-${index}`}><div className="item-meta"><strong>{item.company}</strong><span>{item.period}</span></div><div><h4>{item.role}</h4><p>{item.description}</p></div></div>)}</section><section className="resume-section"><h3>Pendidikan</h3>{resume.education.map((item, index) => <div className="resume-item education-item" key={`${item.school}-${index}`}><div className="item-meta"><strong>{item.school}</strong><span>{item.period}</span></div><h4>{item.degree}</h4></div>)}</section><section className="resume-section skills-section"><h3>Kemahiran</h3><div className="skill-list">{resume.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section></div><footer className="resume-footer"><span>{resume.fullName}</span><span>resume.studio</span></footer></article>
}

function LegacyResignationPreview({ resignation }) {
  return <article className="resignation-paper"><div className="letter-top"><span>SURAT LETAK JAWATAN</span><span>{resignation.date}</span></div><div className="letter-content"><p>{resignation.manager}</p><p>{resignation.company}</p><p className="letter-subject">Perkara: Notis peletakan jawatan</p><p>Dengan hormatnya saya, <strong>{resignation.fullName}</strong>, yang memegang jawatan sebagai <strong>{resignation.role}</strong> di {resignation.company}, ingin mengemukakan notis peletakan jawatan saya.</p><p>Peletakan jawatan ini berkuat kuasa dengan tempoh notis <strong>{resignation.notice}</strong>. Hari terakhir saya bekerja adalah pada <strong>{resignation.lastDay}</strong>.</p><p>Keputusan ini dibuat setelah pertimbangan yang teliti. Saya menghargai segala peluang, tunjuk ajar dan pengalaman yang telah saya peroleh sepanjang berkhidmat di organisasi ini.</p><p>Saya bersedia membantu proses serah tugas bagi memastikan peralihan tanggungjawab berjalan dengan lancar.</p><p>Terima kasih atas segala kerjasama dan sokongan yang diberikan.</p><p>Yang benar,</p><div className="signature-space" /><p className="signature-name"><strong>{resignation.fullName}</strong><br />{resignation.role}</p></div><footer className="letter-footer"><span>{resignation.fullName}</span><span>{resignation.company}</span></footer></article>
}

function ResignationPreview({ resignation, template }) {
  return <article className={`resignation-paper resignation-${template}`}><div className="letter-top"><span>SURAT LETAK JAWATAN</span><span>{resignation.date}</span></div><div className="letter-content"><p>{resignation.manager}</p><p>{resignation.company}</p><p className="letter-subject">Perkara: Notis peletakan jawatan</p><p>Dengan hormatnya saya, <strong>{resignation.fullName}</strong>, yang memegang jawatan sebagai <strong>{resignation.role}</strong> di {resignation.company}, ingin mengemukakan notis peletakan jawatan saya.</p><p>Peletakan jawatan ini berkuat kuasa dengan tempoh notis <strong>{resignation.notice}</strong>. Hari terakhir saya bekerja adalah pada <strong>{resignation.lastDay}</strong>.</p><p>{resignation.reason}</p><p>Saya bersedia membantu proses serah tugas bagi memastikan peralihan tanggungjawab berjalan dengan lancar.</p><p>Terima kasih atas segala kerjasama dan sokongan yang diberikan.</p><p>Yang benar,</p><div className="signature-space" /><p className="signature-name"><strong>{resignation.fullName}</strong><br />{resignation.role}</p></div><footer className="letter-footer"><span>{resignation.fullName}</span><span>{resignation.company}</span></footer></article>
}

createRoot(document.getElementById('root')).render(<App />)
