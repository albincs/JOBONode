import React from 'react';
import { Box, Button, H2, Text, Icon } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';

const DashboardWrapper = styled(Box)`
  padding: 64px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  margin: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
`;

const DecorativeCircle = styled(Box)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  color: #667eea;
`;

const NavigationDashboard = () => {
  return (
    <DashboardWrapper>
      <DecorativeCircle>
        <Icon icon="Analytics" size={48} />
      </DecorativeCircle>
      <H2 mb="lg">Welcome to Jobo Admin Panel</H2>
      <Text variant="lg" color="grey60" mb="xl" maxWidth="600px">
        Your comprehensive analytics dashboard is available as a dedicated view with interactive charts and filters. Click the button below to view business insights.
      </Text>
      <Button 
        as="a" 
        href="/dashboard" 
        size="lg" 
        variant="primary"
        style={{ padding: '12px 32px', fontSize: '18px', borderRadius: '8px' }}
      >
        View Analytics Dashboard
      </Button>
    </DashboardWrapper>
  );
};

export default NavigationDashboard;
