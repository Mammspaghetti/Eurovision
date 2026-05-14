import { ArrowLeft } from "lucide-react";

type Props = {
  onBack: () => void;
};

const ResultsHeader = ({ onBack }: Props) => {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-muted-foreground mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      Retour
    </button>
  );
};

export default ResultsHeader;