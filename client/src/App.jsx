import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { ErrorBoundary } from 'react-error-boundary';
import { ClerkProvider } from "@clerk/clerk-react";

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const Overview = lazy(() => import("./pages/overview"));
const Calendar = lazy(() => import("./pages/calendar"));
// const PatientList = lazy(() => import("./pages/patient-list"));
const Messages = lazy(() => import("./pages/messages"));
const PaymentInformation = lazy(() => import("./pages/payment-information"));
const ErrorPage = lazy(() => import("./pages/404"));
const Trending = lazy(() => import("./pages/trending"));
const ProductSingle = lazy(() => import("./pages/product-single"));
const TrackedProducts = lazy(() => import("./pages/tracked-products"));

const Login = lazy(() => import("./pages/auth/login"));
const LoadingRoute = lazy(() => import("./pages/auth/common/loading-route"));
const Register = lazy(() => import("./pages/auth/register"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password"));
const Organisations = lazy(() => import("./pages/organisations"));
const ConfigureOrganisation = lazy(() => import("./pages/organisations/configure-organisation"));

import Loading from "@/components/Loading";
import Layout from "./layout/Layout";

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
      <div>
        <h2>Something went wrong:</h2>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try Again</button>
      </div>
    );
  };

  return (
      <ClerkProvider publishableKey={clerkPubKey}>
        <main className="App  relative">
        {/* <ErrorBoundary FallbackComponent={ErrorFallback}> */}
          <Routes>
            <Route path="" element={ <Suspense fallback={<Loading />}> <Login /> </Suspense> } />
            <Route path="/sign-in" element={ <Suspense fallback={<Loading />}> <Login /> </Suspense> } />
            <Route path="/loading" element={ <Suspense fallback={<Loading />}> <LoadingRoute /> </Suspense> } />
            <Route path="/sign-up" element={ <Suspense fallback={<Loading />}> <Register /> </Suspense> } />
            <Route path="/forgot-password" element={ <Suspense fallback={<Loading />}> <ForgotPass /> </Suspense> } />
            <Route path="/organisations" element={ <Suspense fallback={<Loading />}> <Organisations /> </Suspense> } />
            <Route path="/create-organisation/:id" element={ <Suspense fallback={<Loading />}> <ConfigureOrganisation /> </Suspense> } />

            <Route path="/" element={<Layout />}>
              <Route path="overview" element={<Overview routing="path" path="overview"/>} />
              <Route path="calendar" element={<Calendar />} />
              {/* <Route path="patient-list" element={<PatientList />} /> */}
              <Route path="messages" element={<Messages />} />
              <Route path="payment-information" element={<PaymentInformation />} />
              <Route path="trending" element={ <Suspense fallback={<Loading />}> <Trending /> </Suspense> } />
              <Route path="/product/:id" element={ <Suspense fallback={<Loading />}> <ProductSingle /> </Suspense> } />
              <Route path="my-list" element={ <Suspense fallback={<Loading />}> <TrackedProducts /> </Suspense> } />
              <Route path="*" element={<ErrorPage />} />
            </Route>

          </Routes>
        {/* </ErrorBoundary> */}
          
        </main>
      </ClerkProvider>
    
  );
}

export default App;
