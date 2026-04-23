import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { adminApi } from '../../api/admin';

function TipTapToolbar({ editor }) {
  if (!editor) return null;
  const btn = (action, label, active) => (
    <button type="button" className={active ? 'is-active' : ''} onClick={action}>{label}</button>
  );
  return (
    <div className="tiptap-toolbar">
      {btn(() => editor.chain().focus().toggleBold().run(), 'B', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), 'I', editor.isActive('italic'))}
      {btn(() => editor.chain().focus().toggleHeading({level:2}).run(), 'H2', editor.isActive('heading',{level:2}))}
      {btn(() => editor.chain().focus().toggleHeading({level:3}).run(), 'H3', editor.isActive('heading',{level:3}))}
      {btn(() => editor.chain().focus().toggleBulletList().run(), '• List', editor.isActive('bulletList'))}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), '1. List', editor.isActive('orderedList'))}
      {btn(() => editor.chain().focus().toggleBlockquote().run(), '❝', editor.isActive('blockquote'))}
      {btn(() => editor.chain().focus().setHorizontalRule().run(), '─', false)}
      <button type="button" onClick={() => {
        const url = prompt('URL gambar:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
      }}>🖼️</button>
      <button type="button" onClick={() => {
        const url = prompt('URL link:');
        if (url) editor.chain().focus().setLink({ href: url }).run();
        else editor.chain().focus().unsetLink().run();
      }} className={editor.isActive('link')?'is-active':''}>🔗</button>
      {btn(() => editor.chain().focus().undo().run(), '↩', false)}
      {btn(() => editor.chain().focus().redo().run(), '↪', false)}
    </div>
  );
}

export default function ArticleEditor() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isNew      = !id;
  const fileRef    = useRef();

  const [form,     setForm]    = useState({ title:'', slug:'', excerpt:'', is_published: false });
  const [preview,  setPreview] = useState(null);
  const [file,     setFile]    = useState(null);
  const [saving,   setSaving]  = useState(false);
  const [loading,  setLoading] = useState(!isNew);
  const [toast,    setToast]   = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),4000); };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Tulis konten artikel di sini...' }),
    ],
    content: '',
  });

  // Load existing article
  useEffect(() => {
    if (isNew || !editor) return;
    adminApi.getAdminArticle(id).then(res => {
      const a = res.article;
      setForm({ title: a.title, slug: a.slug, excerpt: a.excerpt??'', is_published: a.is_published });
      editor.commands.setContent(a.content ?? '');
      if (a.cover_image) setPreview(a.cover_image);
    }).finally(() => setLoading(false));
  }, [id, editor]);

  // Auto-generate slug from title (only for new articles)
  function handleTitleChange(e) {
    const t = e.target.value;
    setForm(f => ({
      ...f,
      title: t,
      ...(isNew ? { slug: t.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-') } : {}),
    }));
  }

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function save(publish = null) {
    if (!form.title.trim()) { showToast('Judul artikel wajib diisi.', 'error'); return; }
    if (!editor?.getHTML() || editor.getHTML() === '<p></p>') { showToast('Konten artikel wajib diisi.', 'error'); return; }

    setSaving(true);
    const fd = new FormData();
    fd.append('title',        form.title);
    fd.append('slug',         form.slug);
    fd.append('excerpt',      form.excerpt);
    fd.append('content',      editor.getHTML());
    fd.append('is_published', publish !== null ? (publish ? '1' : '0') : (form.is_published ? '1' : '0'));
    if (file) fd.append('cover_image', file);

    try {
      if (isNew) await adminApi.createArticle(fd);
      else       await adminApi.updateArticle(id, fd);
      showToast('Artikel berhasil disimpan!');
      setTimeout(() => navigate('/admin/articles'), 1500);
    } catch { showToast('Gagal menyimpan artikel.', 'error'); }
    finally  { setSaving(false); }
  }

  if (loading) return <div className="adm-content" style={{color:'var(--adm-muted)'}}>Memuat artikel...</div>;

  return (
    <div className="adm-content">
      {toast && <div className={`adm-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <div className="adm-page-header">
        <h1>{isNew ? '✍️ Tulis Artikel Baru' : '✏️ Edit Artikel'}</h1>
        <div style={{display:'flex',gap:'.75rem'}}>
          <button className="adm-btn adm-btn-ghost" onClick={() => navigate('/admin/articles')}>← Kembali</button>
          <button className="adm-btn adm-btn-ghost" onClick={() => save(false)} disabled={saving}>Simpan Draft</button>
          <button className="adm-btn adm-btn-primary" onClick={() => save(true)} disabled={saving}>
            {saving ? 'Menyimpan...' : '🌐 Publikasikan'}
          </button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 300px', gap:'1.5rem', alignItems:'start'}}>
        {/* Main Editor */}
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="adm-card">
            <div className="adm-field">
              <label className="adm-label">Judul Artikel *</label>
              <input className="adm-input" value={form.title} onChange={handleTitleChange}
                placeholder="Tips Merawat Kuku Agar Tahan Lama..." style={{fontSize:'1.1rem',fontWeight:600}} />
            </div>
          </div>

          <div className="adm-card">
            <label className="adm-label" style={{marginBottom:'.5rem',display:'block'}}>Konten Artikel *</label>
            <div className="tiptap-wrapper">
              <TipTapToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {/* Cover Image */}
          <div className="adm-card">
            <div className="adm-card-title">Cover Image</div>
            <div className="adm-upload-box" onClick={() => fileRef.current.click()}>
              {preview
                ? <div className="adm-upload-preview"><img src={preview} alt="cover" /></div>
                : '🖼️ Klik upload cover'}
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={pickFile} />
            </div>
            {preview && (
              <button className="adm-btn adm-btn-danger adm-btn-sm" style={{marginTop:'.5rem',width:'100%'}}
                onClick={() => { setFile(null); setPreview(null); }}>✕ Hapus Cover</button>
            )}
          </div>

          {/* Slug */}
          <div className="adm-card">
            <div className="adm-field">
              <label className="adm-label">Slug URL</label>
              <input className="adm-input" value={form.slug}
                onChange={e => setForm(f=>({...f,slug:e.target.value}))}
                placeholder="tips-merawat-kuku" style={{fontSize:'.8rem'}} />
              <span style={{fontSize:'.72rem',color:'var(--adm-muted)'}}>/blog/{form.slug || 'slug-otomatis'}</span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="adm-card">
            <div className="adm-field">
              <label className="adm-label">Ringkasan (Excerpt)</label>
              <textarea className="adm-textarea" value={form.excerpt} rows={3}
                onChange={e => setForm(f=>({...f,excerpt:e.target.value}))}
                placeholder="Ringkasan singkat artikel yang tampil di daftar blog..." />
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="adm-card" style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
            <input type="checkbox" id="is_published" checked={form.is_published}
              onChange={e => setForm(f=>({...f,is_published:e.target.checked}))} />
            <label htmlFor="is_published" style={{fontSize:'.875rem',fontWeight:500,cursor:'pointer',color:'var(--adm-text)'}}>
              Publikasikan sekarang
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
