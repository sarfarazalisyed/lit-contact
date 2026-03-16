'use client'
import { useState } from 'react'

const faqs = [
  { q: 'Who is LIT School for?', a: 'LIT is for creators, hustlers, and anyone who wants to build a career in the creator economy — no prior experience needed.' },
  { q: 'How long is the program?', a: 'Our programs range from 3 to 6 months depending on the track you choose.' },
  { q: 'Is it online or in-person?', a: 'LIT is fully online and live — you learn in real-time with a cohort of peers.' },
  { q: 'How much does it cost?', a: 'Pricing varies by program. Fill out the contact form and our team will share all details with you.' },
  { q: 'Will I get a certificate?', a: 'Yes! You get a certificate of completion and access to the LIT alumni network.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<any>({})
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [openFaq, setOpenFaq] = useState<number|null>(null)

  function validate() {
    const e: any = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setStatus('loading')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) setStatus('success')
    else setStatus('error')
  }

  if (status === 'success') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0a'}}>
      <div style={{textAlign:'center',color:'white'}}>
        <h1 style={{fontSize:'2rem',marginBottom:'1rem'}}>🎉 Thanks! We'll be in touch soon.</h1>
        <button onClick={() => { setStatus('idle'); setForm({name:'',email:'',message:''}) }}
          style={{padding:'12px 24px',background:'#6c47ff',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'16px'}}>
          Send another message
        </button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',padding:'4rem 2rem'}}>
      <div style={{maxWidth:'560px',margin:'0 auto'}}>

        {/* Header */}
        <h1 style={{color:'white',fontSize:'2.5rem',fontWeight:700,marginBottom:'0.5rem'}}>Contact Us</h1>
        <p style={{color:'#888',marginBottom:'2.5rem',fontSize:'1.1rem'}}>Got a question? We'd love to hear from you.</p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem',marginBottom:'4rem'}}>
          <input type="text" name="honeypot" style={{display:'none'}} tabIndex={-1} autoComplete="off"/>
          <div>
            <label style={{color:'#ccc',fontSize:'14px',display:'block',marginBottom:'6px'}}>Name</label>
            <input value={form.name} onChange={e => setForm({...form,name:e.target.value})}
              style={{width:'100%',padding:'12px',background:'#1a1a1a',border:`1px solid ${errors.name?'#ff4444':'#333'}`,borderRadius:'8px',color:'white',fontSize:'16px',boxSizing:'border-box'}}
              placeholder="Your name"/>
            {errors.name && <p style={{color:'#ff4444',fontSize:'13px',marginTop:'4px'}}>{errors.name}</p>}
          </div>
          <div>
            <label style={{color:'#ccc',fontSize:'14px',display:'block',marginBottom:'6px'}}>Email</label>
            <input value={form.email} onChange={e => setForm({...form,email:e.target.value})}
              style={{width:'100%',padding:'12px',background:'#1a1a1a',border:`1px solid ${errors.email?'#ff4444':'#333'}`,borderRadius:'8px',color:'white',fontSize:'16px',boxSizing:'border-box'}}
              placeholder="you@example.com"/>
            {errors.email && <p style={{color:'#ff4444',fontSize:'13px',marginTop:'4px'}}>{errors.email}</p>}
          </div>
          <div>
            <label style={{color:'#ccc',fontSize:'14px',display:'block',marginBottom:'6px'}}>Message</label>
            <textarea value={form.message} onChange={e => setForm({...form,message:e.target.value})}
              style={{width:'100%',padding:'12px',background:'#1a1a1a',border:`1px solid ${errors.message?'#ff4444':'#333'}`,borderRadius:'8px',color:'white',fontSize:'16px',boxSizing:'border-box',minHeight:'120px',resize:'vertical'}}
              placeholder="How can we help you?"/>
            {errors.message && <p style={{color:'#ff4444',fontSize:'13px',marginTop:'4px'}}>{errors.message}</p>}
          </div>
          <button type="submit" disabled={status==='loading'}
            style={{padding:'14px',background:'#6c47ff',color:'white',border:'none',borderRadius:'8px',fontSize:'16px',fontWeight:600,cursor:'pointer',opacity:status==='loading'?0.7:1,transition:'opacity 0.2s'}}>
            {status==='loading' ? 'Sending...' : 'Send Message'}
          </button>
          {status==='error' && <p style={{color:'#ff4444',textAlign:'center'}}>Something went wrong. Please try again.</p>}
        </form>

        {/* FAQ Section */}
        <div>
          <h2 style={{color:'white',fontSize:'1.5rem',fontWeight:600,marginBottom:'0.5rem'}}>Frequently asked questions</h2>
          <p style={{color:'#888',marginBottom:'1.5rem',fontSize:'14px'}}>Answers to common questions before you reach out.</p>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {faqs.map((faq, i) => (
              <div key={i} style={{background:'#1a1a1a',borderRadius:'8px',overflow:'hidden',border:'1px solid #222'}}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{width:'100%',padding:'16px',background:'none',border:'none',color:'white',fontSize:'15px',fontWeight:500,textAlign:'left',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  {faq.q}
                  <span style={{color:'#6c47ff',fontSize:'20px',lineHeight:1}}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{padding:'0 16px 16px',color:'#aaa',fontSize:'14px',lineHeight:1.6}}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}