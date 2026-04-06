export default function Footer() {
  return (
    <footer className="bg-secondary-container dark:bg-yellow-500 border-t-[3px] border-black flex flex-col md:flex-row justify-between items-center px-8 py-6 w-full mt-20">
      <div className="font-black text-xs uppercase tracking-[0.2em] text-black">
        ©2024 PRECISION_BRUTALISM_CLUB
      </div>
      <div className="flex gap-10 mt-6 md:mt-0 font-black text-xs uppercase tracking-[0.2em]">
        <a className="text-black hover:text-primary transition-colors underline decoration-2 underline-offset-4" href="#">GitHub</a>
        <a className="text-black hover:text-primary transition-colors underline decoration-2 underline-offset-4" href="#">LinkedIn</a>
        <a className="text-black hover:text-primary transition-colors underline decoration-2 underline-offset-4" href="#">Club Info</a>
      </div>
      <div className="hidden md:block bg-black text-white px-4 py-2 border-[2px] border-white neo-shadow">
        <span className="text-[0.6rem] font-black uppercase tracking-widest">ACCESS_CODE: 771-K-DIR</span>
      </div>
    </footer>
  );
}
