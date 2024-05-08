"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="h-full w-full flex flex-col justify-center items-center mx-auto text-center">
      <p className="text-red-500 font-bold text-5xl">Room {id}</p>
      <h1 className="text-2xl font-bold text-red">Cargando contenido...</h1>
    </div>
  );
}
