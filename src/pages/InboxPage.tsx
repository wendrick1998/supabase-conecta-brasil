
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { UnifiedInbox } from '@/components/inbox/UnifiedInbox';

const InboxPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Inbox | Vendah+</title>
      </Helmet>
      <UnifiedInbox />
    </>
  );
};

export default InboxPage;
