import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import HomePage from './routes/homepage';
import ChaletSearchResults from './routes/chalet-search';
import ViewChaletDetails from './routes/view-chalet';
import ConfirmReservation from './routes/confirm-reservation';
import BookingVerify from './routes/booking-verify';
import PaymentSuccess from './routes/confirm-reservation/components/PaymentStatusHandler';
import PaymentCancelled from './routes/confirm-reservation/components/PaymentCancelled';
import PaymentError from './routes/confirm-reservation/components/PaymentError';
import BookingConfirmation from './routes/reservation';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<ChaletSearchResults />} />
      <Route path="/chalets/:id" element={<ViewChaletDetails />} />
      <Route path="/reservation/:id" element={<ConfirmReservation />} />
      <Route path="/reservation/confirmation" element={<BookingConfirmation />} />
      <Route path="/booking-verify" element={<BookingVerify />} />

      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancelled" element={<PaymentCancelled />} />
      <Route path="/payment/error" element={<PaymentError />} />
    </>,
  ),
);

export const Loading = () => (
  <div className="bg-gray-50 text-gray-90 flex h-screen w-full items-center justify-center">
    <Loader2 />
  </div>
);

const App = () => (
  <Suspense fallback={<Loading />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default App;
