import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  let isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-col items-center justify-center flex-1 py-10">
            <Outlet />
          </section>

          <img
            className="hidden object-cover w-1/2 h-svh xl:block"
            src="/assets/images/side-img.svg"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
