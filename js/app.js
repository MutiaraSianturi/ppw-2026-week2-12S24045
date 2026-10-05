const state = { projects: [], currentFilter: 'semua' };

async function renderProfile() {
  try {
    const profile = await ApiService.getProfile();
    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileRole').textContent = profile.role + ' / ' + profile.university;
    document.getElementById('profilePhoto').src = profile.photo;

    const bioContainer = document.getElementById('bioContainer');
    bioContainer.innerHTML = '';
    profile.bio.forEach(function (paragraf) {
      const p = document.createElement('p');
      p.textContent = paragraf;
      bioContainer.appendChild(p);
    });

    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    profile.skills.forEach(function (skill) {
      const li = document.createElement('li');
      li.className = 'skill-tag';
      li.textContent = skill.name;
      li.addEventListener('click', function () { openSkillModal(skill.name, skill.desc); });
      skillsList.appendChild(li);
    });
  } catch (err) {
    console.error('Gagal memuat profil:', err);
  }
}

async function renderProjects() {
  const container = document.getElementById('projectsContainer');
  container.innerHTML = '<div class="text-center py-5 w-100"><div class="spinner-border text-light"></div><p class="mt-3 text-muted">Memuat data proyek...</p></div>';
  try {
    const projects = await ApiService.getProjects();
    state.projects = projects;
    renderFilteredProjects();
  } catch (err) {
    console.error('Gagal memuat proyek:', err);
    container.innerHTML = '<div class="alert alert-danger w-100"><i class="bi bi-exclamation-triangle"></i> Gagal memuat data proyek. Silakan muat ulang halaman.</div>';
  }
}

function renderFilteredProjects() {
  const container = document.getElementById('projectsContainer');
  const filtered = state.currentFilter === 'semua' ? state.projects : state.projects.filter(function (p) { return p.category === state.currentFilter; });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="alert alert-warning w-100"><i class="bi bi-inbox"></i> Tidak ada proyek pada kategori ini.</div>';
    return;
  }

  container.innerHTML = '';
  filtered.forEach(function (proj) {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML =
      '<div class="card h-100 project-card">' +
        '<img src="' + proj.thumbnail + '" class="card-img-top" alt="' + escapeHTML(proj.title) + '">' +
        '<div class="card-body">' +
          '<span class="badge badge-accent-1 mb-2">' + escapeHTML(proj.category) + '</span>' +
          '<h5 class="card-title">' + escapeHTML(proj.title) + '</h5>' +
          '<p class="card-text">' + escapeHTML(proj.description) + '</p>' +
          '<button class="btn btn-outline-light btn-sm">Lihat Detail</button>' +
        '</div>' +
      '</div>';
    col.querySelector('button').addEventListener('click', function () { openProjectModal(proj.id); });
    container.appendChild(col);
  });
}

function openProjectModal(projectId) {
  const proj = state.projects.find(function (p) { return p.id === projectId; });
  if (!proj) return;
  document.getElementById('projectModalTitle').textContent = proj.title;
  document.getElementById('projectModalBody').innerHTML =
    '<img src="' + proj.thumbnail + '" class="img-fluid rounded mb-3 w-100" alt="' + escapeHTML(proj.title) + '">' +
    '<p>' + escapeHTML(proj.description) + '</p>' +
    '<p><strong>Teknologi:</strong> ' + escapeHTML(proj.tech) + '</p>' +
    '<span class="badge badge-accent-2">' + escapeHTML(proj.category) + '</span>';
  bootstrap.Modal.getOrCreateInstance(document.getElementById('universalProjectModal')).show();
}

function openSkillModal(title, desc) {
  document.getElementById('skillModalTitle').textContent = title;
  document.getElementById('skillModalBody').textContent = desc;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('skillModal')).show();
}

function escapeHTML(teks) {
  const div = document.createElement('div');
  div.textContent = teks;
  return div.innerHTML;
}

function setupCertFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const certCards = document.querySelectorAll('.cert-card');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      certCards.forEach(function (card) {
        card.style.display = (filter === 'semua' || card.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  revealElements.forEach(function (el) { observer.observe(el); });
}

function setupLightbox() {
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  document.addEventListener('click', function (e) {
    if (e.target.closest('.volunteer-card img, .cert-card img')) {
      lightboxImg.src = e.target.src;
      lightboxImg.alt = e.target.alt;
      lightboxOverlay.classList.add('active');
    }
  });
  function tutupLightbox() { lightboxOverlay.classList.remove('active'); lightboxImg.src = ''; }
  lightboxClose.addEventListener('click', tutupLightbox);
  lightboxOverlay.addEventListener('click', function (e) { if (e.target === lightboxOverlay) tutupLightbox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') tutupLightbox(); });
}

function setupScrollTopButton() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', function () { scrollTopBtn.classList.toggle('show', window.scrollY > 400); });
  scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

function showToast(judul, pesan) {
  const toastEl = document.getElementById('appToast');
  document.getElementById('toastTitle').textContent = judul;
  document.getElementById('toastMessage').textContent = pesan;
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

function saveOrderToLocalStorage(payload) {
  const daftarPesanan = JSON.parse(localStorage.getItem('serviceOrders') || '[]');
  payload.waktu = new Date().toISOString();
  daftarPesanan.push(payload);
  localStorage.setItem('serviceOrders', JSON.stringify(daftarPesanan));
  updateOrderBadge();
}

function updateOrderBadge() {
  const daftarPesanan = JSON.parse(localStorage.getItem('serviceOrders') || '[]');
  const badge = document.getElementById('orderCountBadge');
  if (badge) {
    badge.textContent = daftarPesanan.length;
    badge.style.display = daftarPesanan.length > 0 ? 'inline-block' : 'none';
  }
}

function setupFormSubmit() {
  const form = document.getElementById('serviceForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const tombolSubmit = form.querySelector('button[type="submit"]');
    const teksAsli = tombolSubmit.innerHTML;
    tombolSubmit.disabled = true;
    tombolSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Mengirim...';
    try {
      await ApiService.submitServiceOrder(payload);
      saveOrderToLocalStorage(payload);
      showToast('Berhasil', 'Permintaan layanan Anda sudah tersimpan.');
      form.reset();
    } catch (err) {
      showToast('Gagal', 'Terjadi kesalahan, silakan coba lagi.');
    } finally {
      tombolSubmit.disabled = false;
      tombolSubmit.innerHTML = teksAsli;
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderProfile();
  renderProjects();
  setupCertFilters();
  setupScrollReveal();
  setupLightbox();
  setupScrollTopButton();
  setupFormSubmit();
  updateOrderBadge();
});