import CreateNewManifestLink from "@/components/navbar/createNewManifestLink";

export default function CreateProjectCard() {
    return (
        <div className={`
            flex items-center justify-center w-full h-full
            cursor-pointer  rounded-lg shadow-lg transition hover:border-slate-600 hover:text-slate-900`}>
            <CreateNewManifestLink linkActiveStyle="text-slate-900" linkInactiveStyle="text-slate-600">
                + Create New Project
            </CreateNewManifestLink>
        </div>
    )
}