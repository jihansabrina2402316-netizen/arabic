import { Lesson, VocabWord } from '../types';

export const MAHARAH_METADATA = {
  istima: {
    id: 'istima',
    name: 'Maharah Istima\'',
    nameAr: 'مَهَارَةُ الاِسْتِمَاعِ',
    desc: 'Keterampilan Menyimak & Mendengarkan Audio Bahasa Arab',
    icon: 'Headphones',
    color: 'emerald',
    badge: 'Mendengarkan'
  },
  kalam: {
    id: 'kalam',
    name: 'Maharah Kalam',
    nameAr: 'مَهَارَةُ الكَلَامِ',
    desc: 'Keterampilan Berbicara, Percakapan (Hiwar) & Pelafalan Fasih',
    icon: 'Mic',
    color: 'teal',
    badge: 'Berbicara'
  },
  qiraah: {
    id: 'qiraah',
    name: 'Maharah Qira\'ah',
    nameAr: 'مَهَارَةُ القِرَاءَةِ',
    desc: 'Keterampilan Membaca Teks, Analisis Kosakata & Pemahaman',
    icon: 'BookOpen',
    color: 'cyan',
    badge: 'Membaca'
  },
  kitabah: {
    id: 'kitabah',
    name: 'Maharah Kitabah',
    nameAr: 'مَهَارَةُ الكِتَابَةِ',
    desc: 'Keterampilan Menulis, Tartib Kalimat, Imla\' & Insya\' AI',
    icon: 'PenTool',
    color: 'indigo',
    badge: 'Menulis'
  },
  qawaid: {
    id: 'qawaid',
    name: 'Kaidah Nahwu & Sharaf',
    nameAr: 'القَوَاعِدُ النَّحْوِيَّةُ وَالصَّرْفِيَّةُ',
    desc: 'Struktur Tata Bahasa Arab, I\'rab, dan Tabel Tasrif MA',
    icon: 'Layers',
    color: 'amber',
    badge: 'Tata Bahasa'
  },
  mufradat: {
    id: 'mufradat',
    name: 'Kamus Mufradat MA',
    nameAr: 'مُعْجَمُ المُفْرَدَاتِ',
    desc: 'Kamus Kosakata Tematik Madrasah Aliyah dengan Audio & Contoh',
    icon: 'Search',
    color: 'blue',
    badge: 'Kosakata'
  },
  ujian: {
    id: 'ujian',
    name: 'Simulasi Asesmen MA',
    nameAr: 'اِخْتِبَارُ التَّقْيِيمِ الشَّامِلِ',
    desc: 'Ujian Standar Asesmen Madrasah dengan Skor & Pembahasan',
    icon: 'Award',
    color: 'purple',
    badge: 'Ujian Akhir'
  }
};

