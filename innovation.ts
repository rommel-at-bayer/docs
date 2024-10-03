const captureScreenshot = async (element) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const screenshot = document.createElement("screenshot");

  try {
    console.log("context", context, typeof context);
    const captureStream = await navigator.mediaDevices.getDisplayMedia();
    screenshot.srcObject = captureStream;
    console.log("screenshot", screenshot);
    context.drawImage(screenshot, 0, 0, window.width, window.height);
    const frame = canvas.toDataURL("image/png");
    captureStream.getTracks().forEach((track) => track.stop());
    window.location.href = frame;
  } catch (err) {
    console.error("Error: " + err);
  }
};

window.addEventListener("mouseover", captureScreenshot);

import { useState, type ReactElement } from "react";
import type { ReadonlyDeep } from "@farmer-exp/transformers";
import { Button } from "@element/react-button";
import { Padding } from "@element/react-padding";
import { SideSheet } from "@element/react-side-sheet";
import { TabBar, Tab } from "@element/react-tabs";
import FeedbackModal from "../feedback-modal/FeedbackModal";
import html2canvas from "html2canvas";
import * as htmlToImage from "html-to-image";

type IssueDetailSideSheetProps = ReadonlyDeep<{
  isSideSheetOpen: boolean;
  setSideSheetOpen: (isOpen: boolean) => void;
}>;

export const FeedbackSideSheet = ({
  isSideSheetOpen,
  setSideSheetOpen,
}: IssueDetailSideSheetProps): ReactElement => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabActivated = (index: number): void => {
    setCurrentTab(index);
  };

  const captureScreen = () => {
    html2canvas(document.body).then(function (canvas) {
      canvas.toBlob(function (blob) {
        const img = document.createElement("img");
        if (blob) {
          const objectURL = URL.createObjectURL(blob);
          img.src = objectURL;
          document.body.appendChild(img);
          const formData = new FormData();
          formData.append("my-file", blob, "filename.png");
          fetch("www.example.com", { body: formData, method: "post" });
        }
      });
    });
  };

  const captureScreen2 = () => {
    htmlToImage.toBlob(document.body).then(function (blob) {
      console.log(blob);
      const img = document.createElement("img");
      const objectURL = URL.createObjectURL(blob);
      img.src = objectURL;
      document.body.appendChild(img);
      const formData = new FormData();
      formData.append("my-file", blob, "filename.png");
      fetch("www.example.com", { body: formData, method: "post" });
    });
  };

  return (
    <SideSheet
      open={isSideSheetOpen}
      onClose={() => setSideSheetOpen(false)}
      title="Report Issue"
    >
      <TabBar
        clustered={false}
        stacked={false}
        activeTabIndex={currentTab}
        onTabActivated={handleTabActivated}
      >
        <Tab indicatorSize="content">Need Help</Tab>
        <Tab indicatorSize="content">Feedback</Tab>
      </TabBar>
      <Padding>
        {currentTab === 0 && (
          <div>
            <Button onClick={captureScreen}>Open Modal</Button>
            <Button onClick={captureScreen2}>Other screen Capture</Button>
          </div>
        )}
        {currentTab === 1 && <div>Tab 2 Content</div>}
      </Padding>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Submit Issue"
      >
        <div>Hello</div>
      </FeedbackModal>
    </SideSheet>
  );
};

export default FeedbackSideSheet;
