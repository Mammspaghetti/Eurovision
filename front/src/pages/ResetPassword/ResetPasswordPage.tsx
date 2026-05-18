import { useState } from "react";
import { Link } from "react-router-dom";
import ConfettiStars from "@/components/ConfettiStars";

export default function ResetPasswordLinkPage() {
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
        const response = await fetch(
            "https://eurovision-back.onrender.com/users/reset-password",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pseudo,
                email,
                new_password: newPassword,
            }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail);
        }

        setMessage("Mot de passe modifié !");
        } catch (error) {
        setMessage("Utilisateur introuvable");
        console.error(error);
        }
    };

    return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
        
        <div className="absolute inset-0 z-0">
            <ConfettiStars />
        </div>

        <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">
            Mot de passe oublié
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
            Entrez vos informations pour
            réinitialiser votre mot de passe.
        </p>

        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <div>
            <label className="block text-sm font-medium mb-1.5">
                Pseudo
            </label>

            <input
                type="text"
                value={pseudo}
                onChange={(e) =>
                setPseudo(e.target.value)
                }
                placeholder="Votre pseudo"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            </div>

            <div>
            <label className="block text-sm font-medium mb-1.5">
                Email
            </label>

            <input
                type="email"
                value={email}
                onChange={(e) =>
                setEmail(e.target.value)
                }
                placeholder="Votre email"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            </div>

            <div>
            <label className="block text-sm font-medium mb-1.5">
                Nouveau mot de passe
            </label>

            <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                setNewPassword(e.target.value)
                }
                placeholder="Nouveau mot de passe"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            </div>

            <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
            Reset Password
            </button>

            {/* MESSAGE + RETOUR LOGIN */}
            {message && (
            <div className="flex flex-col items-center gap-3 pt-2">
                <p className="text-sm text-center">
                {message}
                </p>

                {message === "Mot de passe modifié !" && (
                <Link
                    to="/"
                    className="w-full text-center py-3 rounded-lg border border-border hover:bg-accent transition"
                >
                    Retour au login
                </Link>
                )}
            </div>
            )}
        </form>
        </div>
    </div>
    );
}