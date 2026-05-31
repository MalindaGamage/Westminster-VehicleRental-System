'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { motion } from 'framer-motion';
import { StaggerContainer, FadeUpItem, ScrollReveal, PageTransition } from '@/components/animations/motion';
import {
  Car, Zap, Truck, Bike, Star, Shield, Clock, ChevronRight,
  ArrowRight, Users, MapPin, Award, Phone, Mail
} from 'lucide-react';

const VEHICLE_TYPES = [
  { icon: Car,   label: 'Cars',       desc: 'Axio · Allion · Saloons', color: 'text-blue-400',    bg: 'bg-blue-400/10 border-blue-400/20',    type: 'Car' },
  { icon: Zap,   label: 'Electric',   desc: 'Leaf · Prius PHV · EV',   color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', type: 'ElectricCar' },
  { icon: Truck, label: 'Vans',       desc: 'KDH · L300 · Cargo',      color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/20',   type: 'Van' },
  { icon: Bike,  label: 'Motorbikes', desc: 'Pulsar · CB150R · Sport',  color: 'text-purple-400',  bg: 'bg-purple-400/10 border-purple-400/20', type: 'Motorbike' },
];

const FEATURES = [
  { icon: Shield, title: 'Fully Insured',     desc: 'Comprehensive insurance on every rental' },
  { icon: Clock,  title: 'Flexible Booking',  desc: 'Book by the day, modify or cancel anytime' },
  { icon: Star,   title: 'Premium Fleet',     desc: 'Inspected and maintained before every rental' },
  { icon: MapPin, title: 'Island-wide',       desc: 'Serving all provinces across Sri Lanka' },
];

export default function HomePage() {
  const { state } = useStore();
  const { isAuthenticated, isAdmin } = useAuth();
  const featured = state.vehicles.slice(0, 3);

  const stats = [
    { label: 'Available Now', value: state.vehicles.filter(v => v.reservations.length === 0).length },
    { label: 'Fleet Size',    value: state.vehicles.length },
    { label: 'Vehicle Types', value: 4 },
    { label: 'Happy Clients', value: '200+' },
  ];

  return (
    <PageTransition>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-emerald-600/5 blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative w-full">
          <StaggerContainer delay={0.12}>
            <FadeUpItem>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6 cursor-default"
              >
                <Zap className="w-3.5 h-3.5" />
                Sri Lanka&apos;s Premium Vehicle Rental
              </motion.div>
            </FadeUpItem>

            <FadeUpItem>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
                Rent Your
                <motion.span
                  className="text-gradient block"
                  initial={{ backgroundSize: '100%' }}
                  animate={{ backgroundSize: '200%' }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                >
                  Perfect Vehicle
                </motion.span>
              </h1>
            </FadeUpItem>

            <FadeUpItem>
              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
                Cars, electric vehicles, vans and motorbikes across Sri Lanka — flexible daily rental at competitive LKR rates.
              </p>
            </FadeUpItem>

            <FadeUpItem>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button size="xl" asChild>
                    <Link href="/customer" className="flex items-center gap-2">
                      Browse Fleet <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
                {!isAuthenticated ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button size="xl" variant="outline" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </motion.div>
                ) : isAdmin ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button size="xl" variant="outline" asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Admin Portal
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button size="xl" variant="outline" asChild>
                      <Link href="/reservations">My Reservations</Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </FadeUpItem>
          </StaggerContainer>

          {/* Stats */}
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16" delay={0.1}>
            {stats.map((s, i) => (
              <FadeUpItem key={s.label}>
                <motion.div
                  whileHover={{ y: -4, borderColor: 'rgba(59,130,246,0.4)' }}
                  className="glass-card rounded-2xl p-4 text-center cursor-default border border-slate-700/50"
                >
                  <motion.p
                    className="text-3xl font-black text-white"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {s.value}
                  </motion.p>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </motion.div>
              </FadeUpItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Vehicle Categories ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-2">Categories</p>
            <h2 className="text-3xl font-bold text-white">Browse by Type</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer" className="flex items-center gap-1">View all <ChevronRight className="w-4 h-4" /></Link>
          </Button>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.1}>
          {VEHICLE_TYPES.map(({ icon: Icon, label, desc, color, bg, type }) => (
            <FadeUpItem key={type}>
              <Link href={`/customer?type=${type}`}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-2xl border ${bg} p-6 text-center cursor-pointer`}
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`w-14 h-14 rounded-2xl ${bg} border flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-7 h-7 ${color}`} />
                  </motion.div>
                  <p className="font-bold text-white mb-1">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                  <p className={`text-xs font-semibold mt-2 ${color}`}>
                    {state.vehicles.filter(v => v.vehicleType === type).length} vehicles
                  </p>
                </motion.div>
              </Link>
            </FadeUpItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Featured Vehicles ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ScrollReveal className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-2">Featured</p>
            <h2 className="text-3xl font-bold text-white">Available Now</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer" className="flex items-center gap-1">See all <ChevronRight className="w-4 h-4" /></Link>
          </Button>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" delay={0.12}>
          {featured.map(v => (
            <FadeUpItem key={v.registrationNumber}>
              <VehicleCard vehicle={v} showActions />
            </FadeUpItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <ScrollReveal className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-bold text-white">The Gamage Advantage</h2>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" delay={0.1}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <FadeUpItem key={title}>
                <motion.div
                  whileHover={{ y: -6, borderColor: 'rgba(59,130,246,0.3)' }}
                  className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 text-center cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center mx-auto mb-4"
                  >
                    <Icon className="w-6 h-6 text-blue-400" />
                  </motion.div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </motion.div>
              </FadeUpItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal>
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 p-10 lg:p-16 text-center"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <motion.div
                animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl"
              />
              <motion.div
                animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
                transition={{ duration: 9, repeat: Infinity }}
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-3xl"
              />
            </div>
            <div className="relative">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Award className="w-12 h-12 text-blue-200 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Ready to Hit the Road?</h2>
              <p className="text-blue-200 mb-8 max-w-md mx-auto">
                Browse our fleet and book in minutes. Transparent LKR pricing, no hidden fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="xl" variant="glass" asChild>
                    <Link href="/customer" className="flex items-center gap-2">
                      <Users className="w-5 h-5" /> Browse Fleet
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="xl" variant="glass" asChild>
                    <Link href="/login" className="flex items-center gap-2">
                      <Shield className="w-5 h-5" /> Sign In
                    </Link>
                  </Button>
                </motion.div>
              </div>
              {/* Contact strip */}
              <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row gap-4 justify-center text-blue-200 text-sm">
                <span className="flex items-center gap-2 justify-center"><Phone className="w-4 h-4" /> +94711451023</span>
                <span className="flex items-center gap-2 justify-center"><Mail className="w-4 h-4" /> pkgmalinda@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>
    </PageTransition>
  );
}
