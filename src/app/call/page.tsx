'use client';

import {
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Paper,
    Stack,
    Button,
    Box,
    Card,
    CardContent,
} from '@mui/material';

import Grid from '@mui/material/Grid';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PeopleIcon from '@mui/icons-material/People';
import CallIcon from '@mui/icons-material/Call';

import { db } from '../../firebase/config';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

type ActiveCall = {
    id: string;
    call_cid: string;
    call_status: 'completed' | 'pending' | 'ongoing' | 'missed';
    created_by: {
        banned: boolean;
        id: string;
        name: string;
    };
    created_at: Timestamp;
    updated_at: Timestamp;
    topic?: string;
    priority?: 'High' | 'Medium' | 'Low';
    custom?: {
        topic?: string;
        priority?: 'High' | 'Medium' | 'Low';
        [key: string]: any;
    };
};

const formatWaitTime = (timestamp: Timestamp) => {
    const now = new Date().getTime();
    const created = timestamp.toDate().getTime();
    const diff = Math.floor((now - created) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return { minutes, seconds, total: diff };
};

const displayTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
};

export default function ActiveCallsPage() {
    const [calls, setCalls] = useState<ActiveCall[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'active_calls'), orderBy('created_at', 'asc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const updated = snapshot.docs.map((doc) => {
                const data = doc.data() as ActiveCall;
                return {
                    ...data,
                    id: doc.id,
                };
            });
            setCalls(updated);
        });

        return () => unsub();
    }, []);

    const totalCalls = calls.length;
    const waitTimes = calls.map((c) => formatWaitTime(c.created_at).total);
    const avgWait = waitTimes.length > 0 ? Math.floor(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) : 0;
    const longestWait = waitTimes.length > 0 ? Math.max(...waitTimes) : 0;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Call Queue
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Manage incoming calls and connect with customers.
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2">Total Calls Waiting</Typography>
                                <PeopleIcon fontSize="small" />
                            </Stack>
                            <Typography variant="h6" fontWeight="bold" mt={1}>
                                {totalCalls}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2">Average Wait Time</Typography>
                                <AccessTimeIcon fontSize="small" />
                            </Stack>
                            <Typography variant="h6" fontWeight="bold" mt={1}>
                                {displayTime(avgWait)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2">Longest Wait Time</Typography>
                                <WarningAmberIcon fontSize="small" color="error" />
                            </Stack>
                            <Typography variant="h6" fontWeight="bold" mt={1} color="error">
                                {displayTime(longestWait)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            {/* Active Calls Table */}
            <Paper elevation={2}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Customer</strong></TableCell>
                                <TableCell><strong>Wait Time</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {calls.map((call) => {
                                const cleanId = call.id.split(':')[1];
                                const wait = formatWaitTime(call.created_at);

                                return (
                                    <TableRow key={call.id} hover>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Avatar sx={{ bgcolor: '#ccc', width: 32, height: 32 }}>
                                                    {call.created_by.name.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2">{call.created_by.name}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <AccessTimeIcon sx={{ fontSize: 18, color: 'gray' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {displayTime(wait.total)}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={call.call_status}
                                                color="secondary"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<CallIcon />}
                                                onClick={() => (window.location.href = `/call/${cleanId}`)}
                                            >
                                                Join Call
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {calls.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ padding: '2rem' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No active calls at the moment.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
