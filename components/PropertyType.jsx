"use client";
import { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const PropertyType = () => {
  const categories = [
    "Apartment",
    "Condo",
    "House",
    "Cabin or Cottage",
    "Room",
    "Studio",
    "Other",
  ];
  const [category, setCategory] = useState("Apartment");
  return (
    <div>
      <Label>Select Category</Label>
      <Select
        onValueChange={(value) => setCategory(value)}
        defaultValue={category}
      >
        <SelectTrigger className="w-full border rounded-[5px]">
          <SelectValue placeholder="Apartment" />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-[5px]">
          {categories.map((cat) => (
            <SelectItem className="bg-white" key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertyType;
