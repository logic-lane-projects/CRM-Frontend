import { Button, Tooltip } from "@shopify/polaris";
import { MicrophoneIcon,StopCircleIcon } from '@shopify/polaris-icons';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

type Props = {
  audioFile: File|null;
  setAudioFile: (open: File|null) => void;
}

const AudioRecorderComponent = ({ audioFile, setAudioFile }: Props) => {
  // Función para manejar la grabación
  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob: Blob) => {
    const file = new File([blob], "recording.mp3", { type: "audio/mp3" });
    setAudioFile(file);
  };

  return (
    <>
      <div className="!hidden">
        <AudioRecorder
          onRecordingComplete={(blob) => addAudioElement(blob)}
          recorderControls={recorderControls}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }} 
          downloadFileExtension="mp3"
        />
      </div>
      <Tooltip 
      content={
        audioFile !== null ? "Remplazar grabación" :
        recorderControls.isRecording ? "Detener grabación" : "Iniciar grabación"
      }
      >
        <div className={`transition-all duration-1000 ${recorderControls.isRecording ? "[&_button]:bg-[#232323] [&_button]:hover:bg-[#232323]" : "[&_button]:bg-[#E9E9E9]"} flex justify-center items-center mr-1`}>
          <Button 
            variant="tertiary"
            icon={recorderControls.isRecording ? StopCircleIcon : MicrophoneIcon}
            onClick={() => {
              if(recorderControls.isRecording){
                recorderControls.stopRecording();
              }else{
                recorderControls.startRecording();
              }
            }}
          />
        </div>
      </Tooltip>
    </>
  );
};

export default AudioRecorderComponent;