export const INITIAL_LESSONS: Lesson[] = [
  // ===================== MAHARAH ISTIMA' =====================
  {
    id: 'istima-1',
    maharah: 'istima',
    grade: 'X',
    level: 'Dasar',
    title: 'Perkenalan di Lingkungan Madrasah Baru',
    titleAr: 'التَّعَارُفُ فِي رِحَابِ المَدْرَسَةِ الجَدِيدَةِ',
    description: 'Dengarkan dialog antara dua siswa baru di madrasah aliyah dan jawab pertanyaan pemahaman.',
    audioDuration: '2:15',
    audioScript: 'أَحْمَد: السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ. \nفَرِيْد: وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ. \nأَحْمَد: اِسْمِي أَحْمَدُ، أَنَا طَالِبٌ جَدِيدٌ فِي هَذِهِ المَدْرَسَةِ العَالِيَةِ الإِسْلَامِيَّةِ. مَا اسْمُكَ يَا أَخِي؟ \nفَرِيْد: أَهْلًا وَسَهْلًا يَا أَحْمَد! اِسْمِي فَرِيْدٌ، وَأَنَا أَيْضًا طَالِبٌ جَدِيدٌ فِي الفَصْلِ العَاشِرِ. مِنْ أَيْنَ جِئْتَ؟ \nأَحْمَد: جِئْتُ مِنْ مَدِينَةِ سُورَابَايَا، وَأَسْكُنُ الآنَ فِي السَّكَنِ المَدْرَسِيِّ. وَأَنْتَ؟ \nفَرِيْد: أَنَا مِنْ بَانْدُونج، وَأَسْكُنُ مَعَ عَمِّي قَرِيبًا مِنَ المَدْرَسَةِ. هَلْ أَنْتَ مَسْرُورٌ بِالدِّرَاسَةِ هُنَا؟ \nأَحْمَد: نَعَمْ، أَنَا مَسْرُورٌ جِدًّا، لِأَنَّ هَذِهِ المَدْرَسَةَ مَشْهُورَةٌ بِجَوْدَةِ تَعْلِيمِ اللُّغَةِ العَرَبِيَّةِ وَالعُلُومِ الإِسْلَامِيَّةِ.',
    contentId: 'Ahmad: Assalamu alaikum wr. wb.\nFarid: Waalaikumussalam wr. wb.\nAhmad: Namaku Ahmad, saya siswa baru di Madrasah Aliyah Islam ini. Siapa namamu saudaraku?\nFarid: Selamat datang Ahmad! Namaku Farid, dan aku juga siswa baru di kelas sepuluh. Dari mana kamu berasal?\nAhmad: Aku datang dari kota Surabaya, dan sekarang tinggal di asrama madrasah. Dan kamu?\nFarid: Aku dari Bandung, dan tinggal bersama pamanku dekat dari madrasah. Apakah kamu senang belajar di sini?\nAhmad: Ya, aku sangat senang, karena madrasah ini terkenal dengan mutu pembelajaran bahasa Arab dan ilmu-ilmu Islam.',
    vocabulary: [
      { ar: 'طَالِبٌ جَدِيدٌ', id: 'Siswa baru', type: 'Isim' },
      { ar: 'السَّكَنُ المَدْرَسِيُّ', id: 'Asrama sekolah / madrasah', type: 'Isim' },
      { ar: 'جَوْدَةُ التَّعْلِيمِ', id: 'Kualitas / mutu pembelajaran', type: 'Isim' },
      { ar: 'مَسْرُورٌ', id: 'Gembira / senang', type: 'Isim' }
    ],
    questions: [
      {
        id: 'ist-q1',
        question: 'Siapakah yang berasal dari kota Surabaya?',
        options: ['Farid', 'Ahmad', 'Paman Farid', 'Guru Madrasah'],
        correctAnswer: 1,
        explanation: 'Dalam audio, Ahmad berkata: "جِئْتُ مِنْ مَدِينَةِ سُورَابَايَا" (Aku datang dari kota Surabaya).'
      },
      {
        id: 'ist-q2',
        question: 'Di manakah Farid tinggal saat ini?',
        options: ['Di asrama madrasah', 'Di hotel dekat stasiun', 'Di rumah pamannya dekat madrasah', 'Di kota Bandung'],
        correctAnswer: 2,
        explanation: 'Farid menjelaskan: "أَسْكُنُ مَعَ عَمِّي قَرِيبًا مِنَ المَدْرَسَةِ" (Aku tinggal bersama pamanku dekat dari madrasah).'
      },
      {
        id: 'ist-q3',
        question: 'Mengapa Ahmad merasa sangat senang belajar di madrasah ini?',
        options: [
          'Karena dekat dengan rumahnya',
          'Karena terkenal dengan mutu bahasa Arab dan ilmu Islam',
          'Karena biayanya sangat murah',
          'Karena liburnya panjang'
        ],
        correctAnswer: 1,
        explanation: 'Ahmad senang karena madrasah tersebut terkenal mutu bahasa Arab dan ilmu keislamannya.'
      }
    ],
    imlaExercises: [
      {
        id: 'imla-1',
        audioText: 'طَالِبٌ جَدِيدٌ فِي الفَصْلِ العَاشِرِ',
        expectedAr: 'طالب جديد في الفصل العاشر',
        hint: 'Siswa baru di kelas sepuluh'
      },
      {
        id: 'imla-2',
        audioText: 'السَّكَنُ المَدْرَسِيُّ قَرِيبٌ',
        expectedAr: 'السكن المدرسي قريب',
        hint: 'Asrama sekolah itu dekat'
      }
    ]
  },
  {
    id: 'istima-2',
    maharah: 'istima',
    grade: 'XI',
    level: 'Menengah',
    title: 'Teknologi Informasi dalam Kehidupan Siswa',
    titleAr: 'تِكْنُولُوجِيَا الإِعْلَامِ وَأَهَمِّيَّتُهَا فِي العَصْرِ الحَدِيثِ',
    description: 'Simak pidato pendek tentang pemanfaatan gawai dan internet positif bagi generasi muda madrasah.',
    audioDuration: '1:50',
    audioScript: 'أَيُّهَا الطُّلَّابُ الكِرَامُ، لَقَدْ أَصْبَحَتْ تِكْنُولُوجِيَا المَعْلُومَاتِ جُزْءًا لَا يَتَجَزَّأُ مِنْ حَيَاتِنَا اليَوْمِيَّةِ. إِنَّ الحَاسُوبَ وَالهَاتِفَ الذَّكِيَّ وَشَبَكَةَ الإِنْتَرْنِت سَهَّلَتْ لَنَا الحُصُولَ عَلَى المَعْرِفَةِ وَالتَّوَاصُلَ مَعَ الآخَرِينَ فِي جَمِيعِ أَنْحَاءِ العَالَمِ. وَلَكِنْ، يَجِبُ عَلَى كُلِّ طَالِبٍ أَنْ يَسْتَخْدِمَ هَذِهِ التِّكْنُولُوجِيَا فِي الخَيْرِ وَتَطْوِيرِ المَهَارَاتِ النَّافِعَةِ، وَأَنْ يَجْتَنِبَ الإِفْرَاطَ الَّذِي يُضَيِّعُ الأَوْقَاتِ الثَّمِينَةَ.',
    contentId: 'Wahai para siswa yang mulia, teknologi informasi kini telah menjadi bagian yang tak terpisahkan dari kehidupan sehari-hari kita. Komputer, telepon pintar, dan jaringan internet telah memudahkan kita memperoleh pengetahuan serta berkomunikasi dengan sesama di seluruh penjuru dunia. Akan tetapi, setiap siswa wajib menggunakan teknologi ini untuk kebaikan dan pengembangan keterampilan yang bermanfaat, serta menjauhi penggunaan berlebihan yang membuang-buang waktu berharga.',
    questions: [
      {
        id: 'ist2-q1',
        question: 'Apa dampak positif gawai dan internet menurut teks?',
        options: [
          'Membuat siswa tidur lebih cepat',
          'Memudahkan perolehan pengetahuan dan komunikasi global',
          'Menghilangkan kebutuhan akan buku fisik',
          'Mengurangi waktu belajar di kelas'
        ],
        correctAnswer: 1,
        explanation: 'Disebutkan: "سَهَّلَتْ لَنَا الحُصُولَ عَلَى المَعْرِفَةِ وَالتَّوَاصُلَ" (memudahkan memperoleh pengetahuan dan komunikasi).'
      },
      {
        id: 'ist2-q2',
        question: 'Peringatan apa yang ditekankan kepada para siswa?',
        options: [
          'Dilarang sama sekali menyentuh telepon pintar',
          'Menjauhi penggunaan berlebih yang menyia-nyiakan waktu',
          'Hanya boleh menggunakan internet saat hari libur',
          'Wajib membeli komputer terbaru'
        ],
        correctAnswer: 1,
        explanation: 'Teks memperingatkan: "أَنْ يَجْتَنِبَ الإِفْرَاطَ الَّذِي يُضَيِّعُ الأَوْقَاتِ الثَّمِينَةَ".'
      }
    ]
  },

  // ===================== MAHARAH KALAM =====================
  {
    id: 'kalam-1',
    maharah: 'kalam',
    grade: 'X',
    level: 'Dasar',
    title: 'Percakapan Sehari-hari: Di Perpustakaan Madrasah',
    titleAr: 'حِوَارٌ شَيِّقٌ فِي مَكْتَبَةِ المَدْرَسَةِ',
    description: 'Praktikkan dialog dua arah (role-play) dan latih pengucapan intonasi bahasa Arab dengan suara Anda.',
    dialogue: [
      {
        speaker: 'Fatimah',
        speakerRole: 'A',
        textAr: 'صَبَاحَ الخَيْرِ يَا عَائِشَة! إِلَى أَيْنَ تَذْهَبِينَ؟',
        textId: 'Selamat pagi Aisyah! Hendak ke mana engkau pergi?'
      },
      {
        speaker: 'Aisyah',
        speakerRole: 'B',
        textAr: 'صَبَاحَ النُّورِ يَا فَاطِمَة! أَنَا ذَاهِبَةٌ إِلَى مَكْتَبَةِ المَدْرَسَةِ.',
        textId: 'Selamat pagi Fatimah! Aku sedang menuju ke perpustakaan madrasah.'
      },
      {
        speaker: 'Fatimah',
        speakerRole: 'A',
        textAr: 'مَاذَا تُرِيدِينَ أَنْ تَقْرَئِي هُنَاكَ؟',
        textId: 'Apa yang ingin kamu baca di sana?'
      },
      {
        speaker: 'Aisyah',
        speakerRole: 'B',
        textAr: 'أُرِيدُ أَنْ أَسْتَعِيرَ كِتَابَ تَارِيخِ الحَضَارَةِ الإِسْلَامِيَّةِ وَمُعْجَمَ اللُّغَةِ العَرَبِيَّةِ.',
        textId: 'Aku ingin meminjam buku sejarah peradaban Islam dan kamus bahasa Arab.'
      },
      {
        speaker: 'Fatimah',
        speakerRole: 'A',
        textAr: 'عَظِيمٌ! هَلْ يُمْكِنُنِي أَنْ أُرَافِقَكِ؟ أَنَا أَيْضًا أَبْحَثُ عَنْ كِتَابِ النَّحْوِ.',
        textId: 'Luar biasa! Bolehkah aku menemanimu? Aku juga sedang mencari buku Nahwu.'
      },
      {
        speaker: 'Aisyah',
        speakerRole: 'B',
        textAr: 'بِكُلِّ سُرُورٍ! هَيَّا بِنَا نَدْخُلْ مَعًا.',
        textId: 'Dengan senang hati! Ayo kita masuk bersama-sama.'
      }
    ],
    speechPrompt: {
      situationAr: 'أَنْتَ فِي المَكْتَبَةِ وَتُرِيدُ اسْتِعَارَةَ كِتَابٍ، تَحَدَّثْ مَعَ أَمِينِ المَكْتَبَةِ.',
      situationId: 'Anda sedang di perpustakaan madrasah dan ingin meminjam buku pelajaran kepada pustakawan.',
      targetSentence: 'أُرِيدُ أَنْ أَسْتَعِيرَ كِتَابَ اللُّغَةِ العَرَبِيَّةِ لِلصَّفِّ العَاشِرِ لَوْ سَمَحْتَ.',
      tips: [
        'Ucapkan huruf ع (`Ain) dari tengah tenggorokan dengan jelas.',
        'Jaga mad (panjang) pada kata أُرِيْدُ dan عَاشِر.',
        'Gunakan intonasi sopan khas penuntut ilmu.'
      ]
    }
  },
  {
    id: 'kalam-2',
    maharah: 'kalam',
    grade: 'XI',
    level: 'Menengah',
    title: 'Menceritakan Cita-cita dan Masa Depan',
    titleAr: 'التَّعْبِيرُ الشَّفَهِيُّ: أُمْنِيَّتِي فِي المُسْتَقْبَلِ',
    description: 'Latihan berbicara mandiri (Ta\'bir Syafahi) mengenai cita-cita profesi yang diimpikan setelah lulus MA.',
    speechPrompt: {
      situationAr: 'تَحَدَّثْ عَنْ مِهْنَتِكَ المُفَضَّلَةِ فِي المُسْتَقْبَلِ وَسَبَبِ اخْتِيَارِهَا.',
      situationId: 'Kemukakan cita-cita profesimu di masa depan dan alasan mengapa kamu memilih profesi tersebut.',
      targetSentence: 'أَتَمَنَّى أَنْ أَكُونَ طَبِيبًا مَاهِرًا أَوْ مُدَرِّسًا لِأَخْدُمَ الدِّينَ وَالوَطَنَ.',
      tips: [
        'Bedakan bunyi ه (`ha`) dan ح (`ha`) pada kata أَكُونَ dan أَخْدُمَ.',
        'Sampaikan kalimat dengan lantang, percaya diri, dan tersenyum.'
      ]
    }
  },

  // ===================== MAHARAH QIRA'AH =====================
  {
    id: 'qiraah-1',
    maharah: 'qiraah',
    grade: 'X',
    level: 'Dasar',
    title: 'Kehidupan Madrasah Aliyah yang Berprestasi',
    titleAr: 'مَدْرَسَتِي العَالِيَةُ الإِسْلَامِيَّةُ الحَدِيثَةُ',
    description: 'Bacalah teks komprehensif tentang lingkungan madrasah, klik kata-kata bergaris bawah untuk melihat terjemahan dan irab.',
    readingParagraphs: [
      {
        ar: 'تَقَعُ مَدْرَسَتِي العَالِيَةُ الإِسْلَامِيَّةُ الحُكُومِيَّةُ فِي وَسَطِ المَدِينَةِ، وَهِيَ مَدْرَسَةٌ كَبِيرَةٌ وَجَمِيلَةٌ تُحِيطُ بِهَا الأَشْجَارُ الخَضْرَاءُ. يَتَعَلَّمُ فِيهَا مِئَاتُ الطُّلَّابِ وَالطَّالِبَاتِ الَّذِينَ يَأْتُونَ مِنْ مُخْتَلِفِ القُرَى وَالمُدُنِ لِطَلَبِ العِلْمِ الشَّرْعِيِّ وَالعُلُومِ الكَوْنِيَّةِ.',
        id: 'Madrasah Aliyah Negeri-ku terletak di pusat kota, ia adalah madrasah yang besar dan indah yang dikelilingi oleh pepohonan hijau. Di sana belajar ratusan siswa dan siswi yang datang dari berbagai desa dan kota untuk menuntut ilmu syariat serta ilmu pengetahuan umum.',
        notes: 'تَقَعُ (Fi\'il Mudhari\') + مَدْرَسَتِي (Fa\'il marfu\' dengan dhammah muqaddarah).'
      },
      {
        ar: 'فِي هَذِهِ المَدْرَسَةِ مَرَافِقُ مُتَعَدِّدَةٌ؛ مِنْهَا الفُصُولُ الدِّرَاسِيَّةُ المُنَظَّمَةُ، وَمُعْمَلُ اللُّغَاتِ، وَمُعْمَلُ الحَاسُوبِ، وَمَكْتَبَةٌ شَامِلَةٌ تَحْتَوِي عَلَى آلَافِ الكُتُبِ وَالمَرَاجِعِ القَيِّمَةِ. وَأَهَمُّ مِرْفَقٍ فِيهَا هُوَ المَسْجِدُ الجَامِعُ الَّذِي يُؤَدِّي فِيهِ الجَمِيعُ صَلَاةَ الظُّهْرِ وَالعَصْرِ جَمَاعَةً كُلَّ يَوْمٍ.',
        id: 'Di madrasah ini terdapat berbagai fasilitas; di antaranya ruang-ruang kelas yang tertata rapi, laboratorium bahasa, laboratorium komputer, dan perpustakaan lengkap yang memuat ribuan buku serta referensi berharga. Dan fasilitas terpenting di dalamnya adalah masjid jami\' tempat semuanya melaksanakan salat Zhuhur dan Ashar secara berjamaah setiap hari.',
        notes: 'مَرَافِقُ (Mubtada mu\'akhkhar) + فِي هَذِهِ المَدْرَسَةِ (Khabar muqaddam syibhul jumlah).'
      },
      {
        ar: 'يَهْتَمُّ الأَسَاتِذَةُ بِتَرْبِيَةِ أَخْلَاقِ التَّلَامِيذِ كَمَا يَهْتَمُّونَ بِتَدْرِيسِ اللُّغَةِ العَرَبِيَّةِ بِاعْتِبَارِهَا لُغَةَ القُرْآنِ الكَرِيمِ. لِذَلِكَ، تُنَظِّمُ المَدْرَسَةُ أَنْشِطَةً لُغَوِيَّةً مِثْلَ المُحَادَثَةِ اليَوْمِيَّةِ وَمُسَابَقَةِ الخَطَابَةِ وَالمَسْرَحِيَّاتِ العَرَبِيَّةِ، مِمَّا يَجْعَلُ الطُّلَّابَ مُتَمَيِّزِينَ فِي المَحَافِلِ الوَطَنِيَّةِ.',
        id: 'Para guru menaruh perhatian besar pada pembinaan akhlak para siswa sebagaimana mereka memperhatikan pengajaran bahasa Arab sebagai bahasa Al-Qur\'an yang mulia. Oleh karena itu, madrasah menyelenggarakan kegiatan kebahasaan seperti percakapan harian, lomba pidato, dan teater bahasa Arab, yang menjadikan siswa berprestasi di kancah nasional.',
        notes: 'يَهْتَمُّ الأَسَاتِذَةُ: Perhatikan fi\'il lazim yang berta\'addi dengan huruf jar (بِـ).'
      }
    ],
    vocabulary: [
      { ar: 'مَرَافِقُ مُتَعَدِّدَةٌ', id: 'Fasilitas yang beragam', type: 'Isim' },
      { ar: 'مُعْمَلُ اللُّغَاتِ', id: 'Laboratorium bahasa', type: 'Isim' },
      { ar: 'تُحِيطُ بِهَا', id: 'Mengelilinginya', type: 'Fi\'il' },
      { ar: 'مُتَمَيِّزِينَ', id: 'Orang-orang yang unggul / berprestasi', type: 'Isim' },
      { ar: 'العُلُومُ الكَوْنِيَّةُ', id: 'Ilmu-ilmu sains alamiah / umum', type: 'Isim' }
    ],
    questions: [
      {
        id: 'qir-1',
        question: 'Di manakah letak madrasah yang diceritakan?',
        options: ['Di tepi pantai', 'Di tengah kota', 'Di puncak gunung', 'Di luar negeri'],
        correctAnswer: 1,
        explanation: 'Disebutkan pada kalimat pertama: "تَقَعُ مَدْرَسَتِي ... فِي وَسَطِ المَدِينَةِ".'
      },
      {
        id: 'qir-2',
        question: 'Apa fasilitas terpenting yang menjadi pusat kegiatan ibadah berjamaah?',
        options: ['Laboratorium komputer', 'Masjid jami\' madrasah', 'Perpustakaan umum', 'Kantin sekolah'],
        correctAnswer: 1,
        explanation: 'Teks menyatakan: "وَأَهَمُّ مِرْفَقٍ فِيهَا هُوَ المَسْجِدُ الجَامِعُ".'
      },
      {
        id: 'qir-3',
        question: 'Program kebahasaan apa saja yang diselenggarakan untuk mengasah kemampuan siswa?',
        options: [
          'Percakapan harian, lomba pidato, dan drama Arab',
          'Hanya membaca terjemahan buku',
          'Menonton film tanpa latihan',
          'Lomba hafalan kamus saja'
        ],
        correctAnswer: 0,
        explanation: 'Disebutkan: "المُحَادَثَةِ اليَوْمِيَّةِ وَمُسَابَقَةِ الخَطَابَةِ وَالمَسْرَحِيَّاتِ العَرَبِيَّةِ".'
      }
    ]
  },
  {
    id: 'qiraah-2',
    maharah: 'qiraah',
    grade: 'XII',
    level: 'Lanjutan',
    title: 'Kebangkitan Sains dalam Peradaban Islam',
    titleAr: 'الحَضَارَةُ الإِسْلَامِيَّةُ وَرُوَّادُ العِلْمِ وَالمَعْرِفَةِ',
    description: 'Analisis teks ilmiah peradaban Islam: peran Baitul Hikmah dan ilmuwan muslim dalam kemajuan dunia.',
    readingParagraphs: [
      {
        ar: 'شَهِدَتِ الحَضَارَةُ الإِسْلَامِيَّةُ عَصْرًا ذَهَبِيًّا ازْدَهَرَتْ فِيهِ العُلُومُ وَالفُنُونُ وَالمَعَارِفُ. وَكَانَتْ مَدِينَةُ بَغْدَادَ وَالقَاهِرَةُ وَقُرْطُبَةُ مَنَارَاتٍ لِلْعِلْمِ يَقْصِدُهَا طُلَّابُ المَعْرِفَةِ مِنْ شَتَّى بِقَاعِ الأَرْضِ. وَأَسَّسَ الخَلِيفَةُ المَأْمُونُ "بَيْتَ الحِكْمَةِ" الَّذِي كَانَ أَعْظَمَ مَرْكَزٍ لِلتَّرْجَمَةِ وَالبَحْثِ العِلْمِيِّ فِي ذَلِكَ الزَّمَانِ.',
        id: 'Peradaban Islam menyaksikan era keemasan di mana ilmu pengetahuan, kesenian, dan sains berkembang pesat. Kota Baghdad, Kairo, dan Kordoba menjadi lentera ilmu yang dituju para penuntut ilmu dari berbagai penjuru bumi. Khalifah Al-Ma\'mun mendirikan "Baitul Hikmah" yang merupakan pusat penerjemahan dan riset ilmiah terbesar di masa itu.',
        notes: 'بَيْتَ الحِكْمَةِ (Maf\'ul bih manshub dengan fathah).'
      }
    ],
    vocabulary: [
      { ar: 'عَصْرٌ ذَهَبِيٌّ', id: 'Zaman keemasan', type: 'Isim' },
      { ar: 'مَنَارَاتُ العِلْمِ', id: 'Menara-menara / mercusuar ilmu', type: 'Isim' },
      { ar: 'شَتَّى بِقَاعِ الأَرْضِ', id: 'Berbagai pelosok bumi', type: 'Isim' }
    ],
    questions: [
      {
        id: 'qir2-1',
        question: 'Siapakah khalifah yang mendirikan lembaga Baitul Hikmah?',
        options: ['Harun Ar-Rasyid', 'Al-Makmun', 'Umar bin Abdul Aziz', 'Shalahuddin Al-Ayyubi'],
        correctAnswer: 1,
        explanation: 'Tertulis jelas dalam teks: "وَأَسَّسَ الخَلِيفَةُ المَأْمُونُ بَيْتَ الحِكْمَةِ".'
      }
    ]
  },

  // ===================== MAHARAH KITABAH =====================
  {
    id: 'kitabah-1',
    maharah: 'kitabah',
    grade: 'X',
    level: 'Dasar',
    title: 'Tartib Al-Kalimat & Insya\' Muwajjah',
    titleAr: 'تَرْتِيبُ الكَلِمَاتِ وَالإِنْشَاءُ المُوَجَّهُ',
    description: 'Susun kata acak menjadi kalimat sempurna, koreksi kesalahan ejaan, dan tulis paragraf pendek dengan koreksi AI langsung.',
    arrangeExercises: [
      {
        id: 'arr-1',
        jumbledWords: ['إِلَى', 'يَذْهَبُ', 'كُلَّ', 'المَدْرَسَةِ', 'صَبَاحٍ', 'الطَّالِبُ'],
        correctSentence: 'يَذْهَبُ الطَّالِبُ إِلَى المَدْرَسَةِ كُلَّ صَبَاحٍ',
        translation: 'Siswa itu pergi ke madrasah setiap pagi.'
      },
      {
        id: 'arr-2',
        jumbledWords: ['فِي', 'قَرَأَتْ', 'الكِتَابَ', 'عَائِشَةُ', 'المَكْتَبَةِ'],
        correctSentence: 'قَرَأَتْ عَائِشَةُ الكِتَابَ فِي المَكْتَبَةِ',
        translation: 'Aisyah membaca buku itu di perpustakaan.'
      },
      {
        id: 'arr-3',
        jumbledWords: ['العَرَبِيَّةُ', 'اللُّغَةُ', 'القُرْآنِ', 'لُغَةُ', 'الكَرِيمِ'],
        correctSentence: 'اللُّغَةُ العَرَبِيَّةُ لُغَةُ القُرْآنِ الكَرِيمِ',
        translation: 'Bahasa Arab adalah bahasa Al-Qur\'an yang mulia.'
      }
    ],
    writingTopic: {
      topicAr: 'وَصْفُ مَدْرَسَتِي العَالِيَةِ الإِسْلَامِيَّةِ',
      topicId: 'Deskripsikan madrasah aliyah tempatmu belajar (lokasi, gedung, guru, dan aktivitas favoritmu)',
      guidelines: [
        'Gunakan minimal 3-5 kalimat berstruktur jumlah ismiyyah atau fi\'liyyah.',
        'Sertakan kosakata: مَدْرَسَة (madrasah), أُسْتَاذ (guru), أَتَعَلَّمُ (aku belajar), مَسْرُور (senang).',
        'Pastikan mencocokkan fi\'il dengan fa\'il (mudzakkar/muannats).'
      ],
      sampleEssay: 'أَنَا أَدْرُسُ فِي المَدْرَسَةِ العَالِيَةِ الإِسْلَامِيَّةِ. مَدْرَسَتِي كَبِيرَةٌ وَجَمِيلَةٌ جِدًّا. فِيهَا فَصْلٌ وَاسِعٌ وَمَكْتَبَةٌ نَظِيفَةٌ. الأَسَاتِذَةُ يُعَلِّمُونَنَا بِإِخْلَاصٍ وَمَحَبَّةٍ، وَأَنَا أُحِبُّ تَعَلُّمَ اللُّغَةِ العَرَبِيَّةِ مَعَ أَصْدِقَائِي كُلَّ يَوْمٍ.'
    }
  },
  {
    id: 'kitabah-2',
    maharah: 'kitabah',
    grade: 'XI',
    level: 'Menengah',
    title: 'Menulis Surat Resmi & Esai Pendek',
    titleAr: 'كِتَابَةُ الرِّسَالَةِ وَالمَقَالَةِ الإِنْشَائِيَّةِ',
    description: 'Latihan menulis terarah tentang cita-cita atau kegiatan ekstrakurikuler madrasah dengan bantuan Keyboard Arab & Review AI.',
    arrangeExercises: [
      {
        id: 'arr-4',
        jumbledWords: ['أَنْ', 'أَكُونَ', 'أَتَمَنَّى', 'طَبِيبًا', 'مُسْتَقْبَلًا'],
        correctSentence: 'أَتَمَنَّى أَنْ أَكُونَ طَبِيبًا مُسْتَقْبَلًا',
        translation: 'Aku berharap menjadi seorang dokter di masa depan.'
      }
    ],
    writingTopic: {
      topicAr: 'أَهَمِّيَّةُ اللُّغَةِ العَرَبِيَّةِ فِي العَصْرِ الحَدِيثِ',
      topicId: 'Tulis esai singkat tentang urgensi menguasai bahasa Arab di zaman sekarang',
      guidelines: [
        'Jelaskan alasan keagamaan (bahasa ibadah) dan alasan intelektual/diplomatik.',
        'Gunakan kata sambung: لِأَنَّ (karena), كَمَا أَنَّ (sebagaimana juga), لِذَلِكَ (oleh karena itu).'
      ]
    }
  }
];

