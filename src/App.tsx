import "./App.css";
import { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { FaceMesh } from "@tensorflow-models/facemesh";
import { drawMesh } from "./utils/face";
tf.setBackend("webgl");
function App() {
  const webCamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const runFaceMesh = async () => {
    const net = await facemesh.load();
    setInterval(() => {
      detect(net);
    }, 10);
  };
  const detect = async (net: FaceMesh) => {
    if (webCamRef.current && webCamRef.current.video) {
      const video = webCamRef.current.video as HTMLVideoElement;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (videoWidth && videoHeight) {
        video.width = videoWidth;
        video.height = videoHeight;
      }
      const face = await net.estimateFaces(video as HTMLVideoElement);

      const ctx = canvasRef.current?.getContext("2d");
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
      }

      if (ctx) {
        drawMesh(face, ctx);
      }
    }
  };
  runFaceMesh();
  return (
    <div>
      <Webcam
        ref={webCamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 740,
          height: 580,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          background: "black",
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 1000,
          width: 740,
          height: 580,
        }}
      />
    </div>
  );
}

export default App;
