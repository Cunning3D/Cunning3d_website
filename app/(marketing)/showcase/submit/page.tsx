import { ShowcaseSubmitClient } from "@/components/showcase/showcase-submit-client";

function isGitHubOAuthConfigured() {
  return Boolean(
    process.env.GITHUB_OAUTH_CLIENT_ID &&
      process.env.GITHUB_OAUTH_CLIENT_SECRET &&
      process.env.GITHUB_OAUTH_COOKIE_SECRET
  );
}

export default function ShowcaseSubmitPage() {
  const oauthEnabled = isGitHubOAuthConfigured();
  const submissionsRepo =
    process.env.SHOWCASE_SUBMISSIONS_REPO || "Cunning3D/Cunning3d_website";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">
      <div className="container py-12">
        <div className="max-w-3xl">
          <div className="text-xs text-muted-foreground mb-2">Community</div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Submit to Showcase
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Upload a <code>.cda</code> (and an optional cover image) to create a
            GitHub Pull Request. After review, it will appear on the public
            Showcase.
          </p>

          <ShowcaseSubmitClient
            oauthEnabled={oauthEnabled}
            submissionsRepo={submissionsRepo}
          />
        </div>
      </div>
    </div>
  );
}

