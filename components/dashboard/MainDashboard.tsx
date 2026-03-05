"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { useAnchorStore } from "@/store/useAnchorStore";
import useGentleToast from "@/hooks/useGentleToast";
import useStreaks from "@/hooks/useStreaks";
import useSoftSpace from "@/hooks/useSoftSpace";
import useEveningUnwind from "@/hooks/useEveningUnwind";
import { useFirestoreSync } from "@/hooks/useFirestoreSync";
import DailyHeader from "./DailyHeader";
import ProgressWhisper from "./ProgressWhisper";
import TaskInput from "@/components/tasks/TaskInput";
import TaskCard from "@/components/tasks/TaskCard";
import EmptyTaskState from "@/components/tasks/EmptyTaskState";
import TaskBreakdownModal from "@/components/tasks/TaskBreakdownModal";
import CompletionCelebration from "@/components/tasks/CompletionCelebration";
import GentleToastContainer from "@/components/ui/GentleToast";
import OverwhelmFAB from "@/components/overwhelm/OverwhelmFAB";
import OverwhelmSanctuary from "@/components/overwhelm/OverwhelmSanctuary";
import SpiralDetector from "@/components/overwhelm/SpiralDetector";
import SpaceSelector from "@/components/spaces/SpaceSelector";
import SpaceBackground from "@/components/spaces/SpaceBackground";
import SpaceAudio from "@/components/spaces/SpaceAudio";
import GentleStreakCard from "@/components/streaks/GentleStreakCard";
import SoftWinLogger from "@/components/streaks/SoftWinLogger";
import MilestoneCelebration from "@/components/streaks/MilestoneCelebration";
import DailySummary from "@/components/summary/DailySummary";
import EveningGate from "@/components/evening/EveningGate";
import EveningUnwind from "@/components/evening/EveningUnwind";
import ChatNavButton from "@/components/chat/ChatNavButton";

const MainDashboard = () => {
  // ─── Firebase Sync ───
  useFirestoreSync();

  const tasks = useAnchorStore((s) => s.tasks);
  const isBreakdownLoading = useAnchorStore((s) => s.isBreakdownLoading);
  const showCelebration = useAnchorStore((s) => s.showCelebration);
  const lastCompletedTaskTitle = useAnchorStore(
    (s) => s.lastCompletedTaskTitle
  );
  const setShowCelebration = useAnchorStore((s) => s.setShowCelebration);
  const sanctuaryOpen = useAnchorStore((s) => s.sanctuaryOpen);
  const setSanctuaryOpen = useAnchorStore((s) => s.setSanctuaryOpen);

  // Stage 5 hooks
  const { space } = useSoftSpace();
  const { newBadge, dismissNewBadge, logWin } = useStreaks();
  const { openEvening } = useEveningUnwind();
  const [eveningOpen, setEveningOpen] = useState(false);

  // Initialize toast auto-removal
  useGentleToast();

  // Log app-open on mount (in useEffect to avoid setState during render)
  const hasLoggedOpen = useRef(false);
  useEffect(() => {
    if (!hasLoggedOpen.current) {
      hasLoggedOpen.current = true;
      logWin("app-open");
    }
  }, [logWin]);

  const handleOpenEvening = useCallback(() => {
    openEvening();
    setEveningOpen(true);
  }, [openEvening]);

  const activeTasks = tasks.filter(
    (t) => t.status === "pending" || t.status === "in-progress"
  );
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <>
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "40px 24px 120px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Daily header */}
        <DailyHeader />

        {/* Space selector */}
        <div style={{ marginBottom: "16px" }}>
          <SpaceSelector />
        </div>

        {/* Chat button */}
        <div style={{ marginBottom: "16px" }}>
          <ChatNavButton />
        </div>

        {/* Streak + summary */}
        <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <GentleStreakCard />
          <DailySummary />
          <SoftWinLogger />
        </div>

        {/* Task input */}
        <div style={{ marginBottom: "32px" }}>
          <TaskInput />
        </div>

        {/* Task list */}
        <div>
          <AnimatePresence mode="popLayout">
            {activeTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </AnimatePresence>

          {activeTasks.length === 0 && doneTasks.length === 0 && (
            <EmptyTaskState />
          )}
        </div>

        {/* Completed tasks (dimmed) */}
        {doneTasks.length > 0 && (
          <div style={{ marginTop: "24px", opacity: 0.5 }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                marginBottom: "12px",
                textTransform: "lowercase",
              }}
            >
              completed today ✨
            </p>
            <AnimatePresence>
              {doneTasks.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Progress whisper */}
        <ProgressWhisper />
      </div>

      {/* Breakdown loading modal */}
      <TaskBreakdownModal
        isOpen={isBreakdownLoading}
        task=""
        onClose={() => {}}
      />

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <CompletionCelebration
            taskTitle={lastCompletedTaskTitle}
            onDismiss={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>

      {/* Toasts */}
      <GentleToastContainer />

      {/* Overwhelm FAB */}
      <OverwhelmFAB />

      {/* Spiral detector */}
      <SpiralDetector />

      {/* Overwhelm Sanctuary */}
      <OverwhelmSanctuary
        isOpen={sanctuaryOpen}
        onClose={() => setSanctuaryOpen(false)}
      />

      {/* Space background overlay */}
      <SpaceBackground space={space} />

      {/* Space audio engine */}
      <SpaceAudio />

      {/* Evening gate nudge */}
      <EveningGate onOpen={handleOpenEvening} />

      {/* Evening unwind full-screen */}
      <EveningUnwind
        open={eveningOpen}
        onClose={() => setEveningOpen(false)}
      />

      {/* Milestone badge celebration */}
      <MilestoneCelebration
        badge={newBadge}
        onDismiss={dismissNewBadge}
      />
    </>
  );
};

export default MainDashboard;
