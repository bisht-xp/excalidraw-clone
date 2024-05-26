"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const socket = io("ws://localhost:8001");

export default function Home() {
  type Default = ReturnType<typeof io>;
  // const [socket, setSocket] = useState<Default| null>();
  const containerRef = useRef(null);
  // const [isConnected, setIsConnected] = useState<boolean>(false);
  const [cursors, setCursors] = useState<any>({});
  useEffect(() => {
    // setSocket(newSocket);
    socket.on("pointerMove", (data: any) => {
      setCursors((prev: any) => ({ ...prev, name: data.id, [data.id]: data.position }));
    });

    socket.on("userDisconnect", (data: any) => {
      setCursors((prev: any) => {
        const { [data.id]: _, ...rest } = prev;
        return rest;
      });
    });

    return () => {
      socket.off("pointerMove");
      socket.off("userDisconnect");
    };
  }, []);

  const handlePointerMove = (event: any) => {
    const position = { x: event.clientX, y: event.clientY };
    socket.emit("pointerMove", position);
  };

  // console.log("curor  ", cursors.name[3]);
  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {Object.keys(cursors).map((key) => (
        <div
          key={key}
          // className="cursor-pointer "
          id={key}
          style={{
            position: "absolute",
            left: cursors[key].x,
            top: cursors[key].y,
            // width: 10,
            // height: 10,
            // backgroundColor: "red",
            // borderRadius: "50%",
            // transform: "translate(-50%, -50%)",
            // pointerEvents: "none",
            // cursorColor: "red",
            
          }}
        >
          <div
            style={{
              backgroundColor: 'blue',
              // backgroundColor: "red",
              width: 10,
              height: 10,
              borderRadius: "50%",
            }}
          />
          <div style={{ marginTop: 5, color: "black", fontSize: 12 }}>
            {cursors.name}
          </div>
        </div>
      ))}
    </div>
  );
}
