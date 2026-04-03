import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Imprint = () => {
  const [customContent, setCustomContent] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "page_content")
      .maybeSingle();
    if (data?.value) {
      const val = data.value as any;
      if (val.imprint_content) setCustomContent(val.imprint_content);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-8">
          Imprint (Impressum)
        </h1>

        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none p-8 space-y-6">
            {customContent ? (
              <div className="whitespace-pre-wrap text-muted-foreground">{customContent}</div>
            ) : (
              <>
                <section>
                  <h2 className="text-xl font-semibold text-foreground">Information according to § 5 TMG</h2>
                  <p className="text-muted-foreground">
                    <strong>Company Name:</strong> [Your Company Name]<br />
                    <strong>Street Address:</strong> [Your Street Address]<br />
                    <strong>Postal Code / City:</strong> [ZIP Code, City]<br />
                    <strong>Country:</strong> [Country, e.g. Germany]
                  </p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold text-foreground">Contact</h2>
                  <p className="text-muted-foreground">
                    <strong>Phone:</strong> [Your Phone Number]<br />
                    <strong>Email:</strong> [your-email@example.com]<br />
                    <strong>Website:</strong> astrovibe.online
                  </p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold text-foreground">Represented by</h2>
                  <p className="text-muted-foreground">[Managing Director / Owner Name]</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold text-foreground">VAT Identification Number</h2>
                  <p className="text-muted-foreground">VAT ID according to §27a of the German VAT Act: [DE XXXXXXXXX]</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold text-foreground">Register Entry</h2>
                  <p className="text-muted-foreground">
                    Registered in the commercial register.<br />
                    <strong>Registration Court:</strong> [Court Name]<br />
                    <strong>Registration Number:</strong> [HRB XXXXX]
                  </p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold text-foreground">Responsible for content according to § 55 Abs. 2 RStV</h2>
                  <p className="text-muted-foreground">[Name of responsible person]<br />[Address of responsible person]</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold text-foreground">EU Online Dispute Resolution</h2>
                  <p className="text-muted-foreground">
                    The European Commission provides a platform for online dispute resolution (ODR):&nbsp;
                    <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://ec.europa.eu/consumers/odr
                    </a>
                  </p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold text-foreground">Consumer Dispute Resolution</h2>
                  <p className="text-muted-foreground">
                    We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                  </p>
                </section>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    Please replace the placeholder values in brackets with your actual business information. You can edit this content from Admin &gt; Manage Pages.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