// ===================== MODUL QAWA'ID (NAHWU & SHARAF MA) =====================
export interface GrammarTopic {
  id: string;
  category: 'Nahwu' | 'Sharaf';
  title: string;
  titleAr: string;
  summary: string;
  rules: { rule: string; exampleAr: string; exampleId: string; analysis: string }[];
  tasrifTable?: {
    dhamir: string;
    dhamirMeaning: string;
    madhi: string;
    mudhari: string;
    amr: string;
  }[];
}

export const QAWAID_TOPICS: GrammarTopic[] = [
  {
    id: 'qaw-1',
    category: 'Nahwu',
    title: 'Pembagian Kata: Isim, Fi\'il, dan Harf',
    titleAr: 'أَقْسَامُ الكَلِمَةِ: الاِسْمُ وَالفِعْلُ وَالحَرْفُ',
    summary: 'Setiap kata dalam bahasa Arab terbagi menjadi tiga jenis fundamental dengan ciri khas masing-masing.',
    rules: [
      {
        rule: 'الاِسْمُ (Kata Benda/Sifat): Kata yang memiliki makna mandiri tanpa terikat waktu. Tanda-tandanya: menerima Tanwin, Alif Lam (ال), Huruf Jar, dan Kasrah.',
        exampleAr: 'المَدْرَسَةُ نَظِيفَةٌ، كَتَبْتُ بِالقَلَمِ',
        exampleId: 'Madrasah itu bersih, aku menulis dengan pena.',
        analysis: 'المَدْرَسَةُ memiliki tanda Al (ال), بِالقَلَمِ diawali huruf jar (بِـ) dan berharakat kasrah.'
      },
      {
        rule: 'الفِعْلُ (Kata Kerja): Kata yang menunjukkan kejadian pada waktu tertentu (Mādhī = lampau, Mudhāri\' = sekarang/akan datang, Amr = perintah).',
        exampleAr: 'قَرَأَ الطَّالِبُ الكِتَابَ (Lampau) - يَكْتُبُ الدَّرْسَ (Sedang/Akan)',
        exampleId: 'Siswa itu telah membaca buku - Dia sedang menulis pelajaran.',
        analysis: 'قَرَأَ adalah Fi\'il Madhi mabni \'ala fath, sedangkan يَكْتُبُ adalah Fi\'il Mudhari\' marfu\'.'
      },
      {
        rule: 'الحَرْفُ (Kata Tugas): Kata penghubung yang tidak memiliki arti sempurna kecuali bersambung dengan kata lain (contoh: فِي, مِنْ, إِلَى, عَلَى, لَمْ, لَنْ).',
        exampleAr: 'ذَهَبْتُ إِلَى المَسْجِدِ',
        exampleId: 'Aku pergi ke masjid.',
        analysis: 'إِلَى adalah huruf jar yang memajrurkan isim setelahnya (المَسْجِدِ).'
      }
    ]
  },
  {
    id: 'qaw-2',
    category: 'Nahwu',
    title: 'Jumlah Ismiyyah: Mubtada\' dan Khabar',
    titleAr: 'الجُمْلَةُ الاِسْمِيَّةُ: المُبْتَدَأُ وَالخَبَرُ',
    summary: 'Kalimat yang diawali dengan isim. Terdiri dari Mubtada\' (subjek) dan Khabar (predikat), keduanya berhukum Marfu\'.',
    rules: [
      {
        rule: 'Kaidah Keselarasan: Khabar harus selaras dengan Mubtada\' dalam hal bilangan (Mufrad, Tatsniyah, Jamak) dan jenis (Mudzakkar / Muannats).',
        exampleAr: 'الطَّالِبُ مُجْتَهِدٌ / الطَّالِبَةُ مُجْتَهِدَةٌ',
        exampleId: 'Siswa itu rajin / Siswi itu rajin.',
        analysis: 'الطَّالِبُ: Mubtada\' marfu\' bil-dhammah. مُجْتَهِدٌ: Khabar marfu\' bil-dhammah.'
      },
      {
        rule: 'Khabar Syibhul Jumlah: Khabar yang tersusun dari jar-majrur atau zharaf-mazhruf.',
        exampleAr: 'الكِتَابُ فَوْقَ المَكْتَبِ / العُصْفُورُ عَلَى الشَّجَرَةِ',
        exampleId: 'Buku itu di atas meja / Burung itu di atas pohon.',
        analysis: 'فَوْقَ المَكْتَبِ menempati posisi rafa\' sebagai khabar bagi الكِتَابُ.'
      }
    ]
  },
  {
    id: 'qaw-3',
    category: 'Sharaf',
    title: 'Tashrif Lughawi Fi\'il Tsulatsi Mujarrad (فَعَلَ - يَفْعَلُ)',
    titleAr: 'التَّصْرِيفُ اللُّغَوِيُّ لِلْفِعْلِ الثُّلَاثِيِّ المُجَرَّدِ',
    summary: 'Perubahan bentuk fi\'il berdasarkan 14 dhomir (kata ganti subjek).',
    rules: [],
    tasrifTable: [
      { dhamir: 'هُوَ', dhamirMeaning: 'Dia (1 lk)', madhi: 'كَتَبَ', mudhari: 'يَكْتُبُ', amr: '-' },
      { dhamir: 'هُمَا', dhamirMeaning: 'Mereka (2 lk)', madhi: 'كَتَبَا', mudhari: 'يَكْتُبَانِ', amr: '-' },
      { dhamir: 'هُمْ', dhamirMeaning: 'Mereka (>2 lk)', madhi: 'كَتَبُوا', mudhari: 'يَكْتُبُونَ', amr: '-' },
      { dhamir: 'هِيَ', dhamirMeaning: 'Dia (1 pr)', madhi: 'كَتَبَتْ', mudhari: 'تَكْتُبُ', amr: '-' },
      { dhamir: 'هُمَا', dhamirMeaning: 'Mereka (2 pr)', madhi: 'كَتَبَتَا', mudhari: 'تَكْتُبَانِ', amr: '-' },
      { dhamir: 'هُنَّ', dhamirMeaning: 'Mereka (>2 pr)', madhi: 'كَتَبْنَ', mudhari: 'يَكْتُبْنَ', amr: '-' },
      { dhamir: 'أَنْتَ', dhamirMeaning: 'Kamu (1 lk)', madhi: 'كَتَبْتَ', mudhari: 'تَكْتُبُ', amr: 'اُكْتُبْ' },
      { dhamir: 'أَنْتُمَا', dhamirMeaning: 'Kalian (2 lk)', madhi: 'كَتَبْتُمَا', mudhari: 'تَكْتُبَانِ', amr: 'اُكْتُبَا' },
      { dhamir: 'أَنْتُمْ', dhamirMeaning: 'Kalian (>2 lk)', madhi: 'كَتَبْتُمْ', mudhari: 'تَكْتُبُونَ', amr: 'اُكْتُبُوا' },
      { dhamir: 'أَنْتِ', dhamirMeaning: 'Kamu (1 pr)', madhi: 'كَتَبْتِ', mudhari: 'تَكْتُبِينَ', amr: 'اُكْتُبِي' },
      { dhamir: 'أَنْتُنَّ', dhamirMeaning: 'Kalian (>2 pr)', madhi: 'كَتَبْتُنَّ', mudhari: 'تَكْتُبْنَ', amr: 'اُكْتُبْنَ' },
      { dhamir: 'أَنَا', dhamirMeaning: 'Saya', madhi: 'كَتَبْتُ', mudhari: 'أَكْتُبُ', amr: '-' },
      { dhamir: 'نَحْنُ', dhamirMeaning: 'Kami / Kita', madhi: 'كَتَبْنَا', mudhari: 'نَكْتُبُ', amr: '-' }
    ]
  }
];

