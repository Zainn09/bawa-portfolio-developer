import { Handshake, Braces, MonitorSmartphone, RefreshCw } from "lucide-react";
const principles = [
  {
    icon: Handshake,
    title: "Direct collaboration",
    detail: "One developer. A shared direction.",
  },
  {
    icon: Braces,
    title: "Custom, maintainable builds",
    detail: "Your brand. Not a borrowed template.",
  },
  {
    icon: MonitorSmartphone,
    title: "Every screen considered",
    detail: "Desktop detail. Mobile intention.",
  },
  {
    icon: RefreshCw,
    title: "Beyond-launch support",
    detail: "Built to evolve, not stand still.",
  },
];
export default function TrustBadges() {
  return (
    <aside
      className="trust-principles container"
      aria-label="Working principles, not certifications"
    >
      {principles.map(({ icon: Icon, title, detail }) => (
        <div className="trust-badge" key={title}>
          <span className="trust-icon">
            <Icon size={19} strokeWidth={1.3} />
          </span>
          <div>
            <strong>{title}</strong>
            <p>{detail}</p>
          </div>
        </div>
      ))}
    </aside>
  );
}
