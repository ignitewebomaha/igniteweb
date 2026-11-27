document.documentElement.classList.add('js');

const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
}

menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();

const quote = document.querySelector('#quoteForm');
if (quote) {
  const form = document.querySelector('#contactForm');
  const total = document.querySelector('#total');
  const monthlyTotal = document.querySelector('#monthly');
  const estimateField = document.querySelector('#estimateField');
  const message = document.querySelector('#message');
  const status = document.querySelector('#formStatus');
  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  function estimate() {
    const data = new FormData(quote);
    const cost = Number(data.get('base')) + Number(data.get('logo')) + Number(data.get('blog'));
    const monthly = Number(data.get('maintenance'));
    total.textContent = usd.format(cost);
    monthlyTotal.textContent = monthly ? '+ ' + usd.format(monthly) + '/month maintenance' : '';
    estimateField.value = total.textContent + (monthly ? ' + ' + usd.format(monthly) + '/month' : '');
  }

  quote.addEventListener('change', estimate);
  estimate();
  document.querySelector('#useEstimate').addEventListener('click', () => {
    const choices = [...quote.querySelectorAll('input:checked')]
      .map(input => input.parentElement.textContent.trim())
      .join(', ');
    const details = message.value.trim();
    message.value = 'I’m interested in ' + choices + '. Estimated starting cost is ' + estimateField.value
      + '.\n\nProject details: ' + details.replace(/^I’m interested in .*?\n\nProject details: /s, '');
    form.elements.service.value = 'Website design';
    document.querySelector('#contact').scrollIntoView();
    message.focus({ preventScroll: true });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type=submit]');
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = 'Sending your project inquiry…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Submission failed');
      status.textContent = 'Thanks! Your inquiry has been sent. Dylan will follow up by email.';
      form.reset();
      estimate();
    } catch {
      status.textContent = 'Your inquiry could not be sent. Please try again or email ignitewebomaha@yahoo.com. Your details are still here.';
    } finally {
      button.disabled = false;
      button.textContent = 'Send project inquiry';
    }
  });
}
