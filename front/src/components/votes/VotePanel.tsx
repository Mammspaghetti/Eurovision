import NeonButton from "@/components/NeonButton";
import { CheckCircle, Clock, FileText, Rocket } from "lucide-react";

type VoteStatus = "none" | "draft" | "submitted";

interface Props {
  voteStatus: VoteStatus;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onSimulate: () => void;
  isVoteOpen: boolean;
  isSubmitted: boolean;
}

export default function VotePanel({
  voteStatus,
  onSubmit,
  onSaveDraft,
  onSimulate,
  isVoteOpen,
  isSubmitted,
}: Props) {
  return (
    <div className="fixed right-4 top-36 w-80 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl p-5 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white text-base">
          État du vote
        </h3>

        <Clock className="w-4 h-4 text-white/50" />
      </div>

      {/* STATUS CARD */}
      <div className="rounded-xl p-3 border border-white/10 bg-white/5">
        {voteStatus === "none" && (
          <div className="text-sm text-red-400 flex items-center gap-2">
            ❌ Aucun vote enregistré
          </div>
        )}

        {voteStatus === "draft" && (
          <div className="text-sm text-yellow-300 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Brouillon sauvegardé
          </div>
        )}

        {voteStatus === "submitted" && (
          <div className="text-sm text-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Vote validé
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="space-y-2 pt-2">

        <NeonButton
          onClick={onSubmit}
          disabled={!isVoteOpen || isSubmitted}
          className="w-full py-2 text-sm flex items-center justify-center gap-2"
        >
          <Rocket className="w-4 h-4" />
          Valider le vote
        </NeonButton>

        <NeonButton
          onClick={onSaveDraft}
          disabled={isSubmitted}
          className="w-full py-2 text-sm border border-pink-500/40 text-pink-300 bg-transparent hover:bg-pink-500 hover:text-white transition"
        >
          💾 Sauvegarder brouillon
        </NeonButton>

        <NeonButton
          onClick={onSimulate}
          className="w-full py-2 text-sm border border-purple-500/40 text-purple-300 bg-transparent hover:bg-purple-500 hover:text-white transition"
        >
          🎲 Simuler résultats
        </NeonButton>

      </div>
    </div>
  );
}