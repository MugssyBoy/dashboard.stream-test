import {
    useCallStateHooks,
    ParticipantView,
} from "@stream-io/video-react-sdk";

export const MyVideoUI = () => {
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    if (participants.length === 0) {
        return <p>No participants in the call</p>; // Helpful for debugging
    }

    return (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {participants.map((participant) => (
                <ParticipantView
                    key={participant.sessionId}
                    participant={participant}
                />
            ))}
        </div>
    );
};
