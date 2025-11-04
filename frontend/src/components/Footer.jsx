export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white/70 backdrop-blur">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-6 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} মনবন্ধু. সব অধিকার সংরক্ষিত।</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-mainPink" href="#">গোপনীয়তা নীতি</a>
          <a className="hover:text-mainPink" href="#">শর্তাবলী</a>
        </div>
      </div>
    </footer>
  )
}


