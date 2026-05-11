import Icon from "@/components/icon";

type DeveloperLink = {
  label: string;
  href: string;
  icon: "github" | "link";
};

type Developer = {
  name: string;
  username: string;
  email?: string;
  avatarSrc: string;
  links: DeveloperLink[];
};

const developers: Developer[] = [
  {
    name: "Jacob Way",
    username: "jacobbbway",
    email: "jacobbbway1997@gmail.com",
    avatarSrc: "https://avatars.githubusercontent.com/u/183834087?v=4",
    links: [
      {
        label: "github.com/jacobbbway",
        href: "https://github.com/jacobbbway",
        icon: "github",
      },
    ],
  },
  {
    name: "Thomas Wilson",
    username: "Wilsont0554",
    email: "thomasawilson04@gmail.com",
    avatarSrc: "https://github.com/Wilsont0554.png",
    links: [
      {
        label: "github.com/Wilsont0554",
        href: "https://github.com/Wilsont0554",
        icon: "github",
      },
    ],
  },
  {
    name: "Simon Cao",
    username: "sonminhnguyen2000",
    email: "sonminhnguyen2000@gmail.com",
    avatarSrc: "https://github.com/sonminhnguyen2000.png",
    links: [
      {
        label: "github.com/sonminhnguyen2000",
        href: "https://github.com/sonminhnguyen2000",
        icon: "github",
      },
    ],
  },
  {
    name: "Pradeep Pandey",
    username: "pandeyp1426",
    email: "pradeeppandey0912@gmail.com",
    avatarSrc: "https://github.com/pandeyp1426.png",
    links: [
      {
        label: "github.com/pandeyp1426",
        href: "https://github.com/pandeyp1426",
        icon: "github",
      },
      {
        label: "pandeyp1426.github.io/my_website",
        href: "https://pandeyp1426.github.io/my_website/",
        icon: "link",
      },
    ],
  },
  {
    name: "Grant Ingram",
    username: "Grantingram1",
    avatarSrc: "https://github.com/Grantingram1.png",
    links: [
      {
        label: "github.com/Grantingram1",
        href: "https://github.com/Grantingram1",
        icon: "github",
      },
    ],
  },
  {
    name: "Trent Geno",
    username: "TrentGeno",
    avatarSrc: "https://github.com/TrentGeno.png",
    links: [
      {
        label: "github.com/TrentGeno",
        href: "https://github.com/TrentGeno",
        icon: "github",
      },
    ],
  },
];

function DeveloperCard({ developer }: { developer: Developer }) {
  return (
    <article className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <img
          src={developer.avatarSrc}
          alt={`${developer.name} GitHub avatar`}
          className="h-24 w-24 rounded-2xl border border-slate-200 bg-slate-100 object-cover shadow-sm"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                {developer.name}
              </h2>
              <p className="text-sm font-semibold text-pink-600">
                @{developer.username}
              </p>
            </div>
            {developer.email && (
              <a
                href={`mailto:${developer.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink-600"
              >
                <Icon name="mail" className="h-4 w-4" />
                Email
              </a>
            )}
          </div>

          <div className="mt-5 grid gap-3">
            {developer.email && (
              <a
                href={`mailto:${developer.email}`}
                className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-slate-950"
              >
                <Icon name="mail" className="h-5 w-5 shrink-0 text-pink-600" />
                <span className="truncate">{developer.email}</span>
              </a>
            )}

            {developer.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-slate-950"
              >
                <Icon
                  name={link.icon}
                  className="h-5 w-5 shrink-0 text-blue-600"
                />
                <span className="truncate">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DevelopersPage() {
  return (
    <div className="manifest-tabs-scroll h-full w-full overflow-y-auto bg-[radial-gradient(circle_at_top_left,#fce7f3_0,#f8fafc_28rem,#eaf2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 pb-8">
        <section className="overflow-hidden rounded-[1.25rem] border border-white/80 bg-slate-950 p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.24)] sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-lg border border-pink-400/50 bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-100">
              Project Team
            </div>
            <h1 className="mt-6 text-5xl font-black leading-none tracking-tight sm:text-6xl">
              Developers behind Manifest Editor.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Contact the team, review GitHub profiles, and follow the work
              behind the IIIF 3D manifest editing experience.
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {developers.map((developer) => (
            <DeveloperCard key={developer.username} developer={developer} />
          ))}
        </section>
      </div>
    </div>
  );
}
