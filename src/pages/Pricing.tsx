import InitialPricing from "./InitialPricing";

// /pricing IS the canonical sales page. We render the same component as
// /initial-pricing here so admins can link to either URL interchangeably
// and we don't double-bounce users with a Navigate redirect.
const Pricing = () => <InitialPricing />;

export default Pricing;
