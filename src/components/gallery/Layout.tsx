type Props = {
  children: React.ReactNode;
};

/**
 * Layout wrapper for the Gallery page. 
 * @param param0 - the content of the page
 * @returns layout component for the Gallery page
 */
export default function Layout({ children }: Props) {
  return (
    <div className="manifest-tabs-scroll relative h-full w-full overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top_left,#fce7f3_0,#f8fafc_28rem,#eaf2ff_100%)]">
      <div className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 pb-20 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
