const Locale = {
  confirm: {
    fcm: '',
  },
  error: {
    tryLater: 'Terjadi kesalahan. Silakan coba lagi nanti.',
    notEnoughCoin: 'Kekurangan koin. Tolong isi ulang di toko.',
  },
  poll: {
    left: 'Tersisa',
    skip: 'Lewati',
    shuffle: 'Kocok',
  },
  community: {
    header: 'Komunitas',
  },
  school: {},
  schoolEdit: {
    header: 'Registrasi Sekolah',
    form: {
      city: {
        level1: 'Kota',
        level2: 'Province',
        level3: 'Citi',
        placeholder: 'Pilih',
      },
      schoolType: {
        label: 'Jenis sekolah',
      },
      school: {},
    },
  },
  gradeEdit: {
    header: 'Registrasi Kelas',
    form: {},
  },
  phoneEdit: {
    header: 'Registrasi Profil',
    form: {
      phone: {
        label: 'Nomor',
        error: {
          required: 'Input yang diperlukan',
        },
      },
      otp: {
        label: 'OTP',
        error: {
          required: 'Input yang diperlukan',
        },
      },
    },
  },
  profileEdit: {
    header: 'Registrasi Profil',
    desc1: 'Tuliskan dengan tepat sehingga teman-teman Anda dapat mengenalinya.',
    desc2: 'Ini tidak bisa diubah nanti.',
    form: {
      name: {
        label: 'Nama',
        error: {
          required: 'Input yang diperlukan',
          max: 'Nama bisa sampai 30 karakter',
          min: 'Tuliskan nama yang teman-teman Anda dapat mengenali',
        },
      },
      gender: {
        label: 'Gender',
        value: {
          male: 'Pria',
          female: 'Wanita',
        },
        error: {
          required: 'Input yang diperlukan',
        },
      },
    },
  },
  premiumCreate: {
    header: 'Buat',
    form: {
      question: {
        label: 'Pertanyaan',
        error: {
          required: 'Input yang diperlukan',
          max: 'Nama bisa sampai 60 karakter',
        },
      },
      preview: {
        label: 'Pratayang',
      },
      gender: {
        label: 'Gender',
        value: {
          diff: { value: 'Sisi', desc: { m: 'Kandidat hanya pria', f: 'Kandidat hanya wanita' } },
          union: { value: 'Integrasi', desc: 'Kandidat dicampur dengan pria dan wanita' },
        },
        error: {
          required: 'Input yang diperlukan',
        },
      },
      include: {
        label: 'Termasuk',
        error: {
          required: 'Input yang diperlukan',
        },
      },
    },
  },
  profile: { header: 'Profil' },
  shop: {
    header: 'Toko',
    koin: 'Koin',
    premiums: {
      header: 'Premium',
      join: {
        header: 'Pesertaan',
        desc: 'Peserta sebagai kandidat pada jajak pendapat besok. Anda dapat memilih jajak pendapat yang ada',
      },
      create: {
        header: 'Buat',
        desc: 'Buat pertanyaan baru. Anda dapat menjadi kandidat di atasnya',
      },
    },
    products: { header: 'Produk', ad: { desc: 'Menonton iklan, mendapatkan 30 ~ 100 koin acak' } },
  },
  settings: {
    header: 'Pengaturan',
  },
};

export default Locale;
