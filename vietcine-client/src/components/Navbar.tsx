import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ChevronDown,
  LogOut,
  Ticket,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { AuthContext } from "../context/authContext";

interface Props {
  transparent?: boolean;
  fixedTop?: boolean; // New prop to control fixed positioning
}

export function NavBar({ transparent = true, fixedTop = true }: Props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, dispatch } = useContext(AuthContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const renderDropdownItem = (
    label: string,
    icon: JSX.Element,
    path: string,
    testid?: string
  ) => (
    <button
      className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition duration-150"
      onClick={() => {
        setIsOpen(false);
        navigate(path);
      }}
      {...(testid ? { "data-testid": testid } : {})}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <nav
      className={`w-full py-6 ${
        fixedTop ? "fixed top-0 left-0 z-50" : "relative"
      } ${transparent ? "bg-transparent" : "bg-black/90"}`}
    >
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
          {[
            { href: "/", label: "Trang chủ" },
            { href: "/movies", label: "Phim" },
            { href: "/book-tickets", label: "Rạp chiếu" },
            { href: "/promotions", label: "Khuyến mãi" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white hover:text-red-500 transition duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons or User Profile */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                data-testid="profile-title"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-600">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <User className="text-white h-5 w-5" />
                    </div>
                  )}
                </div>
                <span className="text-white">{user.fullName}</span>
                <ChevronDown className="text-white h-4 w-4" />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-800">
                  {renderDropdownItem(
                    "Tài khoản",
                    <UserIcon className="h-4 w-4 mr-2" />,
                    "/profile",
                    "profile-account-btn"
                  )}
                  {renderDropdownItem(
                    "Vé của tôi",
                    <Ticket className="h-4 w-4 mr-2" />,
                    "/my-tickets"
                  )}
                  {renderDropdownItem(
                    "Cài đặt",
                    <Settings className="h-4 w-4 mr-2" />,
                    "/settings"
                  )}
                  <div className="border-t border-gray-800 my-1"></div>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 transition duration-150"
                    onClick={handleLogout}
                    data-testid="logout-btn"
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
              onClick={() => navigate("/login")}
              data-testid="login-navbar-btn"
            >
              Đăng nhập
            </button>
          )}

          <button
            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
            onClick={() => navigate("/book-tickets")}
          >
            Mua vé
          </button>
        </div>
      </div>
    </nav>
  );
}
