import React, { useState, useEffect } from 'react';
import { Box, Button, H2, Text, Input, Label, TextArea, Icon } from '@adminjs/design-system';

const EmailDashboard = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  
  // Compose states
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/email/inbox'); // Reusing route for logs
      if (!response.ok) throw new Error('Failed to fetch email logs');
      const data = await response.json();
      setEmails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccessMsg('');
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: composeTo, subject: composeSubject, body: composeBody })
      });
      if (!response.ok) throw new Error('Failed to send email');
      setSuccessMsg('Email sent successfully!');
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Box variant="container" p="xl" bg="white">
      <Box mb="xl">
        <H2>Email Communications</H2>
        <Text color="gray.600">Track contact form submissions and send new communications.</Text>
      </Box>

      <Box flex flexDirection="row" borderBottom="1px solid #ddd" mb="xl">
        <Button variant={activeTab === 'logs' ? 'primary' : 'text'} onClick={() => setActiveTab('logs')}>Sent History</Button>
        <Button variant={activeTab === 'compose' ? 'primary' : 'text'} onClick={() => setActiveTab('compose')} ml="md">Compose</Button>
      </Box>

      {activeTab === 'logs' && (
        <Box>
          <Button mb="lg" onClick={fetchLogs} disabled={loading}>
            Refresh Logs
          </Button>

          {loading && <Text>Loading history...</Text>}
          {error && <Text color="red.500">{error}</Text>}
          
          {!loading && emails.length === 0 && <Text>No sent messages found in history.</Text>}

          {emails.map(email => (
            <Box key={email.uid || Math.random()} p="md" border="1px solid #eee" borderRadius="md" mb="md" cursor="pointer" onClick={() => setSelectedEmail(email)} hover={{ borderColor: 'primary' }}>
              <Box flex flexDirection="row" justifyContent="space-between">
                <Box>
                  <Text fontWeight="bold">{email.from} → {email.to}</Text>
                  <Text mt="xs">{email.subject}</Text>
                </Box>
                <Text color="gray.500">{new Date(email.date).toLocaleString()}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {activeTab === 'compose' && (
        <Box maxWidth="600px">
          <form onSubmit={handleSend}>
            <Box mb="lg">
              <Label>To</Label>
              <Input width={1} value={composeTo} onChange={(e) => setComposeTo(e.target.value)} required />
            </Box>
            <Box mb="lg">
              <Label>Subject</Label>
              <Input width={1} value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} required />
            </Box>
            <Box mb="lg">
              <Label>Message</Label>
              <TextArea rows={8} value={composeBody} onChange={(e) => setComposeBody(e.target.value)} required />
            </Box>
            
            {error && <Text color="danger" mb="lg">{error}</Text>}
            {successMsg && <Text color="success" mb="lg">{successMsg}</Text>}

            <Button variant="primary" type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Box>
      )}

      {selectedEmail && (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" bg="rgba(0,0,0,0.5)" zIndex="1000" flex alignItems="center" justifyContent="center">
          <Box bg="white" p="xl" borderRadius="lg" maxWidth="800px" width="90%" maxHeight="90%" overflowY="auto">
            <Box flex justifyContent="space-between" mb="lg">
              <H2>{selectedEmail.subject}</H2>
              <Button onClick={() => setSelectedEmail(null)}>Close</Button>
            </Box>
            <Box mb="lg" pb="md" borderBottom="1px solid #eee">
              <Text><strong>From:</strong> {selectedEmail.from}</Text>
              <Text><strong>To:</strong> {selectedEmail.to}</Text>
              <Text><strong>Date:</strong> {new Date(selectedEmail.date).toLocaleString()}</Text>
            </Box>
            <Box mt="lg">
              <div dangerouslySetInnerHTML={{ __html: typeof selectedEmail.html === 'string' ? selectedEmail.html.replace(/\n/g, '<br/>') : 'No content' }} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmailDashboard;
