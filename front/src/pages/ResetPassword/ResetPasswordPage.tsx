import { useState } from "react";

export default function ResetPasswordLinkPage() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // appel API ici
        console.log("Reset password for:", email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold mb-2">
                Mot de passe oublié
                </h1>

                <p className="text-sm text-muted-foreground mb-6">
                Entrez votre email pour recevoir un lien de réinitialisation.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">
                    Email
                    </label>

                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                >
                    Reset Password
                </button>
                </form>
            </div>
        </div>
    );
}