"use client";

import { useAnchorStore } from "@/store/useAnchorStore";
import useOverwhelmSession from "@/hooks/useOverwhelmSession";
import SanctuaryShell from "./SanctuaryShell";
import BreathingRoom from "./tabs/BreathingRoom";
import BrainDump from "./tabs/BrainDump";
import TinyWinSpinner from "./tabs/TinyWinSpinner";
import KindnessMirror from "./tabs/KindnessMirror";

interface OverwhelmSanctuaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const OverwhelmSanctuary = ({ isOpen, onClose }: OverwhelmSanctuaryProps) => {
  const activeSanctuaryTab = useAnchorStore((s) => s.activeSanctuaryTab);
  const { trackTabVisit, closeSession } = useOverwhelmSession();

  const handleClose = () => {
    closeSession();
    onClose();
  };

  const renderTab = () => {
    switch (activeSanctuaryTab) {
      case "breathing":
        return <BreathingRoom />;
      case "braindump":
        return <BrainDump />;
      case "tinywin":
        return <TinyWinSpinner />;
      case "kindness":
        return <KindnessMirror />;
      default:
        return <BreathingRoom />;
    }
  };

  return (
    <SanctuaryShell
      isOpen={isOpen}
      onClose={handleClose}
      activeTab={activeSanctuaryTab}
      onTabChange={trackTabVisit}
    >
      {renderTab()}
    </SanctuaryShell>
  );
};

export default OverwhelmSanctuary;
