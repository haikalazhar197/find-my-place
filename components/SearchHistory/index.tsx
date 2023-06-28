import { useState } from "react";
import { Drawer } from "antd";
import { History } from "tabler-icons-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getLocation } from "@/store/locationSlice";
import { on } from "events";

export const SearchHistory = () => {
  const [open, setOpen] = useState(false);

  // GET THE LOCATION FROM THE STORE
  const { history } = useAppSelector((state) => ({
    history: state.location.history,
  }));

  // DISPATCH
  const dispatch = useAppDispatch();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        className="flex border border-gray-300 items-center justify-center gap-1 absolute top-5 right-5 z-10 rounded-md shadow-md bg-white p-2 text-sm font-normal text-gray-700 hover:bg-gray-100"
        onClick={showDrawer}
      >
        <span className="hidden md:block">history</span>
        <History size={15} />
      </button>
      <Drawer
        title="Search History"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div className="flex flex-col gap-2 divide-y-[1px]">
          {history.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                onClose();
                dispatch(getLocation(item.place_address || ""));
              }}
              className="py-4 px-4 rounded-md hover:bg-gray-50 text-left"
            >
              <p>{item.place_address || "This is the address"}</p>
            </button>
          ))}
        </div>
      </Drawer>
    </>
  );
};
