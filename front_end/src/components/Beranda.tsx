interface BerandaProps {
  onOpenForm: () => void;
}

export default function Beranda({ onOpenForm }: BerandaProps) {
  return (
    <section id="beranda" className="bg-gradient-to-br from-blue-50 to-white py-20 sm:py-24 lg:py-32 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6">
          Pengembangan Sumber Daya Kesehatan
          <span className="block text-blue-600">Dinas Kesehatan Kota Makassar</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Pengawasan Sumber Daya Kesehatan - Melayani masyarakat dalam bidang 
          perizinan dan persuratan kesehatan dengan profesional dan transparan
        </p>
        <div className="mt-8">
          <button
            onClick={onOpenForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            Ajukan Perizinan Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
