import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Imprint = () => {
  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-8">
          Imprint (Impressum)
        </h1>

        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none p-8 space-y-6">
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
              <p className="text-muted-foreground">
                [Managing Director / Owner Name]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">VAT Identification Number</h2>
              <p className="text-muted-foreground">
                VAT ID according to §27a of the German VAT Act: [DE XXXXXXXXX]
              </p>
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
              <p className="text-muted-foreground">
                [Name of responsible person]<br />
                [Address of responsible person]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">EU Online Dispute Resolution</h2>
              <p className="text-muted-foreground">
                The European Commission provides a platform for online dispute resolution (ODR):&nbsp;
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://ec.europa.eu/consumers/odr
                </a>
                <br />
                Our email address can be found above in the imprint.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Consumer Dispute Resolution / Universal Arbitration Board</h2>
              <p className="text-muted-foreground">
                We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Liability for Content</h2>
              <p className="text-muted-foreground">
                As a service provider, we are responsible for our own content on these pages under general law according to § 7 para.1 TMG. According to §§ 8 to 10 TMG, however, we as a service provider are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under the general laws remain unaffected. Liability in this regard, however, is only possible from the time of knowledge of a specific infringement. Upon notification of such violations, we will remove this content immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Liability for Links</h2>
              <p className="text-muted-foreground">
                Our offer contains links to external websites of third parties, the content of which we have no influence on. Therefore, we cannot accept any liability for this third-party content. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. Permanent monitoring of the linked pages is unreasonable without concrete evidence of a violation of the law. If we become aware of any infringements, we will remove such links immediately.
              </p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground italic">
                Please replace the placeholder values in brackets with your actual business information before publishing.
              </p>
            </div>
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
