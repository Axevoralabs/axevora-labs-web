const $all=(s)=>[...document.querySelectorAll(s)];

function applyLanguage(lang){
  const next=lang==='en'?'en':'es';
  document.documentElement.lang=next;
  localStorage.setItem('axevora-lang',next);
  $all('[data-es][data-en]').forEach(el=>{el.textContent=el.dataset[next]||el.dataset.es;});
  $all('[data-placeholder-es][data-placeholder-en]').forEach(el=>{el.placeholder=el.dataset[next==='en'?'placeholderEn':'placeholderEs'];});
  $all('[data-lang-btn]').forEach(btn=>btn.classList.toggle('active',btn.dataset.langBtn===next));
  const url=new URL(window.location.href);url.searchParams.set('lang',next);history.replaceState(null,'',url);
}

const initialLang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('axevora-lang')||((navigator.language||'').toLowerCase().startsWith('en')?'en':'es');
applyLanguage(initialLang);
$all('[data-lang-btn]').forEach(btn=>btn.addEventListener('click',()=>applyLanguage(btn.dataset.langBtn)));

const menuBtn=document.querySelector('[data-menu-btn]');
const mobilePanel=document.querySelector('[data-mobile-panel]');
if(menuBtn&&mobilePanel){menuBtn.addEventListener('click',()=>{const open=mobilePanel.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});mobilePanel.querySelectorAll('a,button').forEach(el=>el.addEventListener('click',()=>{if(!el.hasAttribute('data-lang-btn'))mobilePanel.classList.remove('open');}));}

const revealItems=document.querySelectorAll('.product,.panel,.card,.metric,.cta,.role,.contact-card,.contact-form-wrap,.trust-item,.timeline-item');
if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});io.unobserve(entry.target);}});},{threshold:.1});revealItems.forEach(el=>io.observe(el));}

const contactForm=document.querySelector('[data-contact-form]');
if(contactForm){const status=contactForm.querySelector('[data-form-status]');const submit=contactForm.querySelector('button[type="submit"]');contactForm.addEventListener('submit',async(event)=>{event.preventDefault();const lang=document.documentElement.lang==='en'?'en':'es';status.className='form-status';status.textContent='';submit.disabled=true;const original=submit.innerHTML;submit.textContent=lang==='en'?'Sending…':'Enviando…';try{const payload=Object.fromEntries(new FormData(contactForm).entries());const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.message||(lang==='en'?'We could not send your message.':'No fue posible enviar el mensaje.'));status.textContent=lang==='en'?'Thank you. Your message was sent successfully.':'Gracias. Tu mensaje fue enviado correctamente.';status.className='form-status show success';contactForm.reset();}catch(error){status.textContent=error.message||(lang==='en'?'We could not send your message. Please try again.':'No fue posible enviar el mensaje. Intenta nuevamente.');status.className='form-status show error';}finally{submit.disabled=false;submit.innerHTML=original;}});}
