import { clsx } from "clsx";

const Drawer = ({
  open,
  setOpen,
  side = "left",
  children
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  side?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      id={`dialog-${side}`}
      className="relative z-20 overflow-hidden right-[20px]"
      aria-labelledby="slide-over"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(!open)}
    >
      <div
        className={clsx(
          "fixed inset-0 bg-gray-500 bg-opacity-75 transition-all",
          {
            "opacity-100 duration-500 ease-in-out visible": open
          },
          { "opacity-0 duration-500 ease-in-out invisible": !open }
        )}
      ></div>
      <div className={clsx({ "fixed inset-0 overflow-hidden": open })}>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={clsx("pointer-events-none fixed max-w-full")}
            style={{ height: "-webkit-fill-available" }}
          >
            <div
              className={clsx(
                "pointer-events-auto relative w-full h-full transform transition ease-in-out duration-500",
                { ["-translate-x-full"]: !open },
                { ["translate-x-0"]: open }
              )}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <div className="flex flex-col h-full overflow-y-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
