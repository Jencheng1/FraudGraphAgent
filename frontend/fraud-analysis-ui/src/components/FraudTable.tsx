import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import { FraudAccount, FraudCluster } from '../types';
import { ApiService } from '../services/ApiService';

interface FraudTableProps {
  query?: string;
}

const FraudTable: React.FC<FraudTableProps> = ({ query }) => {
  const [accounts, setAccounts] = useState<FraudAccount[]>([]);
  const [clusters, setClusters] = useState<FraudCluster[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const accountsData = await ApiService.getFraudAccounts();
        const clustersData = await ApiService.getFraudClusters();
        
        setAccounts(accountsData);
        setClusters(clustersData);
      } catch (err) {
        console.error('Error fetching fraud data:', err);
        setError('Failed to load fraud data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      
      const executeQuery = async () => {
        try {
          const result = await ApiService.executeQuery(query);
          if (result.accounts) {
            setAccounts(result.accounts);
          }
          if (result.clusters) {
            setClusters(result.clusters);
          }
        } catch (err) {
          console.error('Error executing query:', err);
          setError('Failed to execute query. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      executeQuery();
    }
  }, [query]);

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Fraud Analysis Results</Typography>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>Loading fraud data...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
        ) : (
          <>
            {clusters.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Detected Fraud Clusters</Typography>
                <TableContainer component={Paper} elevation={1} sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Cluster ID</TableCell>
                        <TableCell>IP Address</TableCell>
                        <TableCell>Accounts</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Confidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clusters.map((cluster) => (
                        <TableRow key={cluster.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>{cluster.id}</TableCell>
                          <TableCell>{cluster.ip}</TableCell>
                          <TableCell>{cluster.accounts.length}</TableCell>
                          <TableCell>{formatDateTime(cluster.timestamp)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${(cluster.confidence * 100).toFixed(0)}%`} 
                              color={cluster.confidence > 0.8 ? "error" : "warning"} 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Accounts</Typography>
            <TableContainer component={Paper} elevation={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Login Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow 
                      key={account.id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        bgcolor: account.isFraudulent ? 'rgba(255, 0, 0, 0.05)' : 'inherit'
                      }}
                    >
                      <TableCell>{account.username}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.ip}</TableCell>
                      <TableCell>{formatDateTime(account.loginTime)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={account.isFraudulent ? "Fraudulent" : "Legitimate"} 
                          color={account.isFraudulent ? "error" : "success"} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default FraudTable;
