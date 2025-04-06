import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronDown, LogOut, Ticket, Settings, User as UserIcon } from "lucide-react";
import { AuthContext } from "../context/authContext";

interface Props {
  transparent?: boolean;
}

// Mock user interface - in a real app, this would come from authentication
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function NavBar({ transparent = false }: Props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const context = useContext(AuthContext);
  const { user, role } = context;

  const [isLoggedIn, setIsLoggedIn] = useState(true);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // In a real app, this would call your logout function
    setIsLoggedIn(false);
    setIsOpen(false);
    // Navigate to home after logout
    navigate("/");
  };

  return (
    <nav className={`w-full py-4 ${transparent ? 'absolute top-0 z-10 bg-transparent' : 'bg-black/90'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1
            className="text-2xl font-bold text-red-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            CineViet
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-white hover:text-red-500 transition duration-300">Trang chủ</a>
          <a href="/movies" className="text-white hover:text-red-500 transition duration-300">Phim</a>
          <a href="/theaters" className="text-white hover:text-red-500 transition duration-300">Rạp chiếu</a>
          <a href="/promotions" className="text-white hover:text-red-500 transition duration-300">Khuyến mãi</a>
        </div>

        {/* Auth Buttons or User Profile */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-600">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <User className="text-white h-5 w-5" />
                    </div>
                  )}
                </div>
                <span className="text-white">{user.name}</span>
                <ChevronDown className="text-white h-4 w-4" />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-800">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition duration-150"
                    onClick={() => { setIsOpen(false); navigate("/profile"); }}
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Tài khoản
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition duration-150"
                    onClick={() => { setIsOpen(false); navigate("/my-tickets"); }}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    Vé của tôi
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition duration-150"
                    onClick={() => { setIsOpen(false); navigate("/settings"); }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt
                  </button>
                  <div className="border-t border-gray-800 my-1"></div>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 transition duration-150"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-4 py-1 text-white border border-white rounded-md hover:bg-white hover:text-black transition duration-300"
              onClick={() => navigate("/Login")}
            >
              Đăng nhập
            </button>
          )}

          <button
            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
            onClick={() => navigate("/movies")}
          >
            Mua vé
          </button>
        </div>
      </div>
    </nav>
  );
}
