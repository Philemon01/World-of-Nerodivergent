export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 relative pt-16 pb-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-rainbow-gradient" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rainbow-gradient rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              W
            </div>
            <span className="font-bold text-lg text-brand-dark">
              World of <span className="text-rainbow-gradient">Neurodivergent</span>
            </span>
          </div>
          
          <div className="flex gap-8 text-slate-500 text-sm">
            <a href="#" className="hover:text-rainbow-blue transition-colors font-medium">Privacy Policy</a>
            <a href="#" className="hover:text-rainbow-blue transition-colors font-medium">Terms of Service</a>
            <a href="#" className="hover:text-rainbow-blue transition-colors font-medium">Contact</a>
          </div>

          <div className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} World of Neurodivergent. Created by Gauri Thakkar.
          </div>
        </div>
      </div>
    </footer>
  );
}
