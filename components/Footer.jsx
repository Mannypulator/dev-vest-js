import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import facebookLogo from "@/assets/images/facebook-logo.svg";
import instagramLogo from "@/assets/images/instagram-logo.svg";
import linkedInLogo from "@/assets/images/linkedin-log.svg";
import skypeLogo from "@/assets/images/skype-logo.svg";
import xLogo from "@/assets/images/x-logo.svg";
import { ChevronDown, Globe } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "100",
  subsets: ["latin"],
});

const Footer = () => {
  return (
    <footer
      className={`${poppins.className} bg-[linear-gradient(219.84deg,_var(--text-primary)_4.14%,_var(--text-secondary)_44.22%)] text-white mt-8`}
    >
      <div className="container mx-auto py-8 px-2 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 font-normal text-lg text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Image
              className="mb-6"
              src={logo}
              width={60}
              height={60}
              alt="drive vest logo"
              priority={true}
            />
            <ul className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <li>
                <Globe color="#e9e7e7" />
              </li>
              <li className="text-base font-normal">EN</li>
              <li>
                <ChevronDown color="#e9e7e7" />
              </li>
            </ul>
            <ul className="flex items-center justify-center md:justify-start space-x-2">
              <li>
                <Image
                  className="mb-6"
                  src={facebookLogo}
                  width={25}
                  height={25}
                  alt="facebook logo"
                  priority={true}
                />
              </li>
              <li>
                <Image
                  className="mb-6"
                  src={xLogo}
                  width={30}
                  height={30}
                  alt="x logo"
                  priority={true}
                />
              </li>
              <li>
                <Image
                  className="mb-6"
                  src={skypeLogo}
                  width={30}
                  height={30}
                  alt="skype logo"
                  priority={true}
                />
              </li>
              <li>
                <Image
                  className="mb-6"
                  src={instagramLogo}
                  width={30}
                  height={30}
                  alt="instagram logo"
                  priority={true}
                />
              </li>
              <li>
                <Image
                  className="mb-6"
                  src={linkedInLogo}
                  width={30}
                  height={30}
                  alt="linkedin logo"
                  priority={true}
                />
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Company</h3>
            <ul className="space-y-1 text-sm">
              <li>About Us</li>
              <li>Advertise with Us</li>
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Nigeria</h3>
            <ul className="space-y-1 text-sm">
              <li>Lagos</li>
              <li>Abuja</li>
              <li>Port-harcourt</li>
              <li>Ibadan</li>
              <li>Delta</li>
              <li>Kano</li>
              <li>Anambra</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Other Countries</h3>
            <ul className="space-y-1 text-sm">
              <li>Egypt</li>
              <li>Saudi Arabia</li>
              <li>Qatar</li>
              <li>Kuwait</li>
              <li>Lebanon</li>
              <li>Bahrain</li>
              <li>Oman</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Support</h3>
            <ul className="space-y-1 text-sm">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-base bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] bg-clip-text text-transparent text-center">
          © Drive West 2025. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
