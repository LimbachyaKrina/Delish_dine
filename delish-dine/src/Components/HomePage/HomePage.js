import React from "react";
import { useParams } from "react-router-dom";

export default function HomePage() {
  const { id } = useParams();
  return <div>Home, Welcome {id}</div>;
}
