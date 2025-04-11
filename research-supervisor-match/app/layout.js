import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UM Research Supervisor Matching',
  description: 'Find the perfect research supervisor for your academic journey at University of Malaya',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-bold text-xl text-blue-600">UM</span>
              <span className="ml-2 text-gray-700">Research Match</span>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        {children}
        
        <footer className="bg-white border-t mt-12 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center">
                  <span className="font-bold text-xl text-blue-600">UM</span>
                  <span className="ml-2 text-gray-700">Research Match</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Find the perfect research supervisor for your academic journey.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-500 hover:text-blue-600">About</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-500 hover:text-blue-600">Contact</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-500 hover:text-blue-600">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                © {new Date().getFullYear()} University of Malaya. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 