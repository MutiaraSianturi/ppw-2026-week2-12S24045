// Filter kategori sertifikat
const filterButtons = document.querySelectorAll('.filter-btn');
const certCards = document.querySelectorAll('.cert-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    certCards.forEach(card => {
      card.style.display = (filter === 'semua' || card.dataset.category === filter) ? 'block' : 'none';
    });
  });
});

// Animasi muncul saat discroll
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
revealElements.forEach(el => observer.observe(el));

// Klik skill -> munculkan modal deskripsi
const skillTags = document.querySelectorAll('.skill-tag');
const skillModalTitle = document.getElementById('skillModalTitle');
const skillModalBody = document.getElementById('skillModalBody');
const skillModalEl = document.getElementById('skillModal');
const skillModal = new bootstrap.Modal(skillModalEl);

skillTags.forEach(tag => {
  tag.addEventListener('click', () => {
    skillModalTitle.textContent = tag.textContent;
    skillModalBody.textContent = tag.dataset.desc;
    skillModal.show();
  });
});

// Tombol scroll to top, muncul kalau udah scroll ke bawah
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});