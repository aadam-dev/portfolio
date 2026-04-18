"use client";

import KoyiPreview from "./KoyiPreview";
import PrimeHubPreview from "./PrimeHubPreview";
import EthikaPreview from "./EthikaPreview";
import AnisFoodsPreview from "./AnisFoodsPreview";
import RentcheckPreview from "./RentcheckPreview";
import LenusPreview from "./LenusPreview";
import LadyAngelPreview from "./LadyAngelPreview";
import MadinaBasketballPreview from "./MadinaBasketballPreview";
import ProNajPreview from "./ProNajPreview";
import MakossaPreview from "./MakossaPreview";
import GaskiyaPreview from "./GaskiyaPreview";
import ThePalmsPreview from "./ThePalmsPreview";
import MagiloPreview from "./MagiloPreview";
import RockmotionPreview from "./RockmotionPreview";
import JirehPreview from "./JirehPreview";
import SIIFPreview from "./SIIFPreview";
import ChaleSocksPreview from "./ChaleSocksPreview";
import RedrowPreview from "./RedrowPreview";
import EnterpriseErpPreview from "./EnterpriseErpPreview";

interface Props {
  projectId: string;
  screen: string;
}

export default function PreviewRouter({ projectId, screen }: Props) {
  switch (projectId) {
    case "koyi":
      return <KoyiPreview screen={screen} />;
    case "primehub":
      return <PrimeHubPreview screen={screen} />;
    case "ethika":
      return <EthikaPreview screen={screen} />;
    case "anisfoods":
      return <AnisFoodsPreview screen={screen} />;
    case "rentcheck":
      return <RentcheckPreview screen={screen} />;
    case "lenus":
      return <LenusPreview screen={screen} />;
    case "ladyangel":
      return <LadyAngelPreview screen={screen} />;
    case "madinabasketball":
      return <MadinaBasketballPreview screen={screen} />;
    case "pronaj":
      return <ProNajPreview screen={screen} />;
    case "makossa":
      return <MakossaPreview screen={screen} />;
    case "gaskiya":
      return <GaskiyaPreview screen={screen} />;
    case "thepalms":
      return <ThePalmsPreview screen={screen} />;
    case "magilo":
      return <MagiloPreview screen={screen} />;
    case "rockmotion":
      return <RockmotionPreview screen={screen} />;
    case "jireh":
      return <JirehPreview screen={screen} />;
    case "siif":
      return <SIIFPreview screen={screen} />;
    case "chalesocks":
      return <ChaleSocksPreview screen={screen} />;
    case "redrow":
      return <RedrowPreview screen={screen} />;
    case "enterprise-erp":
      return <EnterpriseErpPreview screen={screen} />;
    default:
      return (
        <div style={{ background: "#0A0A0F", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Preview not available</p>
        </div>
      );
  }
}
