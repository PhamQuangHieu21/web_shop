import React, { useState } from "react";
import { Input } from "../ui/input";

const CategoryToolbar = () => {
  const [name, setName] = useState<string>("");
  return (
    <Input
      className="w-[200px] mb-3"
      type="text"
      name="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Tìm kiếm theo tên..."
    />
  );
};

export default CategoryToolbar;
