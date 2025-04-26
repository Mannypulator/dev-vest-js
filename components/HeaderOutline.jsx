import { Poppins } from "next/font/google";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const HeaderOutline = () => {
  return (
    <div
      className={`${poppins.className} bg-[#E6B027] flex flex-col md:flex-row items-center justify-between text-white text-base px-6 md:px-24 py-4 text-center md:text-left`}
    >
      <p className="mb-2 md:mb-0">Welcome to Drive Vest!</p>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex items-center text-lg space-x-2">
          <MapPin size={15} />
          <Select>
            <SelectTrigger className="w-[180px] border-0 outline-none focus:ring-0">
              <SelectValue
                placeholder="All Cities(NGR)"
                className="bg-transparent"
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="apple"> All Cities(NGR)</SelectItem>
                <SelectItem value="banana">Abu Dhabi</SelectItem>
                <SelectItem value="blueberry">Dubai</SelectItem>
                <SelectItem value="grapes">Sharjah</SelectItem>
                <SelectItem value="pineapple">Ajman</SelectItem>
                <SelectItem value="pineapple">UAQ</SelectItem>
                <SelectItem value="pineapple">Ras AI-Khaimah</SelectItem>
                <SelectItem value="pineapple">Fujairah</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin size={15} />
          <p>Post Code 423651</p>
        </div>
      </div>
    </div>
  );
};

export default HeaderOutline;
