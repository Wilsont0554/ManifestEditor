type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="manifest-tabs-scroll relative h-full w-full overflow-y-auto bg-white">
      <div className="relative mx-auto w-full max-w-[1500px] px-5 pt-10 pb-20 sm:px-8 lg:px-12">
        {children}
      </div>
    </div>
  );
}
