import NeonButton from "@/components/NeonButton";
import { Eye } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  showComparison: boolean;
  setShowComparison: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
};

const ResultsToggle = ({
  showComparison,
  setShowComparison,
  disabled
}: Props) => {

  if (disabled) return null;

  return (
    <NeonButton
      onClick={() => setShowComparison((v: any) => !v)}
      className="w-full mt-6"
    >
      <Eye className="w-4 h-4 mr-2 inline" />

      {showComparison
        ? "Voir le classement final"
        : "Comparer avec mon classement"}
    </NeonButton>
  );
};

export default ResultsToggle;