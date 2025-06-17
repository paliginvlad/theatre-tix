
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Menu,
  X,
  User,
  Users,
  Globe,
  Search,
  List,
  Grid2X2,
  Settings
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsViewType, setNewsViewType] = useState<"list" | "grid">("list");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? "text-theatre-burgundy font-medium" : "";
  };

  const handleSearchClick = () => {
    navigate("/search");
    closeMenu();
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="theatre-container">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <h1 className="text-2xl sm:text-3xl font-bold text-theatre-burgundy">
              TheatreTix
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`hover:text-theatre-burgundy transition-colors ${isActive("/")}`}>
              {t("nav.home")}
            </Link>
            <Link
              to="/schedule"
              className={`hover:text-theatre-burgundy transition-colors ${isActive("/schedule")}`}
            >
              {t("nav.schedule")}
            </Link>
            
            <Link
              to="/team"
              className={`hover:text-theatre-burgundy transition-colors ${isActive("/team")}`}
            >
              <div className="flex items-center">
                <Users size={18} className="mr-1" />
                {t("nav.team")}
              </div>
            </Link>
            
            {/* Admin link - only show if user is admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`hover:text-theatre-burgundy transition-colors ${isActive("/admin")}`}
              >
                <div className="flex items-center">
                  <Settings size={18} className="mr-1" />
                  {t("nav.admin")}
                </div>
              </Link>
            )}
            
            {/* About Theater dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`bg-transparent hover:bg-transparent hover:text-theatre-burgundy ${isActive("/about")}`}>
                    {t("nav.aboutTheater")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[250px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/about/history"
                            className="block p-2 hover:bg-slate-100 rounded-md"
                            onClick={closeMenu}
                          >
                            {t("nav.theaterHistory")}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/about/rules"
                            className="block p-2 hover:bg-slate-100 rounded-md"
                            onClick={closeMenu}
                          >
                            {t("nav.visitRules")}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/about/contacts"
                            className="block p-2 hover:bg-slate-100 rounded-md"
                            onClick={closeMenu}
                          >
                            {t("nav.contacts")}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* News link */}
            <Link
              to="/news"
              className={`hover:text-theatre-burgundy transition-colors ${isActive("/news")}`}
            >
              <div className="flex items-center">
                <span className="mr-1">{t("nav.news")}</span>
              </div>
            </Link>
            
            {/* Search button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:text-theatre-burgundy"
              onClick={handleSearchClick}
            >
              <Search size={20} />
            </Button>
            
            {/* Language toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:text-theatre-burgundy"
                >
                  <Globe size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={cn(language === "en" && "bg-slate-100")}
                >
                  {t("language.english")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("ua")}
                  className={cn(language === "ua" && "bg-slate-100")}
                >
                  {t("language.ukrainian")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center hover:text-theatre-burgundy transition-colors"
                >
                  <User size={18} className="mr-1" />
                  {currentUser?.firstName}
                </Link>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-theatre-burgundy text-theatre-burgundy hover:bg-theatre-burgundy hover:text-white"
                >
                  {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="border-theatre-burgundy text-theatre-burgundy hover:bg-theatre-burgundy hover:text-white">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-theatre-burgundy text-white hover:bg-theatre-burgundy/90">
                    {t("nav.register")}
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-theatre-black focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`hover:text-theatre-burgundy transition-colors ${isActive("/")}`}
                onClick={closeMenu}
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/schedule"
                className={`hover:text-theatre-burgundy transition-colors ${isActive("/schedule")}`}
                onClick={closeMenu}
              >
                {t("nav.schedule")}
              </Link>
              
              <Link
                to="/team"
                className={`hover:text-theatre-burgundy transition-colors ${isActive("/team")}`}
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <Users size={18} className="mr-1" />
                  {t("nav.team")}
                </div>
              </Link>
              
              {/* Admin link - mobile view */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`hover:text-theatre-burgundy transition-colors ${isActive("/admin")}`}
                  onClick={closeMenu}
                >
                  <div className="flex items-center">
                    <Settings size={18} className="mr-1" />
                    {t("nav.admin")}
                  </div>
                </Link>
              )}
              
              <div className="border-t pt-2">
                <p className="font-medium mb-2">{t("nav.aboutTheater")}</p>
                <ul className="ml-4 flex flex-col space-y-2">
                  <li>
                    <Link
                      to="/about/history"
                      className="block hover:text-theatre-burgundy"
                      onClick={closeMenu}
                    >
                      {t("nav.theaterHistory")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about/rules"
                      className="block hover:text-theatre-burgundy"
                      onClick={closeMenu}
                    >
                      {t("nav.visitRules")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about/contacts"
                      className="block hover:text-theatre-burgundy"
                      onClick={closeMenu}
                    >
                      {t("nav.contacts")}
                    </Link>
                  </li>
                </ul>
              </div>
              
              <Link
                to="/news"
                className={`hover:text-theatre-burgundy transition-colors ${isActive("/news")}`}
                onClick={closeMenu}
              >
                {t("nav.news")}
              </Link>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  size="icon"
                  className="hover:text-theatre-burgundy"
                  onClick={handleSearchClick}
                >
                  <Search size={20} />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:text-theatre-burgundy"
                    >
                      <Globe size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setLanguage("en")}
                      className={cn(language === "en" && "bg-slate-100")}
                    >
                      {t("language.english")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setLanguage("ua")}
                      className={cn(language === "ua" && "bg-slate-100")}
                    >
                      {t("language.ukrainian")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center hover:text-theatre-burgundy transition-colors"
                    onClick={closeMenu}
                  >
                    <User size={18} className="mr-1" />
                    {t("nav.profile")}
                  </Link>
                  <Button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    variant="outline"
                    className="border-theatre-burgundy text-theatre-burgundy hover:bg-theatre-burgundy hover:text-white"
                  >
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full border-theatre-burgundy text-theatre-burgundy hover:bg-theatre-burgundy hover:text-white">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button className="w-full bg-theatre-burgundy text-white hover:bg-theatre-burgundy/90">
                      {t("nav.register")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
