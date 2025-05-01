"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { AlertTriangle, X } from "lucide-react"

interface SecurityEntry {
  walletAddress: string
  userType: "Creator" | "Contributor" | "Admin"
  ethContributed: number
  projectsBacked: number
  lastActive: string
  status: "Active" | "Flagged" | "Suspended"
}

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  actionType: "flag" | "suspend" | null
  entry: SecurityEntry | null
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, actionType, entry }: ConfirmationModalProps) {
  if (!entry || !actionType) return null

  const title = actionType === "flag" ? "Flag Wallet" : "Suspend Wallet"
  const description =
    actionType === "flag"
      ? "Are you sure you want to flag this wallet? This will mark the wallet for further review."
      : "Are you sure you want to suspend this wallet? This will prevent the wallet from performing any actions on the platform."

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </Dialog.Title>
                  <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-2">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-md mb-4">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <p className="text-sm text-amber-700">{description}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
                    <p className="font-medium">{entry.walletAddress}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : entry.status === "Flagged"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={onConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
