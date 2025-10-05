import { Rocket, Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-space-500 to-space-700 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-space-600 to-space-800 bg-clip-text text-transparent">
                ExoClassifier
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Automatic exoplanet classifier using Machine Learning. 
              Discover new worlds with the help of artificial intelligence.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-space-700 text-sm transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/predict" className="text-gray-600 hover:text-space-700 text-sm transition-colors">
                  Classify Exoplanet
                </a>
              </li>
              <li>
                <a href="/upload" className="text-gray-600 hover:text-space-700 text-sm transition-colors">
                  Upload Dataset
                </a>
              </li>
              <li>
                <a href="/model-info" className="text-gray-600 hover:text-space-700 text-sm transition-colors">
                  Model Information
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 text-sm">
                  support@exoclassifier.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4 text-gray-400" />
                <a 
                  href="https://github.com/exoclassifier" 
                  className="text-gray-600 hover:text-space-700 text-sm transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 ExoClassifier. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Developed with ❤️ for space exploration
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
