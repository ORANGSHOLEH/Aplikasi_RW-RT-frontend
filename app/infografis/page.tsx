"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

export default function infografis() {
  return (
    <>
      <Navbar />
      <main>
        {/* Visi and Misi Section */}
        <section className="py-20 bg-gray-50 px-6">
          <div>
            <h1>Hello WOrld</h1>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
