import Link from 'next/link';
import { Car, GitBranch, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-700/50 bg-slate-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold">Gamage</span>
                <p className="text-blue-400 text-xs font-medium tracking-wider">VEHICLE RENTAL</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Premium vehicle rental services by Malinda Gamage. Cars, vans, electric vehicles, and motorbikes — all at competitive daily rates.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[['/', 'Home'], ['/customer', 'Browse Fleet'], ['/reservations', 'My Bookings'], ['/admin', 'Admin Portal']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-blue-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +94711451023</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> pkgmalinda@gmail.com</li>
              <li className="flex items-center gap-2"><GitBranch className="w-3.5 h-3.5" /> MalindaGamage</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">© 2026 Gamage Vehicle Rental. Malinda Gamage.</p>
          <p className="text-slate-600 text-xs">Built with Next.js · UI by UI/UX Pro Max</p>
        </div>
      </div>
    </footer>
  );
}
