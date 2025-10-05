import { Github, Mail } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-galaxy-dark/95 border-t border-nasa-cyan/30 space-glow">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-nasa-cyan/20 backdrop-blur-sm border border-nasa-cyan/50 space-glow">
                <Image 
                  src={`/interspace-img.png?v=${Date.now()}`}
                  alt="ExoClassifier Logo" 
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  style={{
                    clipPath: 'circle(50% at 50% 50%)',
                    objectPosition: 'center'
                  }}
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-nasa-cyan to-nasa-blue bg-clip-text text-transparent text-glow">
                ExoClassifier
              </span>
            </div>
            <p className="text-galaxy-primary/70 text-sm">
              Automatic exoplanet classifier using Machine Learning. 
              Discover new worlds with the help of artificial intelligence.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-galaxy-primary uppercase tracking-wider">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-galaxy-primary/70 hover:text-nasa-cyan text-sm transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/predict" className="text-galaxy-primary/70 hover:text-nasa-cyan text-sm transition-colors">
                  Classify Exoplanet
                </a>
              </li>
              <li>
                <a href="/upload" className="text-galaxy-primary/70 hover:text-nasa-cyan text-sm transition-colors">
                  Upload Dataset
                </a>
              </li>
              <li>
                <a href="/model-info" className="text-galaxy-primary/70 hover:text-nasa-cyan text-sm transition-colors">
                  Model Information
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-galaxy-primary uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-nasa-cyan/70" />
                <span className="text-galaxy-primary/70 text-sm">
                  support@exoclassifier.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4 text-nasa-cyan/70" />
                <a 
                  href="https://github.com/exoclassifier" 
                  className="text-galaxy-primary/70 hover:text-nasa-cyan text-sm transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-nasa-cyan/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-galaxy-primary/50 text-sm">
              © 2025 ExoClassifier. All rights reserved.
            </p>
            <p className="text-galaxy-primary/50 text-sm mt-2 md:mt-0">
              Developed with ❤️ for space exploration
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
