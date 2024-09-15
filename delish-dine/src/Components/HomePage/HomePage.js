import React from "react";
import { useParams } from "react-router-dom";

export default function HomePage() {
  const { name } = useParams();
  return <div>Home, Welcome {name}</div>;
}
