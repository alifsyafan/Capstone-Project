export default function Kontak() {
  return (
    <section id="kontak" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">Hubungi Kami</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Butuh bantuan atau informasi lebih lanjut? Jangan ragu untuk menghubungi kami
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Alamat</h3>
            <p className="text-gray-600">Jl. Teduh Bersinar No.1, Gn. Sari <br />Kecamatan Rappocini<br />Kota Makassar<br />Sulawesi Selatan 90221</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Telepon</h3>
            <p className="text-gray-600 mb-2">(0411) 881549</p>
            <p className="text-sm text-gray-500 mt-2">Senin - Jumat: 08:00 - 16:00</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Email</h3>
            <p className="text-blue-600 font-medium break-all mb-2">psdkdinkeskotamakassar@gmail.com</p>
            <p className="text-sm text-gray-500 mt-2">Respon dalam 1x24 jam</p>
          </div>
        </div>
      </div>
    </section>
  );
}
