import { component$, useComputed$, useSignal } from '@builder.io/qwik'
import './app.css'
import QRcode from "qrcode";

export const App = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();
  
  const qrDataUrl = useComputed$(async () => {
    if(canvasRef.value) {
    QRcode.toCanvas(canvasRef.value, "https://qwik.builder.io/docs/components/tasks/#usetask");
     return await QRcode.toDataURL("https://qwik.builder.io/docs/components/tasks/#usetask");
    }
    return
  })
  


  return (
    <div class="flex h-[400px] min-w-[300px] flex-col items-center justify-center">
      <h1 class="text-3xl font-bold">QR Code Generator based on Qwik</h1>
      <input
        class="rounded p-2 outline outline-black"
        placeholder="Input text to encode..."
      />

      <canvas
        ref={canvasRef}
        class="m-4 h-0 w-0 rounded outline outline-black"
      ></canvas>

      <a href={qrDataUrl.value} download="qrcode.png">
        Download
      </a>
    </div>
  );
});
