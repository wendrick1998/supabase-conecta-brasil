
import React from 'react';
import { Helmet } from 'react-helmet-async';
import InboxLayout from '@/components/inbox/InboxLayout';

const InboxPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Inbox | Vendah+</title>
      </Helmet>
      <InboxLayout />
    </>
  );
};

export default InboxPage;
