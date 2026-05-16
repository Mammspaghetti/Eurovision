type Props = {
  leaderboard: any[];
  onClose: () => void;
};

export default function ResultAdminPopup({ leaderboard, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      
      <div className="bg-card p-6 rounded-xl w-[400px] space-y-3">

        <h2 className="text-xl font-bold">🏆 Classement final</h2>

        <button onClick={onClose} className="absolute top-3 right-3">
          ✖
        </button>

        <div className="space-y-2 max-h-[400px] overflow-auto">

          {leaderboard.map((u, i) => (
            <div
              key={u.user_id}
              className="flex justify-between p-2 border rounded"
            >
              <p>
                {i + 1}. User {u.user_id}
              </p>

              <p className="font-bold text-primary">
                {u.score}
              </p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}