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
    <div className="manifest-tabs-scroll relative h-full w-full overflow-y-auto bg-white">
      <div className="relative mx-auto w-full max-w-[1500px] px-5 pt-10 pb-20 sm:px-8 lg:px-12">
        {children}
      </div>
    </div>
  );
}
