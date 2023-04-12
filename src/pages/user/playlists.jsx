import React, { useEffect, useState } from "react";
import Tile from "@components/tile/tile";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { CgSpinner } from "react-icons/cg";

const MyPlaylists = () => {
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createPlaylist = async () => {
    try {
      setIsLoading(true);
      const name = document.getElementById("name").value.trim();
      const { data } = await axios.post("/api/user/playlists", {
        name,
        userId: "narmit",
      });
      if (data?.success) {
        setIsOpen(false);
        fetchUserPlaylists();
      } else {
        // TODO show error
      }
      setIsLoading(false);
    } catch (error) {
      // TODO show error
      setIsLoading(false);
    }
  };

  async function fetchUserPlaylists() {
    const { data } = await axios("/api/user/playlists");
    console.log("user playlists", data);
    setUserPlaylists(data?.items);
  }

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  return (
    <>
      <MainLayout>
        <div className="mx-auto px-4 sm:px-8 lg:px-12 my-4 lg:my-6">
          <div className="flex flex-row flex-wrap justify-start content-start gap-5">
            <button
              type="button"
              className="relative block w-48 h-48 rounded-lg border-2 border-dashed border-gray-600 p-12 text-center hover:border-gray-400 focus:outline-none"
              onClick={() => setIsOpen(true)}
            >
              <div className="flex flex-col justify-center items-center">
                <span className="text-2xl font-semibold text-gray-300 text-center">
                  <FiPlus />
                </span>
                <span className="mt-1 text-sm font-semibold text-gray-300">
                  Create a new playlist
                </span>
              </div>
            </button>
            {userPlaylists &&
              userPlaylists?.length > 0 &&
              userPlaylists.map((playlist) => (
                <Tile key={playlist?.id} data={playlist} />
              ))}
          </div>
        </div>

        <Transition.Root show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-slate-800 bg-opacity-60 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                      <div className="text-center">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-100"
                        >
                          Create a playlist
                        </Dialog.Title>
                        <div className="mt-2">
                          <div>
                            <label htmlFor="name" className="sr-only">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="bg-slate-900 px-2 block w-full rounded-md border-0 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus-visible:outline-none"
                              placeholder="Name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={createPlaylist}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <CgSpinner className="animate-spin text-lg" />
                        )}
                        <span className="pl-2">Save</span>
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </MainLayout>
    </>
  );
};

export default MyPlaylists;
