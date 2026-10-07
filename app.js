const items = document.querySelectorAll('.product,.panel,.card,.metric,.cta,.role,.contact-card,.contact-form-wrap');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.animate(
          [{opacity:0, transform:'translateY(18px)'},{opacity:1, transform:'translateY(0)'}],
          {duration:650, easing:'cubic-bezier(.2,.8,.2,1)', fill:'both'}
        );
        io.unobserve(entry.target);
      }
    })
  },{threshold:.12});
  items.forEach(el=>io.observe(el));
}

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const status = contactForm.querySelector('[data-form-status]');
  const submit = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.className = 'form-status';
    status.textContent = '';
    submit.disabled = true;
    const original = submit.innerHTML;
    submit.textContent = 'Enviando…';

    try {
      const payload = Object.fromEntries(new FormData(contactForm).entries());
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'No fue posible enviar el mensaje.');

      status.textContent = 'Gracias. Tu mensaje fue enviado correctamente y quedó registrado para seguimiento.';
      status.className = 'form-status show success';
      contactForm.reset();
    } catch (error) {
      status.textContent = error.message || 'No fue posible enviar el mensaje. Intenta nuevamente.';
      status.className = 'form-status show error';
    } finally {
      submit.disabled = false;
      submit.innerHTML = original;
    }
  });
}
