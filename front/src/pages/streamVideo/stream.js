import React, { useEffect } from "react";
import {
  CallingState,
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  useCall,
  useCallStateHooks,
  ParticipantView,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import { Spin } from "antd";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "../../assets/css/stream.css";

const apiKey = process.env.REACT_APP_STREAM_API_KEY;
const token = process.env.REACT_APP_TOKEN;
const userId = process.env.REACT_APP_USER_ID;
const callId = process.env.REACT_APP_CALL_ID;

const user = {
  id: userId,
  name: "My User",
  image: "",
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);

const MyUILayout = () => {
  //const call = useCall();
  const {
    useCallCallingState,
    //useParticipantCount,
    // useLocalParticipant,
    // useRemoteParticipants,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  //   const participantCount = useParticipantCount();
  //   const localParticipant = useLocalParticipant();
  //   const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return (
      <div>
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
        Joining call...
      </div>
    );
  }

  return (
    // <div>
    //   Call "{call?.id}" has {participantCount} participant(s)</div>
    <StreamTheme
      className="str-video"
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* <MyParticipantList participants={remoteParticipants} />
      <MyFloatingLocalPartcipant participant={localParticipant} /> */}
      <div className="video-container">
        <SpeakerLayout participantsBarPosition="bottom" />
        <CallControls />
      </div>
    </StreamTheme>
  );
};

export const MyParticipantList = ({ participants }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        width: "75vw",
      }}
    >
      {participants.map((participant) => (
        <div style={{ width: "100%", aspectRatio: "3/2" }}>
          <ParticipantView
            muteAudio
            participant={participant}
            key={participant.sessionId}
          />
        </div>
      ))}
    </div>
  );
};

export const MyFloatingLocalPartcipant = ({ participant }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "15px",
        left: "15px",
        width: "240px",
        height: "135px",
        boxShadow: "rgba(0,0,0,0.1) 0px 0px 10px 3px",
        borderRadius: "12px",
      }}
    >
      {participant && <ParticipantView muteAudio participant={participant} />}
    </div>
  );
};

const StreamVideoApp = () => {
  useEffect(() => {
    call.join({ create: true });
  }, []);

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
};

export default StreamVideoApp;
