import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { href: "#", label: "Homepage", current: true },
    { href: "#", label: "Accommodation", current: false },
    { href: "#", label: "Food & Beverage", current: false },
    { href: "#", label: "Meeting & Events", current: false },
    { href: "#", label: "Golf", current: false },
    { href: "#", label: "Experiences", current: false },
  ];

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 border-b-2">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="/" className="flex items-center">
            {/* <img
              src="https://www.heritage-eastafrica.com/greatriftvalleylodgeandgolfresort/greatriftvalleylodge_hotel_bin/favicon.ico"
              className="mr-3 h-6 sm:h-9"
              alt="Logo"
            /> */}
            <span className="self-center text-xl text-[#27534c] font-extrabold whitespace-nowrap dark:text-white">
              GRVL
            </span>
          </a>
          
          <div className="flex items-center lg:order-2">
            <a
              href="#"
              className="text-white bg-[#27534c] hover:bg-[#1c3d38] focus:ring-4 focus:ring-bg-[#1c3d38] font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2"
            >
              Become a member
            </a>
          

            {/* Mobile Menu Sheet */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-[#27534c] p-0">
                  <div className="py-4">
                    <ul className="space-y-2">
                      {navLinks.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className={`block px-6 py-3 text-white hover:bg-[#1c3d38] transition-colors ${
                              link.current ? 'bg-[#1c3d38]' : ''
                            }`}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`block py-2 pr-4 pl-3 transition-colors lg:px-0 lg:py-0
                      ${
                        link.current
                          ? 'text-[#27534c] lg:text-[#27534c]'
                          : 'text-gray-700 dark:text-gray-400'
                      }
                      hover:text-white hover:bg-[#27534c] lg:hover:bg-transparent lg:hover:underline lg:hover:text-[#27534c]
                    `}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;