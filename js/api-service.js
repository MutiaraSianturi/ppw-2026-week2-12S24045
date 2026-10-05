const ApiService = {
  async getProfile() {
    const response = await fetch('./data/profile.json');
    if (!response.ok) throw new Error('Gagal memuat profil, status: ' + response.status);
    return await response.json();
  },
  async getProjects() {
    const response = await fetch('./data/projects.json');
    if (!response.ok) throw new Error('Gagal memuat proyek, status: ' + response.status);
    return await response.json();
  },
  async getServices() {
    const response = await fetch('./data/services.json');
    if (!response.ok) throw new Error('Gagal memuat layanan, status: ' + response.status);
    return await response.json();
  },
  async submitServiceOrder(payload) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve({ success: true, message: 'Permintaan berhasil diterima' }); }, 800);
    });
  }
};