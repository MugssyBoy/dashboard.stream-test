'use client';

import React, { useEffect, useState } from 'react';
import {
    StreamVideoClient,
    StreamCall,
    StreamVideo,
    StreamTheme,
    SpeakerLayout,
    CallControls,
    User
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';

export default function VideoPage() {
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<any>(null); // Replace `any` with proper type if needed

    useEffect(() => {
        const setup = async () => {
            const apiKey = 'mx2mjcgay2zt'; // 🔑 Replace with your real API key
            const userId = 'eaQKEZ0ZJqhBu1jYLOBnAbJWPnr1'; // ✅ Replace with the authenticated user id
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZWFRS0VaMFpKcWhCdTFqWUxPQm5BYkpXUG5yMSIsInZhbGlkaXR5X2luX3NlY29uZHMiOjg2NDAwLCJpYXQiOjE3NTI5MTg4NjEsImV4cCI6MTc1MzAwNTI2MX0.q5ocmEifArTBHBnX5kgZa5K4WLr8nAWyys1o1cRkyrk';

            const user: User = { id: userId, name: 'Test User' };

            const videoClient = new StreamVideoClient({ apiKey, user, token });
            const streamCall = videoClient.call('audio_room', '5c76205f-74fa-474c-8a3c-ce6bb5d5665d');

            await streamCall.join();




            setClient(videoClient);
            setCall(streamCall);
        };

        setup();
    }, []);

    if (!client || !call) return <p>Loading...</p>;

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <StreamTheme>
                    <SpeakerLayout />
                    <CallControls />
                </StreamTheme>
            </StreamCall>
        </StreamVideo>
    );
}
