import Navbar from '@/components/Navbar'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Users, Clock, BarChart3, Zap, Shield } from 'lucide-react'

const HomePage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with your team in real-time workspaces"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "AI-powered task scheduling to optimize your productivity"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Visualize your team's progress with intuitive dashboards"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built for speed with modern technology stack"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with enterprise-grade security"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Task Management",
      description: "Organize, prioritize, and track all your tasks in one place"
    }
  ]

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Tasks Completed" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ]

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <Navbar />

      {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 pt-20 pb-24'>
        <div className='text-center space-y-8'>
          {/* Badge */}
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200'>
            <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
            <span className='text-sm font-medium text-slate-700'>Now with AI-powered automation</span>
          </div>

          {/* Main Heading */}
          <h1 className='text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight'>
            Manage Tasks,
            <br />
            <span className='bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-clip-text text-transparent'>
              Empower Teams
            </span>
          </h1>

          {/* Subheading */}
          <p className='max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed'>
            The modern task management platform built for high-performing teams. 
            Organize work, collaborate seamlessly, and achieve more together.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
            <button
              onClick={() => navigate('/register')}
              className='w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2'
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/demo')}
              className='w-full sm:w-auto px-8 py-4 text-lg font-semibold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2'
            >
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className='pt-8 flex items-center justify-center gap-2 text-sm text-slate-600'>
            <div className='flex -space-x-2'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 border-2 border-white' />
              ))}
            </div>
            <span className='font-medium'>Join 10,000+ users already using Taskify</span>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className='mt-16 relative'>
          <div className='absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent h-32 bottom-0 z-10'></div>
          <div className='rounded-2xl border-4 border-slate-200 shadow-2xl overflow-hidden bg-white'>
            <div className='bg-slate-800 px-4 py-3 flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-red-500'></div>
              <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
              <div className='w-3 h-3 rounded-full bg-green-500'></div>
            </div>
            <div className='aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center'>
              <div className='text-center space-y-3'>
                <div className='w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className='text-slate-500 font-medium'>Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-slate-900 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-9'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat, idx) => (
              <div key={idx} className='text-center'>
                <div className='text-4xl sm:text-5xl font-black text-white mb-2'>
                  {stat.value}
                </div>
                <div className='text-slate-400 font-medium'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 py-24'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-black text-slate-900 mb-4'>
            Everything you need to stay organized
          </h2>
          <p className='text-lg text-slate-600 max-w-2xl mx-auto'>
            Powerful features designed to help you and your team work smarter, not harder
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className='group p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300'
            >
              <div className='w-14 h-14 bg-slate-100 group-hover:bg-slate-800 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300'>
                <div className='text-slate-700 group-hover:text-white transition-colors duration-300'>
                  {feature.icon}
                </div>
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>
                {feature.title}
              </h3>
              <p className='text-slate-600 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 py-24'>
        <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl'></div>
            <div className='absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl'></div>
          </div>

          <div className='relative z-10 space-y-6'>
            <h2 className='text-4xl sm:text-5xl font-black text-white'>
              Ready to boost your productivity?
            </h2>
            <p className='text-xl text-slate-300 max-w-2xl mx-auto'>
              Join thousands of teams already using Taskify to streamline their workflow
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
              <button
                onClick={() => navigate('/register')}
                className='w-full sm:w-auto px-8 py-4 text-lg font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
              >
                Start Free Trial
              </button>
             
            </div>
            <p className='text-sm text-slate-400 pt-2'>
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-slate-200 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 py-12'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className='text-lg font-bold text-slate-900'>Taskify</span>
            </div>
            
            <div className='flex gap-6 text-sm text-slate-600'>
              <a href='#' className='hover:text-slate-900 transition-colors'>Privacy</a>
              <a href='#' className='hover:text-slate-900 transition-colors'>Terms</a>
              <a href='#' className='hover:text-slate-900 transition-colors'>Contact</a>
            </div>

            <p className='text-sm text-slate-600'>
              © 2025 Taskify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
