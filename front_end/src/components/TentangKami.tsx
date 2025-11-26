export default function TentangKami() {
  return (
    <section id="profil" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">Tentang Kami</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">
              Profil Bidang PSDK
            </h3>
            <div className="space-y-4 text-sm sm:text-base text-gray-600">
              <p>
                Bidang Pengawasan Sumber Daya Kesehatan (PSDK) bertanggung jawab 
                dalam pengawasan dan regulasi sumber daya kesehatan di wilayah 
                kerja Dinas Kesehatan.
              </p>
              <p>
                Kami memberikan pelayanan perizinan bagi tenaga kesehatan, 
                sarana kesehatan, dan alat kesehatan untuk menjamin mutu 
                pelayanan kesehatan yang optimal.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Visi & Misi</h3>
            <div className="space-y-4 text-sm sm:text-base">
              <div>
                <h4 className="font-semibold text-lg mb-2">Visi</h4>
                <p>
                  Terwujudnya sistem pengawasan sumber daya kesehatan 
                  yang efektif dan efisien untuk mendukung pelayanan kesehatan 
                  yang berkualitas.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Misi</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Melaksanakan pengawasan sumber daya kesehatan secara profesional</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Memberikan pelayanan perizinan yang cepat dan transparan</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Meningkatkan mutu pelayanan kesehatan masyarakat</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
