export interface Artist {
  id: string;
  country: string;
  artist: string;
  song: string;
  flag: string;
  youtubeUrl: string;
  photoUrl: string;
}

export const artists: Artist[] = [
  { id: "1", country: "Albanie", artist: "Alis", song: "Nân", flag: "🇦🇱", youtubeUrl: "https://www.youtube.com/watch?v=-2cZ-Ba6ygg", photoUrl: "/Eurovision/artists/alys.jpeg" },
  { id: "2", country: "Arménie", artist: "SIMÓN", song: "Paloma Rumba", flag: "🇦🇲", youtubeUrl: "https://www.youtube.com/watch?v=5EXoK-lgocw", photoUrl: "/Eurovision/artists/simon.jpg" },
  { id: "3", country: "Australie", artist: "Delta Goodrem", song: "Eclipse", flag: "🇦🇺", youtubeUrl: "https://www.youtube.com/watch?v=EUMCr1pnaMY", photoUrl: "/Eurovision/artists/delta.jpg" },
  { id: "4", country: "Autriche", artist: "COSMÓ", song: "Tanzschein", flag: "🇦🇹", youtubeUrl: "https://www.youtube.com/watch?v=SPpL_ZuRTZY", photoUrl: "/Eurovision/artists/cosmo.jpg" },
  { id: "5", country: "Azerbaïdjan", artist: "JIVA", song: "Just Go", flag: "🇦🇿", youtubeUrl: "https://www.youtube.com/watch?v=6", photoUrl: "/Eurovision/artists/jiva.jpg" },
  { id: "6", country: "Belgique", artist: "Essyla", song: "Dancing on the Ice", flag: "🇧🇪", youtubeUrl: "https://www.youtube.com/watch?v=aegnZvV3nlg&t=128", photoUrl: "/Eurovision/artists/essyla.jpg" },
  { id: "7", country: "Bulgarie", artist: "Dara", song: "Bangaranga", flag: "🇧🇬", youtubeUrl: "https://www.youtube.com/results?search_query=Dara+Bangaranga+Eurovision+2026", photoUrl: "/Eurovision/artists/dara.jpg" },
  { id: "8", country: "Croatie", artist: "Lelek", song: "Andromeda", flag: "🇭🇷", youtubeUrl: "https://www.youtube.com/results?search_query=Lelek+Andromeda+Eurovision+2026", photoUrl: "/Eurovision/artists/lelek.jpg" },
  { id: "9", country: "Chypre", artist: "Antigoni", song: "JALLA", flag: "🇨🇾", youtubeUrl: "https://www.youtube.com/results?search_query=Antigoni+JALLA+Eurovision+2026", photoUrl: "/Eurovision/artists/antigoni.jpg" },
  { id: "10", country: "Tchéquie", artist: "Daniel Zizka", song: "Crossroads", flag: "🇨🇿", youtubeUrl: "https://www.youtube.com/results?search_query=Daniel+Zizka+Crossroads+Eurovision+2026", photoUrl: "/Eurovision/artists/zizka.jpg" },
  { id: "11", country: "Danemark", artist: "Søren Torpegaard Lund", song: "Før vi går hjem", flag: "🇩🇰", youtubeUrl: "https://www.youtube.com/results?search_query=Søren+Torpegaard+Lund+Før+vi+går+hjem+Eurovision+2026", photoUrl: "/Eurovision/artists/sorenlund.jpg" },
  { id: "12", country: "Estonie", artist: "Vanilla Ninja", song: "Too Epic To Be True", flag: "🇪🇪", youtubeUrl: "https://www.youtube.com/results?search_query=Vanilla+Ninja+Too+Epic+To+Be+True+Eurovision+2026", photoUrl: "/Eurovision/artists/vanillaninja.jpg" },
  { id: "13", country: "Finlande", artist: "Linda Lampenius & Pete Parkkonen", song: "Liekinheitin", flag: "🇫🇮", youtubeUrl: "https://www.youtube.com/results?search_query=Linda+Lampenius+Pete+Parkkonen+Liekinheitin+Eurovision+2026", photoUrl: "/Eurovision/artists/linda.jpg" },
  { id: "14", country: "France", artist: "Monroe", song: "Regarde !", flag: "🇫🇷", youtubeUrl: "https://www.youtube.com/results?search_query=Monroe+Regarde+Eurovision+2026", photoUrl: "/Eurovision/artists/monroe.jpeg" },
  { id: "15", country: "Allemagne", artist: "Sarah Engels", song: "Fire", flag: "🇩🇪", youtubeUrl: "https://www.youtube.com/results?search_query=Sarah+Engels+Fire+Eurovision+2026", photoUrl: "/Eurovision/artists/sarahengels.jpg" },
  { id: "16", country: "Grèce", artist: "Akylas", song: "Ferto", flag: "🇬🇷", youtubeUrl: "https://www.youtube.com/results?search_query=Akylas+Ferto+Eurovision+2026", photoUrl: "/Eurovision/artists/akylas.jpg" },
  { id: "17", country: "Israël", artist: "Noam Bettan", song: "Michelle", flag: "🇮🇱", youtubeUrl: "https://www.youtube.com/results?search_query=Noam+Bettan+Michelle+Eurovision+2026", photoUrl: "/Eurovision/artists/noam.jpg" },
  { id: "18", country: "Italie", artist: "Sal Da Vinci", song: "Per Sempre Sì", flag: "🇮🇹", youtubeUrl: "https://www.youtube.com/results?search_query=Sal+Da+Vinci+Per+Sempre+Sì+Eurovision+2026", photoUrl: "/Eurovision/artists/saldavinci.jpeg" },

  { id: "19", country: "Lettonie", artist: "Atvara", song: "Ēnā", flag: "🇱🇻", youtubeUrl: "https://www.youtube.com/results?search_query=Atvara+Ēnā+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,Atvara" },
  { id: "20", country: "Lituanie", artist: "Lion Ceccah", song: "Sólo Quiero Más", flag: "🇱🇹", youtubeUrl: "https://www.youtube.com/results?search_query=Lion+Ceccah+Sólo+Quiero+Más+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,LionCeccah" },
  { id: "21", country: "Luxembourg", artist: "Eva Marija", song: "Mother Nature", flag: "🇱🇺", youtubeUrl: "https://www.youtube.com/results?search_query=Eva+Marija+Mother+Nature+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,EvaMarija" },
  { id: "22", country: "Malte", artist: "Aidan", song: "Bella", flag: "🇲🇹", youtubeUrl: "https://www.youtube.com/results?search_query=Aidan+Bella+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,Aidan" },
  { id: "23", country: "Moldavie", artist: "Satoshi", song: "Viva, Moldova!", flag: "🇲🇩", youtubeUrl: "https://www.youtube.com/results?search_query=Satoshi+Viva+Moldova+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,Satoshi" },
  { id: "24", country: "Monténégro", artist: "Tamara Živković", song: "Nova Zora", flag: "🇲🇪", youtubeUrl: "https://www.youtube.com/results?search_query=Tamara+Živković+Nova+Zora+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,TamaraZivkovic" },
  { id: "25", country: "Norvège", artist: "Jonas Lovv", song: "YA YA YA", flag: "🇳🇴", youtubeUrl: "https://www.youtube.com/results?search_query=Jonas+Lovv+YA+YA+YA+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,JonasLovv" },
  { id: "26", country: "Pologne", artist: "Alicja", song: "Pray", flag: "🇵🇱", youtubeUrl: "https://www.youtube.com/results?search_query=Alicja+Pray+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,Alicja" },
  { id: "27", country: "Portugal", artist: "Bandidos do Cante", song: "Rosa", flag: "🇵🇹", youtubeUrl: "https://www.youtube.com/results?search_query=Bandidos+do+Cante+Rosa+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,BandidosDoCante" },
  { id: "28", country: "Roumanie", artist: "Alexandra Căpitănescu", song: "Choke Me", flag: "🇷🇴", youtubeUrl: "https://www.youtube.com/results?search_query=Alexandra+Căpitănescu+Choke+Me+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,AlexandraCapitanescu" },
  { id: "29", country: "Saint‑Marin", artist: "Senhit", song: "Superstar", flag: "🇸🇲", youtubeUrl: "https://www.youtube.com/results?search_query=Senhit+Superstar+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,Senhit" },
  { id: "30", country: "Serbie", artist: "Lavina", song: "Kraj Mene", flag: "🇷🇸", youtubeUrl: "https://www.youtube.com/results?search_query=Lavina+Kraj+Mene+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,Lavina" },
  { id: "31", country: "Espagne", artist: "Tony Grox & Lucycalys", song: "T Amaré", flag: "🇪🇸", youtubeUrl: "https://www.youtube.com/results?search_query=Tony+Grox+Lucycalys+T+Amaré+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,TonyGrox" },
  { id: "32", country: "Suède", artist: "Felicia", song: "My System", flag: "🇸🇪", youtubeUrl: "https://www.youtube.com/results?search_query=Felicia+My+System+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,Felicia" },
  { id: "33", country: "Suisse", artist: "Veronica Fusaro", song: "Alice", flag: "🇨🇭", youtubeUrl: "https://www.youtube.com/results?search_query=Veronica+Fusaro+Alice+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,VeronicaFusaro" },
  { id: "34", country: "Ukraine", artist: "LELÉKA", song: "Ridnym", flag: "🇺🇦", youtubeUrl: "https://www.youtube.com/results?search_query=LELÉKA+Ridnym+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,LELEKA" },
  { id: "35", country: "Royaume‑Uni", artist: "Look Mum No Computer", song: "Eins, Zwei, Drei", flag: "🇬🇧", youtubeUrl: "https://www.youtube.com/results?search_query=Look+Mum+No+Computer+Eins+Zwei+Drei+Eurovision+2026", photoUrl: "https://source.unsplash.com/featured/?singer,LookMumNoComputer" }
];
