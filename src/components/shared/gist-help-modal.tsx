import Icon from "@/components/icon";

type GistHelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const gistDocsUrl = "https://docs.github.com/en/rest/gists/gists";
const tokenDocsUrl =
  "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens";

export default function GistHelpModal({ isOpen, onClose }: GistHelpModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/20 px-4 py-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gist-help-title"
    >
      <div className="w-full max-w-4xl rounded-[2rem] border border-white/80 bg-white/95 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.65)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-pink-700">
              <Icon name="github" className="h-4 w-4" />
              GitHub Gist
            </div>
            <h2
              id="gist-help-title"
              className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl"
            >
              Import a manifest from Gist
            </h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
              Public Gists work for most imports. Tokens are only for private or
              write-access GitHub actions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Gist help"
            className="rounded-md border border-slate-300 bg-white/80 px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Close
          </button>
        </div>

        <div className="grid gap-3.5 px-5 py-4">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-pink-600">
              Basic import
            </h3>
            <ol className="mt-3 grid gap-3 text-sm leading-5 text-slate-700 md:grid-cols-3">
              <li className="rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5">
                <strong className="block text-slate-950">
                  1. Create a Gist
                </strong>
                Add your manifest JSON as a file at gist.github.com.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5">
                <strong className="block text-slate-950">
                  2. Make it public
                </strong>
                Public Gists can usually be imported without a token.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5">
                <strong className="block text-slate-950">
                  3. Paste the URL
                </strong>
                Copy the Gist URL or ID into the Gallery import box.
              </li>
            </ol>
          </section>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
            <section className="rounded-xl border border-blue-200 bg-blue-50/90 px-3 py-2.5">
              <h3 className="text-sm font-black text-slate-950">
                When do you need a token?
              </h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-700">
                A token is only needed for authenticated GitHub actions, such as
                creating, updating, or accessing private Gists. Use the smallest
                permission set possible, usually Gists write permission for Gist
                editing.
              </p>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-pink-600">
                Useful GitHub links
              </h3>
              <div className="mt-3 grid gap-2">
                <a
                  href="https://gist.github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-blue-700 underline underline-offset-2 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-900"
                >
                  Create a Gist
                </a>
                <a
                  href={gistDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-blue-700 underline underline-offset-2 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-900"
                >
                  GitHub Gist API docs
                </a>
                <a
                  href={tokenDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-blue-700 underline underline-offset-2 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-900"
                >
                  GitHub token setup docs
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
