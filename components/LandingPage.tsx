import React, { useState, useEffect } from 'react';
import { BoldIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
interface Slide {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Unlock the power",
    subtitle: "of your conversations with AI-driven analytics",
    backgroundImage: "https://img.freepik.com/premium-photo/photo-ai-chip-artificial-intelligence-digital-future-technology-innovation-hand-background_763111-134715.jpg",
  },
  {
    id: 2,
    title: "Understand patterns, sentiment",
    subtitle: "and engagement across all your chat platforms in real-time",
    backgroundImage: "https://techlogitic.net/wp-content/uploads/2021/09/Build-Chat-App-2021-1024x512.png",
  }
];

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const handleAnalyzeClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="https://th.bing.com/th/id/OIP.ffszqbMz5im_Phs4ygHiLQAAAA?rs=1&pid=ImgDetMain"
                alt="Chat Analysis Logo"
                className="w-10 h-10"
              />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Chat<span className="font-light">Analysis</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="nav-link">About</a>
              <a href="#features" className="nav-link">Features</a>
              <a href="#contact" className="nav-link">Contact</a>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="nav-link">{userEmail}</span>
                  <button onClick={logout} className="nav-link">Logout</button>
                </div>
              ) : (
                <button onClick={() => navigate('/login')} className="nav-link">Login</button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="space-y-2">
                <span className="block w-8 h-0.5 bg-gray-700"></span>
                <span className="block w-8 h-0.5 bg-gray-700"></span>
                <span className="block w-8 h-0.5 bg-gray-700"></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden">
          <div className="flex flex-col items-center pt-20 space-y-4">
            <a href="#about" className="nav-link">About</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#contact" className="nav-link">Contact</a>
            <a href="/login" className="nav-link">Login</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="w-screen h-screen relative">
        <div className="absolute inset-0 w-full h-full">
          {/* Slide Background */}
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-500"
            style={{
              backgroundImage: `url(${slides[currentSlide].backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Dark Overlay - More Transparent */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="font-bold text-sm sm:text-base tracking-wider mb-4">
                TRANSFORM & ANALYSE YOUR CHAT DATA
              </p>
              <h1 className="heading-primary text-white mb-4">
                {slides[currentSlide].title}
              </h1>
              <h2 className="heading-primary text-white mb-8">
                {slides[currentSlide].subtitle}
              </h2>
              <button onClick={handleAnalyzeClick} className="btn-primary">
                ANALYSE CHAT
              </button>
            </div>
          </div>

          {/* Slider Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-cyan-400"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-cyan-400"
          >
            <ChevronRight size={40} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlide === index ? 'bg-cyan-400' : 'bg-white'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">About Us</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://thumbs.dreamstime.com/z/basic-rgb-144644339.jpg"
                alt="About Us"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl text-black font-semibold mb-4">Leading the Way in Chat Analysis</h3>
              <p className="text-black mb-6">
                We are dedicated to providing high-quality chat analysis tools that empower
                businesses to understand and leverage their chat data effectively. Our
                advanced AI-driven analytics ensure that every interaction is analyzed
                for insights and actionable intelligence.
              </p>
              <ul className="space-y-4">
                <li className="text-black flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                  Advanced AI algorithms for accurate analysis
                </li>
                <li className="text-black flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                  Real-time sentiment and engagement tracking
                </li>
                <li className="text-black flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                  Comprehensive reporting and visualization tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Features</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md flex items-center">
              <div className="flex-shrink-0 mr-6 flex items-center justify-center text-white text-2xl">
                <i className="fas fa-chart-bar"></i>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Sentiment Analysis</h3>
                <img src="https://qualetics.com/wp-content/uploads/2023/04/sentiment-analysis-and-written-test-emotion-recognition-automated-artificial-intelligence-technologies-happy-man-and-259168367.jpg" alt="Sentiment Analysis" className="mb-4 rounded-lg shadow-md" />
                <p className="text-gray-600 mb-4">
                  Understand the emotional tone of conversations to gauge customer satisfaction and identify areas for improvement. Sentiment analysis helps in detecting positive, negative, or neutral sentiments in chat messages, allowing you to address customer concerns proactively and enhance overall satisfaction.
                </p>
                <a href="#" className="btn-primary">Read More</a>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex items-center">
              <div className="flex-shrink-0 mr-6 flex items-center justify-center text-white text-2xl">
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Response Time Analysis</h3>
                <img src="https://th.bing.com/th/id/OIP.ddSywUTzE5ggQ499djaHygHaD3?w=2400&h=1254&rs=1&pid=ImgDetMain" alt="Response Time Analysis" className="mb-4 rounded-lg shadow-md" />
                <p className="text-gray-600 mb-4">
                  Monitor and optimize response times to ensure quick and efficient customer support. By analyzing response times, you can identify bottlenecks, improve agent performance, and reduce customer wait times. This feature helps in maintaining high service standards and enhancing customer experience.
                </p>
                <a href="#" className="btn-primary">Read More</a>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex items-center">
              <div className="flex-shrink-0 mr-6 flex items-center justify-center text-white text-2xl">
                <i className="fas fa-comments"></i>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Topic Modeling</h3>
                <img src="https://th.bing.com/th/id/OIP.Sh2h82qNW8XJ5F5cKqmvDwHaDr?rs=1&pid=ImgDetMain" alt="Topic Modeling" className="mb-4 rounded-lg shadow-md" />
                <p className="text-gray-600 mb-4">
                  Identify and categorize common topics discussed in chats to better understand customer needs and trends. Topic modeling helps in uncovering the most frequently discussed issues, allowing you to tailor your support strategies and resources accordingly. This feature provides valuable insights into customer concerns and preferences.
                </p>
                <a href="#" className="btn-primary">Read More</a>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex items-center">
              <div className="flex-shrink-0 mr-6 flex items-center justify-center text-white text-2xl">
                <i className="fas fa-user-clock"></i>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Conversation Duration Analysis</h3>
                <img src="https://th.bing.com/th/id/OIP.QjUV7H1--7Nd6S1nveq9rwHaHa?w=1024&h=1024&rs=1&pid=ImgDetMain" alt="Conversation Duration Analysis" className="mb-4 rounded-lg shadow-md" />
                <p className="text-gray-600 mb-4">
                  Analyze the length of conversations to optimize support processes and improve efficiency. By understanding the duration of chats, you can identify which types of issues take longer to resolve and streamline your support workflows. This feature helps in reducing average handling times and improving overall operational efficiency.
                </p>
                <a href="#" className="btn-primary">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-gray-600" >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
              <p className="text-gray-600 mb-6">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
              <div className="space-y-4">
                <p className="flex items-center">
                  <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white mr-3">📍</span>
                  123 Chat Analysis Street, City, Country
                </p>
                <p className="flex items-center">
                  <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white mr-3">📧</span>
                  info@chatanalysis.com
                </p>
                <p className="flex items-center">
                  <span className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white mr-3">📞</span>
                  +1 234 567 890
                </p>
              </div>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Chat Analysis</h3>
              <p className="text-gray-400">
                Empowering businesses through advanced chat analytics and innovative
                solutions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  📱
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  📱
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  📱
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Chat Analysis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
