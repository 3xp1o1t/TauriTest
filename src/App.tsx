import { invoke } from "@tauri-apps/api";
import { ask } from "@tauri-apps/api/dialog";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
import { Command } from "@tauri-apps/api/shell";
import { useState } from "react";
import { Sidemenu } from "./components/side-menu";
import { Button } from "./components/ui/button";

function App() {
  const [rustMsg, setRustMsg] = useState("");
  const [sysInfo, setSysInfo] = useState("");

  const handleClick = () => {
    invoke("greet", { name: "Jesus" }).then((res) => setRustMsg(res as string));
  };

  const systemInfo = () => {
    invoke("info").then((res) => setSysInfo(res as string));
  };

  const handleClickDialog = async () => {
    const yes = await ask("Are you sure?", "Tauri App");
    const yes2 = await ask("This action cannot be reverted. Are you sure?", {
      title: "Tauri app",
      type: "error",
      okLabel: "Ahuevo",
      cancelLabel: "Nel",
    });
    console.log(yes, yes2);
  };

  const sendANotification = async () => {
    let permissionGranted = await isPermissionGranted();
    if (!isPermissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }

    if (permissionGranted) {
      sendNotification("Tauri is awesome!");
      sendNotification({
        title: "Tauri App",
        body: "This is the body!",
        sound: "Alarm8",
        icon: "error",
      });
    }
  };

  const openNotepad = async () => {
    const cmd = new Command("hello");
    await cmd.execute();
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold underline">Hola Tauri</h1>
      <Button type="button" onClick={handleClick}>
        Click me
      </Button>
      <p>{rustMsg}</p>
      <Button variant={"ghost"} type="button" onClick={handleClickDialog}>
        Open dialogs
      </Button>
      <Button variant={"destructive"} type="button" onClick={sendANotification}>
        Send notification
      </Button>
      <Button variant={"secondary"} type="button" onClick={openNotepad}>
        Notepad
      </Button>
      <Sidemenu />
      <Button type="button" onClick={systemInfo}>
        Sys info
      </Button>
      {sysInfo ? (
        <p className="text-sm font-bold text-sky-900">{sysInfo}</p>
      ) : (
        <p className="text-sm font-semibold text-rose-500">No system info</p>
      )}
    </div>
  );
}

export default App;
