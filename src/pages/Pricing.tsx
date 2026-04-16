import { Navigate } from "react-router-dom";

// /pricing now redirects to the canonical $19.99 sales page.
// All previous freemium/49/199/299 pricing has been removed.
const Pricing = () => <Navigate to="/initial-pricing" replace />;

export default Pricing;
