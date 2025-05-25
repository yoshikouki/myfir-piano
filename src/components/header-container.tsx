import { UserMenu } from "@/components/user-menu";

type HeaderContainerProps = {
  children: React.ReactNode;
};

export function HeaderContainer({ children }: HeaderContainerProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="container mx-auto px-2">
        <div className="flex h-16 items-center justify-between">
          {children}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
