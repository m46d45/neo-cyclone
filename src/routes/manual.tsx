import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DIST_TABLE,
  GENERAL_TEMPLATE,
  PRODUCT_TAGLINE,
} from "@/lib/cyclone/prompt-template";

export const Route = createFileRoute("/manual")({ component: ManualPage });

function ManualPage() {
  return (
    <div className="halpin-shell min-h-dvh text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md pt-[var(--grok-banner-h,0px)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <h1 className="font-display text-base font-semibold">Neo-CYCLONE Manual</h1>
            <Badge variant="secondary" className="border-primary/25 bg-primary/10 text-primary">
              v1.4
            </Badge>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="size-3.5" />
              Studio
            </Link>
          </Button>
        </div>
        <div className="gold-rule" />
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
          {PRODUCT_TAGLINE}
        </p>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part I — Getting oriented
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 1 — Introduction
          </h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">1.1 Purpose</h3>
          <div className="mt-2 space-y-3 text-[15px] leading-[1.7]">
            <p>
              Neo-CYCLONE is an <strong className="text-foreground">educational web app</strong> for
              modeling and simulating <strong className="text-foreground">repetitive construction
              operations</strong> in the spirit of Professor{" "}
              <strong className="text-foreground">Daniel W. Halpin’s CYCLONE</strong>{" "}
              (<em>CYCLic Operations NEtwork</em>).
            </p>
            <p>
              It is meant for first contact with construction operations as flow, measuring idleness,
              connecting process design to Lean Construction / Project Production Management, and
              learning classic MicroCYCLONE ideas without old desktop software.
            </p>
            <p>
              It is <strong className="text-foreground">not</strong> a special-purpose industrial
              factory controller. It is a <strong className="text-foreground">teaching studio</strong>.
            </p>
          </div>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.2 Why this exists (dedication)
          </h3>
          <div className="mt-2 space-y-3 text-[15px] leading-[1.7]">
            <p>
              This product is a <strong className="text-foreground">tribute to Professor Daniel W.
              Halpin</strong>. Through his teaching and work, many students first met flow, idleness,
              and CYCLONE as a simple network language for cyclic construction work.
            </p>
            <p>
              Historical line: <strong className="text-foreground">CYCLONE</strong> (methodology),
              <strong className="text-foreground">MicroCYCLONE</strong> (early computer tool), then
              DISCO, PROSIDYC, COST, WebCYCLONE, Simphony / Symphony.Net, and related systems.
            </p>
            <p>
              Halpin’s foundation is not obsolete in the age of AI — it is the{" "}
              <strong className="text-foreground">grammar</strong> that lets us describe an operation
              clearly enough that a machine can build a model and run a simulation.
            </p>
          </div>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.3 Approach — is this an “AI agent”?
          </h3>
          <div className="mt-2 space-y-3 text-[15px] leading-[1.7]">
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[14px] text-foreground">
              <strong>In practice:</strong> prompt-first → <strong>Draw Model</strong> → check
              network → <strong>Simulate</strong>. Examples and Format Prompt are ordinary structured
              text, not magic. See Chapter 8 for the literature behind this tradition.
            </p>
          </div>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.4 Studio layout
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Left:</strong> Prompt · Example · Draw Model · Format
              Prompt reference
            </li>
            <li>
              <strong className="text-foreground">Right:</strong> CYCLONE Model (empty until Draw) ·
              network logic · run parameters
            </li>
            <li>
              <strong className="text-foreground">Below:</strong> Results — Simulation · Sensitivity
              Analysis
            </li>
          </ul>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part II — How to use
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 2 — How-to
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs">
            <li>Select an Example (fills prompt only) or write a Format Prompt.</li>
            <li>
              Click <strong className="text-foreground">Draw Model</strong> — inspect cycles, meetings,
              counter.
            </li>
            <li>
              Set max cycles (default 100, limit 500) and seed (default 12345).
            </li>
            <li>
              Click <strong className="text-foreground">Simulate</strong> — productivity, waste, cost.
            </li>
            <li>Optional Sensitivity tab and Excel / PNG export.</li>
          </ol>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part III — Teaching examples
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 3 — Six Examples
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1 pl-5 text-xs">
            <li>Earthmoving — classic fleet; cost; steady state</li>
            <li>Asphalt Paving — branch probability</li>
            <li>Loading Dump Truck — GEN / CON</li>
            <li>Tower Crane — multi-demand, Priority, multi-counter</li>
            <li>Masonry — face stocks; sensitivity intro</li>
            <li>Precast Plant — Halpin Ch.14-style + complex SA</li>
          </ol>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part IV — Format Prompt & rules
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 4 — Format Prompt
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-2 text-xs">
            Block order: Network → Durations → Priority → Branch → Cost → Sensitivity (last).
          </p>
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[11px] text-foreground">
            {GENERAL_TEMPLATE}
          </pre>
        </section>

        <Section title="Distributions (minutes)">
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-background p-3 font-mono text-[11px] text-foreground">
            {DIST_TABLE}
          </pre>
        </Section>

        <Section title="Chapter 5–7 — Rules, results, limits">
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>Home QUEUE per resource; COMBI if ≥2 resources meet; return only to home QUEUE.</li>
            <li>GEN ▽ / CON △ optional and independent; exact Counter after: names.</li>
            <li>Results: production by cycle, steady state, idleness, cost, sensitivity tabs.</li>
            <li>Max cycles 100 default / 500 max; seed 12345; deploy from GitHub main → Vercel.</li>
          </ul>
        </Section>

        {/* —— References —— */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Literature
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 8 — References
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-4 text-xs">
            Selected works on <strong className="text-foreground">CYCLONE</strong>,{" "}
            <strong className="text-foreground">MicroCYCLONE</strong>, and applications from{" "}
            <strong className="text-foreground">Daniel W. Halpin</strong>, his students, and
            collaborators. Educational list — not exhaustive.
          </p>

          <h3 className="font-display text-sm font-semibold text-foreground">
            Foundations — CYCLONE methodology
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              <strong className="text-foreground">Halpin, D. W.</strong> (1973).{" "}
              <em>An Investigation of the Use of Simulation Networks for Modeling Construction
              Operations</em>. Ph.D. dissertation, University of Illinois at Urbana–Champaign.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W.</strong> (1977). “CYCLONE: Method for
              Modeling of Job Site Processes.” <em>Journal of the Construction Division</em>, ASCE,
              103(3), 489–499.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W., & Riggs, L. S.</strong> (1992).{" "}
              <em>Planning and Analysis of Construction Operations</em>. New York: John Wiley &
              Sons. ISBN 0-471-55510-X.
            </li>
          </ol>

          <h3 className="font-display mt-5 text-sm font-semibold text-foreground">
            MicroCYCLONE
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed" start={4}>
            <li>
              <strong className="text-foreground">Lluch, J., & Halpin, D. W.</strong> (1982).
              “Construction Operations and Microcomputers.” <em>Journal of the Construction
              Division</em>, ASCE, 108(1), 129–145.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W.</strong> (1990). <em>MicroCYCLONE
              User’s Manual</em> / <em>System Manual</em>. Division of Construction Engineering and
              Management, Purdue University, West Lafayette, IN.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W.</strong> (1992). <em>MicroCYCLONE Users
              Manual for Construction Operations</em>. Learning Systems, Inc. / Purdue University.
            </li>
          </ol>

          <h3 className="font-display mt-5 text-sm font-semibold text-foreground">
            DISCO (Huang & Halpin)
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed" start={7}>
            <li>
              <strong className="text-foreground">Huang, R.-Y., & Halpin, D. W.</strong> (1993).
              “Dynamic Interface Simulation for Construction Operations (DISCO).” <em>Proceedings of
              the 10th ISARC</em>, Houston, 503–510.
            </li>
            <li>
              <strong className="text-foreground">Huang, R.-Y., & Halpin, D. W.</strong> (1994).
              “Visual Construction Operation Simulation: The DISCO Approach.” <em>Microcomputers in
              Civil Engineering</em>, 9(3), 175–184.
            </li>
            <li>
              <strong className="text-foreground">Huang, R.-Y.</strong> (1994). <em>A Graphical-Based
              Method for Transient Evaluation of Construction Operations</em>. Ph.D. dissertation,
              Purdue University (advisor: D. W. Halpin).
            </li>
            <li>
              <strong className="text-foreground">Huang, R.-Y., & Halpin, D. W.</strong> (1995).
              “Graphical-Based Method for Transient Evaluation of Construction Operations.”{" "}
              <em>Journal of Construction Engineering and Management</em>, ASCE, 121(2), 222–229.
            </li>
            <li>
              <strong className="text-foreground">Huang, R.-Y., Grigoriadis, A. M., & Halpin, D.
              W.</strong> (1994). “Simulation of Cable-Stayed Bridges Using DISCO.” <em>Winter
              Simulation Conference</em>, 1130–1136.
            </li>
          </ol>

          <h3 className="font-display mt-5 text-sm font-semibold text-foreground">
            PROSIDYC · COST · WebCYCLONE
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed" start={12}>
            <li>
              <strong className="text-foreground">Halpin, D. W., & Martinez, L.-H.</strong> (1999).
              “Real World Applications of Construction Process Simulation.” <em>Winter Simulation
              Conference</em>, 956–962. (PROSIDYC — Dragados / Purdue.)
            </li>
            <li>
              <strong className="text-foreground">Cheng, T.-M., Wu, H.-T., & Tseng, Y.-W.</strong>{" "}
              (2000). “Construction Operation Simulation Tool — COST.” <em>17th ISARC</em>, 999–1004.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W., Jen, H., & Kim, J.</strong> (2003).
              “A Construction Process Simulation Web Service.” <em>Winter Simulation Conference</em>,
              Vol. 2, New Orleans, 1503–1509. (WebCYCLONE.)
            </li>
          </ol>

          <h3 className="font-display mt-5 text-sm font-semibold text-foreground">
            Purdue / Halpin-circle analysis papers
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed" start={15}>
            <li>
              <strong className="text-foreground">AbouRizk, S. M., & Halpin, D. W.</strong> (1990).
              “Probabilistic Simulation Studies for Repetitive Construction Processes.” <em>J. Constr.
              Eng. Manage.</em>, ASCE, 116(4), 575–594.
            </li>
            <li>
              <strong className="text-foreground">Hijazi, A., AbouRizk, S. M., & Halpin, D.
              W.</strong> (1992). “Modeling and Simulating Learning Development in Construction.”{" "}
              <em>J. Constr. Eng. Manage.</em>, ASCE, 118(4), 685–700.
            </li>
            <li>
              <strong className="text-foreground">Lutz, J. D., Halpin, D. W., & Wilson, J.
              R.</strong> (1994). “Simulation of Learning Development in Repetitive Construction.”{" "}
              <em>J. Constr. Eng. Manage.</em>, ASCE, 120(4), 753–773.
            </li>
            <li>
              <strong className="text-foreground">Gonzalez-Quevedo, A. A.</strong> (c. 1991).{" "}
              <em>Sensitivity Analysis of Construction Simulation</em>. Ph.D. dissertation, Purdue
              University (advisor: D. W. Halpin).
            </li>
            <li>
              <strong className="text-foreground">Abraham, D. M., & Halpin, D. W.</strong> (1998).
              “Simulation of the Construction of Cable-Stayed Bridges.” <em>Canadian Journal of Civil
              Engineering</em>, 25(3), 490–499.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W., Sawhney, A., & AbouRizk, S.
              M.</strong> (1998). “Construction Project Simulation Using CYCLONE.” <em>Canadian Journal
              of Civil Engineering</em>, 25(1), 16–25.
            </li>
            <li>
              <strong className="text-foreground">AbouRizk, S., Halpin, D., Mohamed, Y., & Hermann,
              U.</strong> (2011). “Research in Modeling and Simulation for Improving Construction
              Engineering Operations.” <em>J. Constr. Eng. Manage.</em>, ASCE, 137(10), 843–852.
            </li>
          </ol>

          <h3 className="font-display mt-5 text-sm font-semibold text-foreground">
            Related lineage (often taught with CYCLONE)
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed" start={22}>
            <li>
              <strong className="text-foreground">Ioannou, P. G.</strong> (1989). UM-CYCLONE (University
              of Michigan).
            </li>
            <li>
              <strong className="text-foreground">Martinez, J. C.</strong> (1996). STROBOSCOPE — state-
              and resource-based construction process simulation.
            </li>
            <li>
              <strong className="text-foreground">Hajjar, D., & AbouRizk, S. M.</strong> (1999).
              “Simphony: An Environment for Building Special Purpose Construction Simulation Tools.”{" "}
              <em>Winter Simulation Conference</em>, 998–1006. (Later Simphony.NET, University of
              Alberta.)
            </li>
            <li>
              <strong className="text-foreground">AbouRizk, S., Hague, S., Ekyalimpa, R., & Newstead,
              S.</strong> (2016). “Simphony: A Next Generation Simulation Modelling Environment for the
              Construction Domain.” <em>Journal of Simulation</em>, 10(3), 207–215.
            </li>
          </ol>

          <p className="mt-4 rounded-[var(--radius-md)] border border-border bg-muted/20 px-3 py-2.5 text-xs">
            Neo-CYCLONE does <strong className="text-foreground">not</strong> replace MicroCYCLONE,
            DISCO, COST, WebCYCLONE, or Simphony. It is an educational, AI-assisted studio that keeps
            Halpin’s modeling grammar visible for first contact with construction operations as flow
            and idleness.
          </p>
        </section>

        <section className="rounded-[var(--radius-md)] border border-border bg-muted/20 px-4 py-3">
          <p className="font-mono text-[11px] leading-relaxed text-foreground">
            1. Select Example OR write Format Prompt{"\n"}
            2. Draw Model → inspect cycles / meetings / counter{"\n"}
            3. Simulate → productivity, waste, cost{"\n"}
            4. Sensitivity → if Sensitivity: block present{"\n"}
            5. Export → Excel / PNG as needed
          </p>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          {PRODUCT_TAGLINE} · Manual v1.4
        </p>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <div className="gold-rule my-2 max-w-xs" />
      <div className="mt-2">{children}</div>
    </section>
  );
}