// ===================== KAMUS MUFRADAT TEMATIK =====================
export const THEMATIC_VOCABULARY: VocabWord[] = [
  // Madrasah & Kelas
  { ar: 'مَدْرَسَةٌ عَالِيَةٌ', id: 'Madrasah Aliyah / SMA Islam', category: 'Madrasah', type: 'Isim', plural: 'مَدَارِسُ عَالِيَةٌ', exampleAr: 'أَدْرُسُ فِي المَدْرَسَةِ العَالِيَةِ الإِسْلَامِيَّةِ الحُكُومِيَّةِ.', exampleId: 'Aku belajar di Madrasah Aliyah Negeri.' },
  { ar: 'أُسْتَاذٌ / مُدَرِّسٌ', id: 'Guru / Ustadz', category: 'Madrasah', type: 'Isim', plural: 'أَسَاتِذَةٌ / مُدَرِّسُونَ', exampleAr: 'الأُسْتَاذُ يَشْرَحُ الدَّرْسَ فِي الفَصْلِ.', exampleId: 'Ustadz menerangkan pelajaran di kelas.' },
  { ar: 'مَكْتَبَةٌ شَامِلَةٌ', id: 'Perpustakaan lengkap', category: 'Madrasah', type: 'Isim', plural: 'مَكْتَبَاتٌ', exampleAr: 'أَسْتَعِيرُ الكِتَابَ مِنَ المَكْتَبَةِ.', exampleId: 'Saya meminjam buku dari perpustakaan.' },
  { ar: 'مُعْمَلُ اللُّغَاتِ', id: 'Laboratorium bahasa', category: 'Madrasah', type: 'Isim', exampleAr: 'نَتَدَرَّبُ عَلَى الِاسْتِمَاعِ فِي مُعْمَلِ اللُّغَاتِ.', exampleId: 'Kami berlatih mendengar di lab bahasa.' },
  { ar: 'سَكَنٌ طُلَّابِيٌّ', id: 'Asrama santri / pondok', category: 'Madrasah', type: 'Isim', plural: 'مَسَاكِنُ', exampleAr: 'يَسْكُنُ أَحْمَدُ فِي السَّكَنِ المَدْرَسِيِّ.', exampleId: 'Ahmad tinggal di asrama madrasah.' },
  { ar: 'جَدْوَلُ الحِصَصِ', id: 'Jadwal pelajaran', category: 'Madrasah', type: 'Isim', exampleAr: 'حِصَّةُ اللُّغَةِ العَرَبِيَّةِ فِي يَوْمِ الإِثْنَيْنِ.', exampleId: 'Jam pelajaran bahasa Arab di hari Senin.' },

  // Aktivitas & Kata Kerja
  { ar: 'يَتَعَلَّمُ - تَعَلَّمَ', id: 'Belajar', category: 'Aktivitas', type: 'Fi\'il', exampleAr: 'نَتَعَلَّمُ قَوَاعِدَ اللُّغَةِ العَرَبِيَّةِ.', exampleId: 'Kami mempelajari kaidah bahasa Arab.' },
  { ar: 'يَقْرَأُ - قَرَأَ', id: 'Membaca', category: 'Aktivitas', type: 'Fi\'il', exampleAr: 'يَقْرَأُ الطَّالِبُ القُرْآنَ الكَرِيمَ بَعْدَ الصَّلَاةِ.', exampleId: 'Siswa membaca Al-Qur\'an setelah salat.' },
  { ar: 'يَكْتُبُ - كَتَبَ', id: 'Menulis', category: 'Aktivitas', type: 'Fi\'il', exampleAr: 'كَتَبْتُ وَاجِبًا مَنْزِلِيًّا فِي الدَّفْتَرِ.', exampleId: 'Aku menulis pekerjaan rumah di buku tulis.' },
  { ar: 'يَتَحَدَّثُ - تَحَدَّثَ', id: 'Berbicara / Bertutur', category: 'Aktivitas', type: 'Fi\'il', exampleAr: 'يَتَحَدَّثُ فَاطِمَةُ بِاللُّغَةِ الفُصْحَى.', exampleId: 'Fatimah berbicara dengan bahasa fusha.' },
  { ar: 'يَسْتَمِعُ - اسْتَمَعَ', id: 'Mendengarkan / Menyimak', category: 'Aktivitas', type: 'Fi\'il', exampleAr: 'اِسْتَمَعْتُ إِلَى الأَخْبَارِ العَرَبِيَّةِ.', exampleId: 'Aku mendengarkan berita berbahasa Arab.' },
  { ar: 'يُنَاقِشُ - نَاقَشَ', id: 'Berdiskusi', category: 'Aktivitas', type: 'Fi\'il', exampleAr: 'يُنَاقِشُ الطُّلَّابُ مَوْضُوعَ البَحْثِ.', exampleId: 'Para siswa mendiskusikan topik riset.' },

  // Teknologi & Modernitas
  { ar: 'هَاتِفٌ ذَكِيٌّ', id: 'Ponsel pintar / Smartphone', category: 'Teknologi', type: 'Isim', plural: 'هَوَاتِفُ ذَكِيَّةٌ', exampleAr: 'يَسْتَخْدِمُ الطَّالِبُ الهَاتِفَ لِلْبَحْثِ العِلْمِيِّ.', exampleId: 'Siswa menggunakan smartphone untuk riset ilmiah.' },
  { ar: 'شَبَكَةُ الإِنْتَرْنِت', id: 'Jaringan internet', category: 'Teknologi', type: 'Isim', exampleAr: 'الإِنْتَرْنِت يَفْتَحُ آفَاقَ المَعْرِفَةِ.', exampleId: 'Internet membuka cakrawala pengetahuan.' },
  { ar: 'حَاسُوبٌ مَحْمُولٌ', id: 'Laptop / Komputer jinjing', category: 'Teknologi', type: 'Isim', plural: 'حَوَاسِيبُ', exampleAr: 'كَتَبْتُ المَقَالَةَ عَلَى الحَاسُوبِ.', exampleId: 'Aku mengetik makalah di laptop.' },

  // Karakter & Akhlak
  { ar: 'مُجْتَهِدٌ', id: 'Rajin / Bersungguh-sungguh', category: 'Akhlak', type: 'Isim', plural: 'مُجْتَهِدُونَ', exampleAr: 'مَنْ جَدَّ وَجَدَ، فَكُنْ طَالِبًا مُجْتَهِدًا.', exampleId: 'Barangsiapa bersungguh-sungguh ia dapat, jadilah siswa yang rajin.' },
  { ar: 'أَمَانَةٌ وَصِدْقٌ', id: 'Amanah & Kejujuran', category: 'Akhlak', type: 'Isim', exampleAr: 'الصِّدْقُ يَهْدِي إِلَى البِرِّ.', exampleId: 'Kejujuran menuntun menuju kebaikan.' },
  { ar: 'تَعَاوُنٌ مُثْمِرٌ', id: 'Kerjasama yang produktif', category: 'Akhlak', type: 'Isim', exampleAr: 'تَعَاوَنُوا عَلَى البِرِّ وَالتَّقْوَى.', exampleId: 'Tolong-menolonglah kalian dalam kebajikan dan taqwa.' }
];

