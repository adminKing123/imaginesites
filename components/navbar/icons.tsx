import { FaYoutube } from "react-icons/fa";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";

type IconProps = {
  className?: string;
};

export function SearchIcon({ className = "h-5 w-5" }: IconProps) {
  return <FiSearch className={className} aria-hidden="true" />;
}

export function MenuIcon({ className = "h-6 w-6" }: IconProps) {
  return <FiMenu className={className} aria-hidden="true" />;
}

export function CloseIcon({ className = "h-4 w-4" }: IconProps) {
  return <FiX className={className} aria-hidden="true" />;
}

export function YouTubeIcon({ className = "h-5 w-5" }: IconProps) {
  return <FaYoutube className={className} aria-hidden="true" />;
}
