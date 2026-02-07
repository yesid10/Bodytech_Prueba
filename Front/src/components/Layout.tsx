import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { logout } from "../store/slices/authSlice";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import logoImg from "../assets/logo.png";

const Layout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getProfileImage = () => {
    return (
      user?.profile_image_url ||
      user?.google_avatar_url ||
      "https://via.placeholder.com/40?text=No+Image"
    );
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "#0f1419", color: "#e5e7eb" }}
    >
      <nav
        className="shadow-sm"
        style={{
          backgroundColor: "#1a1f2a",
          borderBottom: "1px solid #5a7a9a",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className="shrink-0 flex items-center gap-3 font-bold text-xl transition-all duration-300 hover:scale-95"
                style={{ color: "#6b9ac3" }}
              >
                <img
                  src={logoImg}
                  alt="BodyTech TaskManager Logo"
                  className="w-3/6 rounded-lg object-cover opacity-50"
                />
              </Link>
            </div>
            <div className="flex items-center gap-4 relative">
              <span
                className="text-sm hidden sm:block"
                style={{ color: "#b0b2b8" }}
              >
                Bienvenido,{" "}
                <span className="font-semibold" style={{ color: "#e5e7eb" }}>
                  {user?.name}
                </span>
              </span>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 p-1 rounded-full transition-colors hover:opacity-80 focus:outline-none focus:ring-2"
                  style={{
                    outlineColor: "#6b9ac3",
                  }}
                >
                  <img
                    src={getProfileImage()}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border-2"
                    style={{ borderColor: "#6b9ac3" }}
                  />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 py-2"
                    style={{
                      backgroundColor: "#1a1f2a",
                      borderColor: "#5a7a9a",
                      borderWidth: "1px",
                    }}
                  >
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-3 transition-colors"
                      style={{ color: "#b0b2b8" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#252b38";
                        e.currentTarget.style.color = "#e5e7eb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#b0b2b8";
                      }}
                    >
                      <User className="w-4 h-4" />
                      Mi Perfil
                    </button>
                    <div
                      style={{ borderColor: "#5a7a9a", borderTopWidth: "1px" }}
                    ></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-3 transition-colors"
                      style={{ color: "#a17171" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#252b38";
                        e.currentTarget.style.color = "#d4a8a8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#a17171";
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>

              {/* Fallback logout button for small screens */}
              <button
                onClick={handleLogout}
                className="inline-flex cursor-pointer items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 sm:hidden"
                style={{
                  backgroundColor: "#252b38",
                  borderColor: "#5a7a9a",
                  color: "#b0b2b8",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1a1f2a";
                  e.currentTarget.style.borderColor = "#6b9ac3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#252b38";
                  e.currentTarget.style.borderColor = "#5a7a9a";
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
