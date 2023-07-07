'use client';

import React, { useCallback, useState } from 'react';
import { SafeReservation, SafeUser } from '../types';
import { Reservation } from '@prisma/client';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Container from '../components/Container';
import ListingCard from '../components/listings/ListingCard';
import Heading from '../components/Heading';

interface ReservationsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string>('');

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success('Reservation cancelled');
          router.refresh();
        })
        .catch(() => {
          toast.error('Something went wrong');
        })
        .finally(() => {
          setDeletingId('');
        });
    },
    [router]
  );

  return (
    <Container>
      <Heading title='Reservations' subTitle='Bookings on your properties' />
      <div className='grid mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            currentUser={currentUser}
            actionId={reservation.id}
            actionLabel='Cancel guest reservation'
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;
