'use client';

import React, { useEffect, useState } from 'react';
import {
    StreamVideoClient,
    StreamCall,
    StreamVideo,
    StreamTheme,
    SpeakerLayout,
    CallControls,
    User,
    Call,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useParams } from 'next/navigation';

import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    TextField,
    Stack,
    LinearProgress,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SendIcon from '@mui/icons-material/Send';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

export default function CallPage() {
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<Call | null>(null);
    const params = useParams();
    const callId = (params?.id as string)?.replace('audio_room:', '');

    useEffect(() => {
        const setup = async () => {
            const apiKey = 'mx2mjcgay2zt';
            const userId = 'eaQKEZ0ZJqhBu1jYLOBnAbJWPnr1';
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZWFRS0VaMFpKcWhCdTFqWUxPQm5BYkpXUG5yMSIsInZhbGlkaXR5X2luX3NlY29uZHMiOjg2NDAwLCJpYXQiOjE3NTI5MTg4NjEsImV4cCI6MTc1MzAwNTI2MX0.q5ocmEifArTBHBnX5kgZa5K4WLr8nAWyys1o1cRkyrk';

            const user: User = { id: userId, name: 'Test User' };
            const videoClient = new StreamVideoClient({ apiKey, user, token });
            const streamCall = videoClient.call('audio_room', callId);
            await streamCall.join();

            setClient(videoClient);
            setCall(streamCall);
        };

        if (callId) setup();
    }, [callId]);

    if (!client || !call) return <p>Loading call...</p>;

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <StreamTheme>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="flex-start"
                        sx={{ px: 2, py: 2 }}
                    >
                        {/* Call screen - wider card */}
                        <Grid item xs={12} md={9}>
                            <Paper
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        backgroundColor: '#eee',
                                        borderRadius: 2,
                                        mb: 2,
                                        minHeight: 500,
                                    }}
                                >
                                    <SpeakerLayout />
                                </Box>
                                <CallControls />
                            </Paper>
                        </Grid>

                        {/* Right Sidebar */}
                        <Grid item xs={12} md={3}>
                            <Paper
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Call Information
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Customer Details
                                    </Typography>
                                    <Typography>Name: John Doe</Typography>
                                    <Typography>Phone: (555) 123-4567</Typography>
                                    <Typography>Account ID: CUST-00123</Typography>

                                    <Box mt={2}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Call Sentiment
                                        </Typography>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <InfoOutlinedIcon color="warning" fontSize="small" />
                                            <LinearProgress
                                                variant="determinate"
                                                value={57}
                                                sx={{ flexGrow: 1 }}
                                            />
                                            <Typography variant="body2">57%</Typography>
                                        </Stack>
                                    </Box>

                                    <Box mt={3}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Quick Actions
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<SwapHorizIcon />}
                                                fullWidth
                                            >
                                                Transfer Call
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<SendIcon />}
                                                fullWidth
                                            >
                                                Send Message
                                            </Button>
                                        </Stack>
                                    </Box>

                                    <Box mt={3}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Call Notes
                                        </Typography>
                                        <TextField
                                            multiline
                                            rows={4}
                                            fullWidth
                                            placeholder="Type your call notes here…"
                                        />
                                    </Box>
                                </Box>

                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{ mt: 2 }}
                                    fullWidth
                                >
                                    Save Notes & End Wrap-up
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </StreamTheme>
            </StreamCall>
        </StreamVideo>
    );
}
