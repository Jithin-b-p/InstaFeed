import { Routes, Route } from "react-router-dom";

import "./globals.css";

import Home from "./_root/pages/Home";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

import { Toaster } from "@/components/ui/toaster";

export const App = () => {
  return (
    <main className="flex min-h-svh">
      <Routes>
        {/* public routes */}

        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        {/* Private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};
