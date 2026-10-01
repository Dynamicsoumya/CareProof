import { NavLink, Outlet } from "react-router-dom";

const links = [
  ["/dashboard", "Overview"],
  ["/patients", "Patients"],
  ["/standard", "Standard"],
  ["/equipment", "Equipment"],
  ["/caregivers", "Caregivers"],
  ["/passport", "Passport"],
  ["/incident", "Surprise incident"],
  ["/research", "Research"],
  ["/evidence", "Evidence"],
];

export function Shell() {
  return (
    <div className="shell">
      <aside className="side">
        <NavLink to="/" className="brand"><span className="mark">C</span>CareProof</NavLink>
        <p className="quiet-note">Simulated pilot · any country</p>
        <nav className="nav">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : undefined)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <NavLink to="/present">Open the 2-minute walkthrough</NavLink>
          <span className="quiet-note">Proposed framework. Not a clinical device.</span>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