// ===================== SIMULASI ASESMEN MADRASAH (BANK SOAL MA) =====================
export const EXAM_QUESTIONS = [
  {
    id: 'ex-1',
    maharah: 'istima',
    questionAr: 'أَيُّ هَذِهِ الكَلِمَاتِ تَدُلُّ عَلَى اسْمِ مَكَانٍ لِلدِّرَاسَةِ؟',
    question: 'Manakah kata berikut yang menunjukkan tempat belajar di madrasah?',
    options: ['المَسْجِدُ', 'الفَصْلُ الدِّرَاسِيُّ', 'السُّوقُ التِّجَارِيُّ', 'المُسْتَشْفَى'],
    correctAnswer: 1,
    explanation: 'الفَصْلُ الدِّرَاسِيُّ bermakna ruang kelas/tempat belajar.'
  },
  {
    id: 'ex-2',
    maharah: 'qiraah',
    questionAr: 'تَقَعُ "مَدْرَسَتِي" فِي وَسَطِ المَدِينَةِ. مَا مَوْقِعُ كَلِمَةِ "مَدْرَسَتِي" مِنَ الإِعْرَابِ؟',
    question: 'Pada kalimat "تَقَعُ مَدْرَسَتِي فِي وَسَطِ المَدِينَةِ", apa kedudukan kata "مَدْرَسَتِي" dalam i\'rab?',
    options: ['مُبْتَدَأٌ مَرْفُوعٌ', 'فَاعِلٌ مَرْفُوعٌ', 'مَفْعُولٌ بِهِ مَنْصُوبٌ', 'خَبَرٌ مَرْفُوعٌ'],
    correctAnswer: 1,
    explanation: 'مَدْرَسَتِي adalah Fa\'il (pelaku) dari fi\'il تَقَعُ.'
  },
  {
    id: 'ex-3',
    maharah: 'qawaid',
    questionAr: 'عَيِّنِ الجُمْلَةَ الاِسْمِيَّةَ الصَّحِيحَةَ فِيمَا يَلِي:',
    question: 'Tentukan kalimat Jumlah Ismiyyah yang benar berikut ini:',
    options: [
      'ذَهَبَ أَحْمَدُ إِلَى المَدْرَسَةِ',
      'الطَّالِبَاتُ مُجْتَهِدَاتٌ فِي تَعَلُّمِ العَرَبِيَّةِ',
      'يَقْرَأُ الإِمَامُ القُرْآنَ فِي المَسْجِدِ',
      'فِي المَكْتَبَةِ كُتُبٌ كَثِيرَةٌ'
    ],
    correctAnswer: 1,
    explanation: 'الطَّالِبَاتُ مُجْتَهِدَاتٌ diawali isim (الطالبات) sebagai mubtada\' dan khabar-nya mujtahidat.'
  },
  {
    id: 'ex-4',
    maharah: 'kalam',
    questionAr: 'إِذَا قَالَ لَكَ صَدِيقُكَ: "أَهْلًا وَسَهْلًا يَا أَخِي!"، فَمَاذَا تُجِيبُهُ؟',
    question: 'Jika temanmu menyapamu: "أَهْلًا وَسَهْلًا يَا أَخِي!" (Selamat datang wahai saudaraku!), bagaimana jawaban yang tepat?',
    options: ['مَعَ السَّلَامَةِ', 'أَهْلًا بِكَ', 'شُكْرًا عَفْوًا', 'إِلَى اللِّقَاءِ'],
    correctAnswer: 1,
    explanation: 'Jawaban balasan untuk أهلاً وسهلاً adalah أهلاً بك (Ahlan bik).'
  },
  {
    id: 'ex-5',
    maharah: 'kitabah',
    questionAr: 'رَتِّبِ الكَلِمَاتِ الآتِيَةَ: (يَقْرَأُ - فِي - الكِتَابَ - الفَصْلِ - زَيْدٌ)',
    question: 'Susunan kalimat yang tepat dari kata acak: (يَقْرَأُ - فِي - الكِتَابَ - الفَصْلِ - زَيْدٌ) adalah:',
    options: [
      'فِي زَيْدٌ يَقْرَأُ الكِتَابَ الفَصْلِ',
      'يَقْرَأُ زَيْدٌ الكِتَابَ فِي الفَصْلِ',
      'الكِتَابَ زَيْدٌ فِي الفَصْلِ يَقْرَأُ',
      'يَقْرَأُ فِي الفَصْلِ الكِتَابَ زَيْدٌ'
    ],
    correctAnswer: 1,
    explanation: 'Urutan jumlah fi\'liyyah yang paling fasih: Fi\'il (يقرأ) + Fa\'il (زيد) + Maf\'ul bih (الكتاب) + Keterangan (في الفصل).'
  },
  {
    id: 'ex-6',
    maharah: 'qawaid',
    questionAr: 'مَا التَّصْرِيفُ المُنَاسِبُ لِلْفِعْلِ (كَتَبَ) مَعَ الضَّمِيرِ (أَنْتُمْ) فِي الفِعْلِ المُضَارِعِ؟',
    question: 'Bentuk fi\'il mudhari\' dari (كَتَبَ) untuk dhomir (أَنْتُمْ - Kalian laki-laki) adalah:',
    options: ['يَكْتُبُونَ', 'تَكْتُبُونَ', 'كَتَبْتُمْ', 'أَكْتُبُ'],
    correctAnswer: 1,
    explanation: 'Dhamir أنتم dalam fi\'il mudhari\' menggunakan awalan تـ dan akhiran ون (تَكْتُبُونَ).'
  },
  {
    id: 'ex-7',
    maharah: 'qiraah',
    questionAr: 'مَا مَعْنَى كَلِمَةِ "عَصْرٌ ذَهَبِيٌّ" فِي السِّيَاقِ التَّارِيخِيِّ؟',
    question: 'Apa arti istilah "عَصْرٌ ذَهَبِيٌّ" dalam konteks sejarah peradaban Islam?',
    options: ['Zaman logam mulia', 'Masa kemunduran dan krisis', 'Zaman keemasan dan kejayaan ilmu', 'Masa penjajahan kuno'],
    correctAnswer: 2,
    explanation: '"عَصْرٌ ذَهَبِيٌّ" secara metafora bermakna era keemasan/kejayaan sains dan peradaban.'
  },
  {
    id: 'ex-8',
    maharah: 'istima',
    questionAr: 'أَيُّ جُمْلَةٍ تُعَبِّرُ عَنِ الِاعْتِذَارِ بِأُسْلُوبٍ مُؤَدَّبٍ؟',
    question: 'Kalimat manakah yang mengungkapkan permohonan maaf secara santun?',
    options: ['عَفْوًا يَا أُسْتَاذُ، أَنَا آسِفٌ لِلتَّأَخُّرِ', 'تَفَضَّلْ بِالدُّخُولِ يَا أَخِي', 'كَيْفَ حَالُكَ اليَوْمَ؟', 'مَبْرُوكٌ عَلَى النَّجَاحِ'],
    correctAnswer: 0,
    explanation: '"أَنَا آسِفٌ" (Saya minta maaf) digunakan untuk menyatakan permohonan maaf (i\'tidzar).'
  }
];
