const AccessInfoBlock = () => (
  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-left text-sm space-y-2">
    <p>
      <strong>Access URL:</strong>{" "}
      <a href="https://astrovibe.online/auth" className="text-primary underline">
        astrovibe.online/auth
      </a>
    </p>
    <p className="text-muted-foreground">
      Your account is upgraded automatically after purchase. Login with the same email used at checkout. All features unlock instantly.
    </p>
    <p className="text-muted-foreground">
      <strong>Support:</strong>{" "}
      <a href="mailto:andrewjimmer692@gmail.com" className="text-primary underline">
        andrewjimmer692@gmail.com
      </a>
    </p>
  </div>
);

export default AccessInfoBlock;